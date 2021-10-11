var DGT = artifacts.require("./DGT.sol");

module.exports = function (deployer, network, accounts) {
    deployer.deploy(DGT, 10000000, accounts);
};
