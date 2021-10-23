var DGT = artifacts.require("./DGT.sol");
var Accounts = artifacts.require("./Accounts.sol");

module.exports = function (deployer, network, accounts) {
    deployer.deploy(DGT, 10000000, accounts);
    deployer.deploy(Accounts, accounts);
};
