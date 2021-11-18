pragma solidity ^0.8.0;
import "./DGT.sol";
import "./Accounts.sol";

contract Pool {
    DGT public token;
    Accounts public accounts;
    uint public REWARD_AMOUNT = 100;

    // variables to keep track of minting and which council members approve minting of tokens
    bool minting = false;
    uint mintingAmount;
    mapping(address => bool) public voted;
    address[] approve; // keep track of length
    address[] approveAndReject; // keep track of length
    uint TOTAL_COUNCIL = 3;

    function setDgtAddress(address _dgtAddress) public {
        token = DGT(_dgtAddress);
    }
    
    function setAccountsAddress(address _accountsAddress) public {
        accounts = Accounts(_accountsAddress);
    }

    function viewPoolBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    // function to get tokens from user when they vote
    function receiveTokensOnVote(address _from, uint _amount) public {
        // address _from = msg.sender;
        token.transferFrom(_from, address(this), _amount);
    }

    // function to reward tokens to user when their idea gets approved
    function rewardTokensOnApproval(address _user) public {
        token.transfer(_user, REWARD_AMOUNT);
    }


    /// MINTING FUNCTIONS
    function mintTokens(uint256 _amount) public { // maybe change this to internal or private
        token.mintTokens(_amount, address(this));
    }

    // returns whether minting is going on, and the amount (0 if no minting)
    function viewMintStatus() public view returns (bool,uint) {
        return (minting,mintingAmount);
    }

    function requestMint(address _addr, uint _amount) public {
        require(!minting, "There is already a mint request!");
        string memory accountRole = accounts.viewAccountRole(_addr);
        bytes memory accountRoleB = bytes(accountRole);
        require(keccak256(accountRoleB) == keccak256("Driver"), "Only driver can request for minting!");
        minting = true;
        mintingAmount = _amount;
    }

    function approveMint(address _addr) public {
        require(!voted[_addr], "Council member has already approved or rejected minting request");
        approve.push(_addr);
        approveAndReject.push(_addr);

        if (approve.length == TOTAL_COUNCIL) { // all approve - mint and reset
            mintTokens(mintingAmount);
            resetMint();
        } else if (approveAndReject.length == TOTAL_COUNCIL) { // just reset - everyone has voted but not all approve
            resetMint();
        }
    }

    function rejectMint(address _addr) public {
        require(!voted[_addr], "Council member has already approved or rejected minting request");
        approveAndReject.push(_addr);
        if (approveAndReject.length == TOTAL_COUNCIL) { // just reset - everyone has voted but not all approve
            resetMint();
        }
    }

    function resetMint() private {
        minting = false;
        mintingAmount = 0;

        // reset mapping
        for (uint i=0;i<approveAndReject.length;i++) {
            voted[approveAndReject[i]] = false;
        }

        // reset arrays
        delete approve;
        delete approveAndReject;
    }
}