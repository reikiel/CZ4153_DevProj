pragma solidity ^0.8.0;
import "./DGT.sol";
import "./Accounts.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Pool {
    using SafeMath for uint256;

    DGT public token;
    Accounts public accounts;
    uint256 public REWARD_AMOUNT = 100;

    /*
     * Ownership of Pool
     */
    address public driver;
    address[] councilMembers;
    mapping(address => bool) public isCouncilMember;

    /*
     * ADHOC TRANSFERS
     */
    struct AdhocTransfer {
        address to;
        uint256 amount;
        uint256 numApprovals;
        uint256 id;
        bool isApproved; // switched to true if approval condition met
        bool isActive; // if any operations can still be done on this Transfer
    }

    // Stores all adhoc tranfers
    AdhocTransfer[] adhocTransfers;

    // stores all council members that already voted
    mapping(uint256 => mapping(address => bool)) adhocTransferVotedCouncilMembers;

    /*
     * Multi-sig to change adhoc transfer threshold
     */

    // variables to keep track of minting and which council members approve minting of tokens
    bool minting = false;
    uint256 mintingAmount;
    mapping(address => bool) public voted;
    address[] approve; // keep track of length

    constructor(address _driver) {
        driver = _driver;
        isCouncilMember[driver] = true;
        councilMembers.push(_driver);
    }

    /*
     * Setup contracts
     */
    function setDgtAddress(address _dgtAddress) public {
        token = DGT(_dgtAddress);
    }

    function setAccountsAddress(address _accountsAddress) public {
        accounts = Accounts(_accountsAddress);
    }

    function viewPoolBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    /*
     * Modifiers
     */
    modifier isDriver() {
        require(driver == msg.sender, "Only driver can execute this function");
        _;
    }

    modifier isCouncil() {
        require(
            isCouncilMember[msg.sender],
            "Only council members can execute this function"
        );
        _;
    }

    modifier targetIsCouncil(address _target) {
        require(
            isCouncilMember[_target],
            "Operation can only be done on a council member"
        );
        _;
    }

    modifier targetIsNotCouncil(address _target) {
        require(
            !isCouncilMember[_target],
            "Operation can only be done on a non-council member"
        );
        _;
    }

    modifier noActiveMint() {
        require(!minting, "Only 1 active mint at a time.");
        _;
    }

    modifier adhocTransferExists(uint256 _id) {
        require(_id <= adhocTransfers.length, "AdhocTransfer does not exists.");
        _;
    }

    modifier isActiveAdhocTransfer(uint256 _id) {
        require(adhocTransfers[_id].isActive, "AdhocTransfer must be active.");
        _;
    }

    modifier hasNotVotedForAdhocTransfer(uint256 _id) {
        require(!adhocTransferVotedCouncilMembers[_id][msg.sender], "");
        _;
    }

    /*
     * POOL OWNERSHIP
     * Only Driver can add/remove councilMembers
     */
    // add council member
    function addCouncilMember(address _newCouncilMember)
        public
        isDriver
        targetIsNotCouncil(_newCouncilMember)
    {
        isCouncilMember[_newCouncilMember] = true;
        councilMembers.push(_newCouncilMember);
    }

    function getCouncilMembers() public view returns (address[] memory) {
        return councilMembers;
    }

    /*
     * Remove council member
     * Approval-deletion logic added here instead of adding checks in voting functions
     * as it is likely that this function will not be frequently used
     */
    function removeCouncilMember(address _councilMember)
        public
        isDriver
        targetIsCouncil(_councilMember)
    {
        isCouncilMember[_councilMember] = false;
        uint256 index = findIndexFromArray(councilMembers, _councilMember);

        // swap with last index and delete - minimises gas
        // council order does not matter
        if (index < councilMembers.length) {
            // Should definitely exist since we already check in modifier,
            // but just in case.
            councilMembers[index] = councilMembers[councilMembers.length - 1];
            delete councilMembers[councilMembers.length - 1];
        }

        // Delete council approvals from all active transfers
        for (uint256 i = 0; i < councilMembers.length; i++) {
            // For active transfers, the only votees are those that
            // approved since we set transfers to inactive once 1
            // council member rejects
            if (
                adhocTransfers[i].isActive &&
                adhocTransferVotedCouncilMembers[i][_councilMember]
            ) {
                adhocTransfers[i].numApprovals = adhocTransfers[i]
                    .numApprovals
                    .sub(1);
            }
        }

        // Delete council approval from mint if exists
        if (minting) {
            index = findIndexFromArray(approve, _councilMember);
            if (index < approve.length) {
                // council member found
                // Use the same swap-deletion logic since order does not matter
                approve[index] = approve[approve.length - 1];
                delete approve[index];
            }
        }
    }

    // find index of address in array
    function findIndexFromArray(address[] memory array, address _target)
        private
        pure
        returns (uint256)
    {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == _target) {
                return i;
            }
        }
        return array.length; // should never reach here since
    }

    /*
     * ADHOC TRANSFERS
     * All council members can initiate the transfer of tokens
     * from pool to an account.
     * Requires majority of council members to approve
     */
    // Create new adhoc transfers
    function createNewAdhocTransfer(address _to, uint256 _amount) public {
        adhocTransfers.push(
            AdhocTransfer({
                to: _to,
                amount: _amount,
                numApprovals: 0,
                id: adhocTransfers.length,
                isApproved: false,
                isActive: true
            })
        );
    }

    // Approves adhoc transfer
    function approveAdhocTransfer(uint256 _id)
        public
        isCouncil
        adhocTransferExists(_id)
        isActiveAdhocTransfer(_id)
        hasNotVotedForAdhocTransfer(_id)
    {
        adhocTransferVotedCouncilMembers[_id][msg.sender] = true;
        adhocTransfers[_id].numApprovals = adhocTransfers[_id].numApprovals.add(
            1
        );

        if (adhocTransfers[_id].numApprovals > councilMembers.length.div(2)) {
            // Majority voted, start adhoc transfer and set adhoc transfer to inactive
            AdhocTransfer memory transferInfo = adhocTransfers[_id];
            token.transfer(transferInfo.to, transferInfo.amount);
            adhocTransfers[_id].isApproved = true;
            adhocTransfers[_id].isActive = false;
        }
    }

    // Reject adhoc transfer. Sets transfer to inactive
    // Rejects transfer as long as 1 council rejects
    function rejectAdhocTransfer(uint256 _id)
        public
        isCouncil
        adhocTransferExists(_id)
        isActiveAdhocTransfer(_id)
    {
        adhocTransferVotedCouncilMembers[_id][msg.sender] = true;
        adhocTransfers[_id].isActive = false;
    }

    function getAllAdhocTransfers()
        public
        view
        isCouncil
        returns (AdhocTransfer[] memory)
    {
        return adhocTransfers;
    }

    function getHasConfirmedAdhocTransfer(uint256 _id)
        public
        view
        isCouncil
        returns (bool)
    {
        return adhocTransferVotedCouncilMembers[_id][msg.sender];
    }

    /*
     * AUTOMATIC TRANSFERS of tokens upon approval of idea
     */
    // function to get tokens from user when they vote
    function receiveTokensOnVote(address _from, uint256 _amount) external {
        // address _from = msg.sender;
        token.transferFrom(_from, address(this), _amount);
    }

    // function to reward tokens to user when their idea gets approved
    function rewardTokensOnApproval(address _user) external {
        token.transfer(_user, REWARD_AMOUNT);
    }

    /*
     * MINTING FUNCTIONS
     * Requires all council members to approve, including newly added
     * members during a mint vote
     */
    function mintTokens(uint256 _amount) private {
        // maybe change this to internal or private
        token.mintTokens(_amount, address(this));
    }

    // returns whether minting is going on, and the amount (0 if no minting)
    function viewMintStatus()
        public
        view
        returns (
            bool,
            uint256,
            address[] memory
        )
    {
        return (minting, mintingAmount, approve);
    }

    function requestMint(uint256 _amount) public isDriver noActiveMint {
        minting = true;
        mintingAmount = _amount;
    }

    function approveMint(address _addr) public isCouncil {
        require(
            !voted[_addr],
            "Council member has already approved or rejected minting request"
        );
        approve.push(_addr);

        if (approve.length == councilMembers.length) {
            // all approve - mint and reset
            mintTokens(mintingAmount);
            resetMint();
        }
    }

    function rejectMint(address _addr) public isCouncil {
        require(
            !voted[_addr],
            "Council member has already approved or rejected minting request"
        );
        // just reset - need all to approve for mint to succeed
        resetMint();
    }

    function resetMint() private {
        minting = false;
        mintingAmount = 0;

        // reset mapping
        for (uint256 i = 0; i < approve.length; i++) {
            voted[approve[i]] = false;
        }

        // reset arrays
        delete approve;
    }
}
