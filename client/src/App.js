import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import IdeasDashboardPage from "./pages/IdeasDashboardPage";
import NewIdeaPage from "./pages/NewIdeaPage";
import MintPage from "./pages/MintPage";

import CssBaseline from "@mui/material/CssBaseline";
import AuthenticatedRoute from "./utils/AuthenticatedRoute";
import StoreContainer from "./components/StoreContainer";
import {
  IDEAS_ROUTE,
  LOGIN_ROUTE,
  ROOT_ROUTE,
  NEW_IDEA_ROUTE,
  MINT_ROUTE,
} from "./constants/RouteConstants";
import ThemeProvider from "./theme/ThemeProvider";

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
  return (
    <ThemeProvider>
      <CssBaseline />
      <StoreContainer>
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
      </StoreContainer>
    </ThemeProvider>
  );
}

export default App;
