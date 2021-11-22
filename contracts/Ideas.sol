pragma solidity >=0.7.0 <0.9.0;

import "./Accounts.sol";
import "./DGT.sol";
import "./Pool.sol";

contract Ideas {
    struct Idea {
        uint256 id;
        address owner;
        string desc;
        string title;
        uint256 voteCount;
        address[] council; //added when they approve/reject
        string status;
        uint256 approvalCount;
        uint256 rejectCount;
    }

    Idea[] public ideas;

    // functions to call other contracts
    DGT public token;
    Accounts public accounts;
    Pool public pool;
    address public poolAddress;

    function setDgtAddress(address _dgtAddress) public {
        token = DGT(_dgtAddress);
    }

    function setAccountsAddress(address _accountsAddress) public {
        accounts = Accounts(_accountsAddress);
    }

    function setPoolAddress(address _poolAddress) public {
        pool = Pool(_poolAddress);
        poolAddress = _poolAddress;
    }

    function createIdea(string memory _desc, string memory _title) public {
        ideas.push(
            Idea({
                id: ideas.length, //start from 0
                owner: msg.sender,
                desc: _desc,
                title: _title,
                status: "pending", //approved, rejected
                voteCount: 0,
                approvalCount: 0,
                council: new address[](0),
                rejectCount: 0
            })
        );
    }

    //frontend should receive two output from this function. 1st output: success of voting, 2nd ouput(optional!!up to jordan): whether idea is allowed for voting. if return true, frontend should enable voting button.
    // for jordan: must call token.increaseAllowance(receiver.address, 1000) before calling this
    function voteIdea(uint256 numVotes, uint256 id)
        public
        returns (bool, bool)
    {
        bool canAppOrRej = false;
        if (numVotes <= token.balanceOf(msg.sender)) {
            ideas[id].voteCount += numVotes;
            canAppOrRej = checkvoteCountToSeeIfCanApproveRejectIdea(id);
            //ideas[id].voters.add(msg.sender); //only used if we are going to track list of voters. Need to add var address[] voter
            // after poolContract is done: return token.transfer(poolrecipient, numVotes); + add in poolcontract address as input
            pool.receiveTokensOnVote(msg.sender, numVotes);
            return (true, canAppOrRej);
        } else {
            return (false, canAppOrRej);
        }
    }

    //Driver and partner companies only (council only)
    // need make sure each idea has at least 100 votes first
    // true - approve, false - reject
    function approveRejectIdea(
        bool decision,
        uint256 id,
        address _member
    ) public returns (bool result) {
        string memory accountRole = accounts.viewAccountRole(_member);
        bytes memory accountRoleB = bytes(accountRole);
        // if (keccak256(accountRoleB) == keccak256("Driver") || council.viewAccountRole(msg.sender) == "Partner/Investor" || council.viewAccountRole(msg.sender) == "Partner"){
        if (
            keccak256(accountRoleB) == keccak256("Driver") ||
            keccak256(accountRoleB) == keccak256("Partner/Investor") ||
            keccak256(accountRoleB) == keccak256("Partner")
        ) {
            if (
                ideas[id].voteCount >= 100 && !find(ideas[id].council, _member)
            ) {
                if (decision) {
                    ideas[id].approvalCount += 1;
                } else if (!decision) {
                    ideas[id].rejectCount += 1;
                }

                ideas[id].council.push(_member); //council member has voted

                // check that its not already approved/rejected
                if (
                    keccak256(bytes(ideas[id].status)) == keccak256("pending")
                ) {
                    changeStatus(id); // check if majority approved/rejected
                }
                return true;
            } else {
                return false; //idea's voteCount is not at least 100 yet or member has alr approved/rejected. No approval/rejection of ideas allowed.
            }
        } else {
            return false;
        } //user is not a council member! cannot vote
    }

    //Set min number of approved/rejects from drivers and partners in order for idea to be finally approve/rejected. Store no. of approval in approvalCount. 2 out of 3 council members.
    function changeStatus(uint256 id)
        public
        returns (bool result, string memory status)
    {
        if (ideas[id].approvalCount >= 2) {
            ideas[id].status = "approved";

            // poolContract to reward 100 tokens to owner of idea!
            address ideaOwner = ideas[id].owner;
            pool.rewardTokensOnApproval(ideaOwner);

            return (true, "Idea satus: Approved");
        } else if (ideas[id].rejectCount >= 2) {
            ideas[id].status = "rejected";
            return (true, "Idea status: Rejected");
        } else {
            return (false, "");
        }
    }

    // check if particular council alr approved/rejected?
    function find(address[] memory array, address target)
        public
        pure
        returns (bool result)
    {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == target) {
                return true;
            }
        }

        return false;
    }

    function getAllIdeas() public view returns (Idea[] memory) {
        return ideas;
    }

    //for frontend!
    function checkvoteCountToSeeIfCanApproveRejectIdea(uint256 id)
        public
        view
        returns (bool status)
    {
        return ideas[id].voteCount >= 100;
    }
}
