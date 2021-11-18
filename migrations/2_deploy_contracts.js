var DGT = artifacts.require("./DGT.sol");
var Accounts = artifacts.require("./Accounts.sol");
var Pool = artifacts.require("./Pool.sol");
var Ideas = artifacts.require("./Ideas.sol");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(DGT, 10000000, accounts);
    await deployer.deploy(Pool);
    await deployer.deploy(Ideas);
    await deployer.deploy(Accounts, accounts);

    // set dgt ABI so that pool can use its functions
    let dgt = await DGT.deployed();
    let pool = await Pool.deployed();
    let accountsContract = await Accounts.deployed();
    let ideas = await Ideas.deployed();
    await pool.setDgtAddress(dgt.address);
    await pool.setAccountsAddress(accountsContract.address);
    await ideas.setDgtAddress(dgt.address);
    await ideas.setPoolAddress(pool.address);
    await ideas.setAccountsAddress(accountsContract.address);
};
