pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract DGT is ERC20 {
    constructor(uint256 initialSupply, address[] memory _addr) ERC20("Daimler Governance Token", "DGT") public {
        _mint(msg.sender, initialSupply * (10 ** decimals())); // Company A
        transfer(_addr[1], 2000000 * (10 ** decimals())); // Company B
        transfer(_addr[2], 2000000 * (10 ** decimals())); // Company C
        transfer(_addr[3], 1000000 * (10 ** decimals())); // Company D
        transfer(_addr[4], 1000000 * (10 ** decimals())); // Platform User #1
        transfer(_addr[5], 1000000 * (10 ** decimals())); // Platform User #2
    }
}