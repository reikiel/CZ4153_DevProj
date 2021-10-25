import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import getWeb3 from "./getWeb3";
import Login from "./components/Login";
import IdeasDashboardPage from "./components/IdeasDashboardPage";
import NewIdeaPage from "./components/NewIdeaPage";
import MintPage from "./components/MintPage";

import CssBaseline from "@mui/material/CssBaseline";
import AuthenticatedRoute from "./utils/AuthenticatedRoute";
import { default as AccountStore } from "./stores/AccountStore";
import { default as ContractStore } from "./stores/ContractStore";
import {
  IDEAS_ROUTE,
  LOGIN_ROUTE,
  ROOT_ROUTE,
  NEW_IDEA_ROUTE,
  MINT_ROUTE,
} from "./constants/RouteConstants";
import ThemeProvider from "./theme/ThemeProvider";

const runExample = async (state, setState) => {
  const { accounts, contract, storageValue } = state;

  // Stores a given value, 5 by default.
  await contract.methods.set(5).send({ from: accounts[0] });

  // Get the value from the contract to prove it worked.
  const response = await contract.methods.get().call();

  // Update state with the result.
  if (storageValue !== response) {
    setState({ ...state, storageValue: response });
  }
};

const connectToWeb3 = async (state, setState) => {
  try {
    // Get network provider and web3 instance.
    const web3 = await getWeb3();

    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();

    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    const instance = null;

    // Set web3, accounts, and contract to the state, and then proceed with an
    // example of interacting with the contract's methods.
    setState({ ...state, web3, accounts: accounts, contract: instance });
    console.log(state);
  } catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.`
    );
    console.error(error);
  }
};

// TODO: Remove and add landing page
const PlaceHolder = ({ valueParam }) => {
  return (
    <div className="App">
      <h1>Good to Go!</h1>
      <p>Your Truffle Box is installed and ready.</p>
      <h2>Smart Contract Example</h2>
      <p>
        If your contracts compiled and migrated successfully, below will show a
        stored value of 5 (by default).
      </p>
      <p>
        Try changing the value stored on <strong>line 42</strong> of App.js.
      </p>
      <div>The stored value is: {valueParam}</div>
    </div>
  );
};

function App() {
  const [state, setState] = useState({
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
  });

  //connectToWeb3(state, setState);
  //useEffect(() => {runExample(state, setState)}, [state]);

  //if (!state.web3) {
  //    return <div>Loading Web3, accounts, and contract...</div>;
  //}
  return (
    <ThemeProvider>
      <CssBaseline />
      <AccountStore.Container>
        <ContractStore.Container>
          <Router>
            <Switch>
              <Route path={LOGIN_ROUTE}>
                <Login />
              </Route>
              <AuthenticatedRoute path={IDEAS_ROUTE}>
                <IdeasDashboardPage />
              </AuthenticatedRoute>
              <AuthenticatedRoute path={NEW_IDEA_ROUTE}>
                <NewIdeaPage />
              </AuthenticatedRoute>
              <AuthenticatedRoute path={MINT_ROUTE}>
                <MintPage />
              </AuthenticatedRoute>
              <Route path={ROOT_ROUTE} component={PlaceHolder}>
                <PlaceHolder valueParam={5} />
              </Route>
            </Switch>
          </Router>
        </ContractStore.Container>
      </AccountStore.Container>
    </ThemeProvider>
  );
}

export default App;
