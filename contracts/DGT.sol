pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract DGT is ERC20 {

    // address poolAddress;
    constructor(uint256 initialSupply, address[] memory _addr) ERC20("Daimler Governance Token", "DGT") public {
        _mint(msg.sender, initialSupply); // Company A
        transfer(_addr[1], 2000000 ); // Company B
        transfer(_addr[2], 2000000 ); // Company C
        transfer(_addr[3], 1000000); // Company D
        transfer(_addr[4], 1000000 ); // Platform User #1
        transfer(_addr[5], 1000000 ); // Platform User #2

        // testing~
        // poolAddress = _poolAddress;
        // transfer(poolAddress, 1000000 * (10 ** decimals()));
    }


    // function to mint Tokens and put in the pool
    function mintTokens(uint256 _amount, address _addr) public {
        // require(msg.sender == poolAddress, "Only PoolContract can call this function");
        _mint(msg.sender, _amount * (10 ** decimals()) );
    }
}
