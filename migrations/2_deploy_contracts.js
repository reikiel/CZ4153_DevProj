var DGT = artifacts.require("./DGT.sol");

module.exports = function (deployer) {
    deployer.deploy(DGT, 10000000);
};
