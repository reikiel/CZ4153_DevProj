pragma solidity ^0.8.0;
import "./DGT.sol";

contract Pool {
    DGT public token;
    uint public REWARD_AMOUNT = 100;

    function setDgtAddress(address _dgtAddress) public {
        token = DGT(_dgtAddress);
    }
    

    function viewPoolBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function mintTokens(uint256 _amount) public {
        token.mintTokens(_amount, address(this));
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
}