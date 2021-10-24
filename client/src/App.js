import React, { Component } from "react";
import AccountsContract from "./contracts/Accounts.json";
import getWeb3 from "./getWeb3";
import Login from "./components/Login";
import IdeasDashboardPage from "./components/IdeasDashboardPage";
import NewIdeaPage from "./components/NewIdeaPage";

import CssBaseline from "@mui/material/CssBaseline";
import AuthenticatedRoute from "./utils/AuthenticatedRoute";
import { default as AccountStore } from "./stores/AccountStore";
import {
  IDEAS_ROUTE,
  LOGIN_ROUTE,
  ROOT_ROUTE,
  NEW_IDEA_ROUTE,
  MINT_ROUTE,
} from "./constants/RouteConstants";
import ThemeProvider from './theme/ThemeProvider';
import MintPage from "./components/MintPage";

class App extends Component {
    state = {
        web3: null,
        accounts: null,
        contract: null,
        accountRole: null,
        accountName: null,
    };

  // Stores a given value, 5 by default.
  await contract.methods.set(5).send({ from: accounts[0] });

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            console.log(typeof accounts[0]);

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = AccountsContract.networks[networkId];
            const instance = new web3.eth.Contract(
                AccountsContract.abi,
                deployedNetwork && deployedNetwork.address
            );

const connectToWeb3 = async (state, setState) => {
  try {
    // Get network provider and web3 instance.
    const web3 = await getWeb3();

    // runExample = async () => {
    //     const { accounts, contract } = this.state;

    //     // Stores a given value, 5 by default.
    //     await contract.methods.set(5).send({ from: accounts[0] });

    //     // Get the value from the contract to prove it worked.
    //     const response = await contract.methods.get().call();

    //     // Update state with the result.
    //     this.setState({ storageValue: response });
    // };

    runExample = async () => {
        const { accounts, contract } = this.state;

        // Get the value from the contract to prove it worked.

        let accountRole = await contract.methods
            .viewAccountRole(accounts[0])
            .call();
        let accountName = await contract.methods
            .viewAccountName(accounts[0])
            .call();

        console.log(accountName, accountRole);

        // Update state with the result.
        this.setState({ accountRole: accountRole, accountName: accountName });
    };

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div className="App">
                <h1>Good to Go!</h1>
                <p>Your Truffle Box is installed and ready.</p>
                <h2>Smart Contract Example</h2>

                <div>The current address is: {this.state.accounts[0]}</div>
                <div>Company name: {this.state.accountName}</div>
                <div>Company role: {this.state.accountRole}</div>
            </div>
        );
    }
}

export default App;
