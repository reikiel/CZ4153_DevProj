pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract DGT is ERC20 {
    constructor(uint256 initialSupply) ERC20("Daimler Governance Token", "DGT") public {
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }
}