var DGT = artifacts.require("./DGT.sol");
var Accounts = artifacts.require("./Accounts.sol");
var Ideas = artifacts.require("./Ideas.sol");
var Pool = artifacts.require("./Pool.sol");

module.exports = function (deployer, network, accounts) {
    deployer.deploy(DGT, 10000000, accounts);
    deployer.deploy(Accounts, accounts);
    deployer.deploy(Ideas);
    deployer.deploy(Pool, accounts[0]);
};
