pragma solidity >=0.7.0 <0.9.0;

import "./Accounts.sol";
import "./DGT.sol";

contract Ideas is DGT{
    struct Idea {
        uint32 id;
        address owner;
        string desc;
        string title;
        uint voteCount;
        address[] council; //added when they approve/reject
        string status;
        uint approvalCount;
        uint rejectCount;
    }

    Idea[] public ideas;

    function createIdea(address _owner, string memory _desc, string memory _title) public {
            ideas.push(Idea({
                    id: ideas.length, //start from 0
                    owner: _owner,
                    desc: _desc,
                    title: _title,
                    status: "pending", //approved, rejected
                    voteCount: 0,
                    //voters: _voters,
                    approvalCount: 0
            }));
    }
    
    //frontend should receive two output from this function. 1st output: success of voting, 2nd ouput(optional!!up to jordan): whether idea is allowed for voting. if return true, frontend should enable voting button. 
    function voteIdea(uint numVotes, uint id) public returns(bool vote_result, bool approveRejectIdea){ 
        bool canAppOrRej = false;
        if (numVotes >= (msg.sender).balanceOf){
            ideas[id].voteCount += numVotes;
            canAppOrRej = checkvoteCountToSeeIfCanApproveRejectIdea(id);
            //ideas[id].voters.add(msg.sender); //only used if we are going to track list of voters. Need to add var address[] voter
            DGT token = DGT(msg.sender);
            //after poolContract is done: return token.transfer(poolrecipient, numVotes); + add in poolcontract address as input 
            return (true, canAppOrRej);
        }
        else{
            return (false, canAppOrRej);
        }

    }
    //Driver and partner companies only
    //Make sure pool got minimum number of 100 tokens first (need pool contract first) OR need make sure each idea has at least 100 votes first(going with the latter for now)
    function approveRejectIdea(bool decision, uint id) public returns (bool result){ 
        DGT council = DGT(msg.sender);
        if (council.viewAccountRole(msg.sender) == "Driver" || council.viewAccountRole(msg.sender) == "Partner/Investor" || council.viewAccountRole(msg.sender) == "Parnter"){
            if (ideas[id].voteCount >= 100 && !find(ideas[id].council, msg.sender)){
                if (decision){
                    ideas[id].approvalCount += 1;
                }
                else if (!decision){
                    ideas[id].rejectCount += 1;
                }

                ideas[id].council.push(msg.sender); //council member has voted
                return true;
            }
            else{
                return false;  //idea's voteCount is not at least 100 yet. No approval/rejection of ideas allowed by any council member.
            }
        }
        else {return false;} //user is not a council member! cannot vote

    }
    //Set min number of approved/rejects from drivers and partners in order for idea to be finally approve/rejected. Store no. of approval in approvalCount. For now set as 3(out of 4 council members)
    function changeStatus(uint id) public returns (bool result, string status){
         if (ideas[id].approvalCount >= 3){
            ideas[id].status = "approved";
            return (true, "Idea satus: Approved");
        }
        else if (ideas[id].rejectCount >= 3){
             ideas[id].status = "rejected";
             return (true, "Idea status: Rejected");
        }
        else if(ideas[id].approvalCount = 2 && ideas[id].rejectCount = 2){
            //what happens when its 2 VS 2 AH 
            return (false, "As there is equal number of Approve votes and Rejected votes, everything will be reset to 0 and council members will be required to revote.");
        }
        else {
            return (false, "");
        }
        
    }

    function find(address[] array, address target) public returns (bool result){
        for (uint i = 0; i < array.length; i++){
            if (array[i] == target){
                return true;
            }
        }

        return false;
        
    }
    
    function getAllIdeas() view public returns(Idea[] memory){
        return ideas;
    }

    //for frontend!
    function checkvoteCountToSeeIfCanApproveRejectIdea(uint id) public returns(bool status){
        if(ideas[id].voteCount>=100){
            return true;
        }
        else{
            return false;
        }
    }


}