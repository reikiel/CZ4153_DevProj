var DGT = artifacts.require("./DGT.sol");
var Accounts = artifacts.require("./Accounts.sol");
var Ideas = artifacts.require("./Ideas.sol");
var Pool = artifacts.require("./Pool.sol");

module.exports = function (callback) {
  Promise.all([
    DGT.deployed(),
    Accounts.deployed(),
    Ideas.deployed(),
    Pool.deployed(),
  ]).then(([dgt, account, ideas, pool]) => {
    Promise.all([
      ideas.setDgtAddress(dgt.address),
      ideas.setPoolAddress(pool.address),
      ideas.setAccountsAddress(account.address),
      pool.setDgtAddress(dgt.address),
      pool.setAccountsAddress(account.address),
    ]).then(() => {
      console.log("completed");
      callback();
    });
  });
};
