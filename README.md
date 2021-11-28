# Daimler: Governance Tokens for Acentrik Data Marketplace
Team _Anything_

Valerie Tan <br/>
Chua Wen Qing <br/>
Liew Yi An Jordan <br/>

## Background
Acentrik is a B2B Decentralized Data Marketplace for enabling cross industry data exchange and monetization based on Blockchain technology. The platform is built using open-source components, smart contracts in Solidity and with a multi chain strategy. The objective of the project is to launch Governance Tokens for Acentrik to grant voting rights to Investors in the ICO. The governance model as provided by Acentrik is as follow:
- Anyone in the community can propose a new feature (or improvement) for development
-	Token holders in the ecosystem can support projects by voting for their preferred proposals
-	Council members review the top voted proposals and approves the “appropriate” proposals
-	Development team develops the features (or improvements) approved by the council

Based on the requirements, the main functionality and the corresponding permissions are as follow:
1. Propose and vote for ideas
2. Initiate minting of new governance tokens, and multi-sig for the approval of mint
3. Initiate adhoc transfer of tokens to any valid address, and multi-sig approval for this

Role|Propose/Vote for Idea|Initiate Mint| Multi-sig approval for Mint| Initiate/Multi-sig approval for Adhoc Transfer
---|---|---|---|---
Driver|✔|✔|✔|✔
Partner|✔|❌|✔|✔
Partner-Investor|✔|❌|✔|✔
Investor|✔|❌|❌|❌
User|✔|❌|❌|❌

*Note: Driver, partner and partner-investor are considered as council members, and have additional permissions to mint/transfer tokens*


## Setup Instructions
### Requirements
- [ReactJS](https://reactjs.org/)
- [nodeJS](https://nodejs.org/en/)
- [truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation)
- [Ganache](https://www.trufflesuite.com/ganache) (Can use test net as well, but please refer to step 0 for proper setup)

### Setup
#### Step 0: Setting up ownership (Please refer to Background for more information on the owners and their roles/permissions)
*This step is only required if you are planning to use specific accounts for the different roles, or change the initial supply/distribution of tokens. Skip to Step 1 otherwise.*<br/><br/>
The default account roles can be found in the following table. 
Account Number|Company Name|Role
---|---|---
0|Company A|Driver
1|Company B|Partner
2|Company C|Partner-Investor
3|Company D|Investor


The initial setups can also be changed:
1. Initial Governance Tokens supply - `deploy_contracts.js`
```
// Change the inputs to the constructor of DGT contract to change the initial supply
deployer.deploy(DGT, 10000000, accounts);
```
2. Distribution of tokens - `DGT.sol`
```
// Change the constructor to manage the distribution of the initial supply.
// The default mints the tokens to the deployer of the contract, who is assumed to be the driver
// An alternative is to transfer the initial tokens to the pool, which will require multi-sig for transfers
transfer(_addr[1], 2000000); // Change address and amount
```
3. Accounts and roles - The accounts must exists for you to be able to login - `Accounts.sol`
```
// Change the addresses accordingly, and the role/name.
// Do note the spelling/casing used for the roles, they are critical and should never be changed.
// (Unless you want to change the frontend constants as well)
accounts[_addresses[0]] = Account("Driver", "Company A");
```

4. Adding ownership for Token Pool - `setup_contracts.js`
```
// Add accounts as council members (Owners) of the token pool
// Only the driver account can initiate this call
pool.addCouncilMember(account[1], { from: driver })
```

#### Step 1: Setup contracts + web
Execute the following commands to setup the server.
```
truffle migrate
truffle exec setup_contracts.js // Initial contract setup
cd client
yarn start 
```

## Design
We have 4 main contracts:
1. **DGT.sol** <br/>
This contract is our Governance Token DGT, based on ERC20.
2. **Accounts.sol** <br/>
This contract stores all the accounts (includes role & name) of the users on the platform. The current implementation only allows the driver to add/remove council members. However, this means that it is possible to compromise this account (driver) on the application layer, and given that the driver has full permissions, can replace all council members and basically destory the system. A potential improvement would be to apply multi-sig permissions for the addition/removal of council members, which would increase the barriers to compromise this system (multiple accounts need to be compromised at the same time).
3. **Ideas.sol** <br/>
This contract allows for the proposal of new ideas, voting and approval/rejection by the council members as per the requirements. The proposer of the idea will also receive 100 tokens if the idea is approved by the council member, following a majority voting system (Majority approval = approve). To ensure that flow of tokens in this propose-vote-approve cycle is self-sustaining, we added a minimum threshold of 100 tokens before approval/rejection can take place. All votes for any ideas will be added to the pool, and any (majority) approval will trigger an automatic transfer to the proposer's account.
4. **Pool.sol** <br/>
This contract acts as a central wallet which stores all the excess tokens. In addition, it is used to facilitate the movement of tokens for operations such as the vote approval and adhoc transfers to third parties. The rationale for using a central pool is to (1) lock the tokens in transition (such as the votes for the ideas) and (2) allow council members to mint new governance tokens as per requirements (e.g. when there is a new investor). All operations on the pool requires multi-sig approvals to increase the security of the pool.


*More improvement/design details can be found in the report.*


