const DGT = artifacts.require("DGT");

contract("DGT", (accounts) => {
    before(async () => {
        dgt = await DGT.deployed();
    });

    it("gives the owner(Company A) of the token 10M tokens", async () => {
        let balance = await dgt.balanceOf(accounts[0]);
        balance = web3.utils.fromWei(balance, "ether");
        assert.equal(
            balance,
            "10000000",
            "Balance should be 10M tokens for contract creator"
        );
    });

    it("can transfer tokens between accounts", async () => {
        let amount = web3.utils.toWei("1000", "ether");
        await dgt.transfer(accounts[1], amount, { from: accounts[0] });

        let balance = await dgt.balanceOf(accounts[1]);
        balance = web3.utils.fromWei(balance, "ether");
        assert.equal(
            balance,
            "1000",
            "Balance should be 1K tokens for account 1"
        );
    });
});
