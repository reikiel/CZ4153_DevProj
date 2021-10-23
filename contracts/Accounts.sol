pragma solidity ^0.8.0;

contract Accounts {
    // mapping of address => struct
    struct Account {
        string role;
        string companyName;
    }

    mapping(address => Account) accounts;

    // when view info about the address, pass the address as parameter
    constructor(address[] memory _addresses) {
        // hardcode
        accounts[_addresses[0]] = Account('Driver', 'Company A');
        accounts[_addresses[1]] = Account('Partner/Investor', 'Company B');
        accounts[_addresses[2]] = Account('Partner/Investor', 'Company C');
        accounts[_addresses[3]] = Account('Partner', 'Company D');
        accounts[_addresses[4]] = Account('Platform User', 'Valerie');
        accounts[_addresses[5]] = Account('Platform User', 'Wen Qing');
        
    }

    function viewAccountRole(address _addr) public view returns (string memory) {
        return accounts[_addr].role;
    }
    function viewAccountName(address _addr) public view returns (string memory) {
        return accounts[_addr].companyName;
    }

    function viewTest() public pure returns(string memory) {
        return "hi";
    }
}