var DGT = artifacts.require("./DGT.sol");
var Accounts = artifacts.require("./Accounts.sol");
var Ideas = artifacts.require("./Idea.sol");

module.exports = function (deployer, network, accounts) {
    deployer.deploy(DGT, 10000000, accounts);
    deployer.deploy(Accounts, accounts);
    deployer.deploy(Ideas)
};
