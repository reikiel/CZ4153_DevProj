var DGT = artifacts.require("./DGT.sol");
var Accounts = artifacts.require("./Accounts.sol");
var Ideas = artifacts.require("./Ideas.sol");
var Pool = artifacts.require("./Pool.sol");

module.exports = async function (callback) {
  const [dgt, account, ideas, pool] = await Promise.all([
    DGT.deployed(),
    Accounts.deployed(),
    Ideas.deployed(),
    Pool.deployed(),
  ]); 

  await Promise.all([
    ideas.setDgtAddress(dgt.address),
    ideas.setPoolAddress(pool.address),
    ideas.setAccountsAddress(account.address),
    pool.setDgtAddress(dgt.address),
    pool.setAccountsAddress(account.address),
  ]);

  const accounts = await web3.eth.getAccounts();
  const driver = accounts[0];

  await Promise.all([
    pool.addCouncilMember(accounts[1], { from: driver }),
    pool.addCouncilMember(accounts[2], { from: driver }),
  ]);
  console.log("Complete");
  callback();
};
