import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { TryLogIn, HandleWalletRPCError } from "../utils/AuthenticationService";
import { default as AccountStore } from "../stores/AccountStore";
import { default as ContractStore } from "../stores/ContractStore";
import { IDEAS_ROUTE } from "../constants/RouteConstants";
import { ADDRESS } from "../constants/AccountConstants";
import {
  LOGIN_AWAITING_USER,
  LOGIN_ERROR_ALREADY_AWAITING_USER,
  LOGIN_ERROR_METHOD_NOT_SUPPORTED,
  LOGIN_INIT,
  LOGIN_SUCCESSFUL,
} from "../constants/LoginStatusConstants";
import { Alert } from "@mui/material";

// Stores all the error login states that results in a alert message
const ALERT_MESSAGE_LOGIN_STATES = [
  LOGIN_ERROR_ALREADY_AWAITING_USER,
  LOGIN_ERROR_METHOD_NOT_SUPPORTED,
];

// Text shown in the login button
const ButtonMessage = (loginState) => {
  if (loginState === LOGIN_INIT) {
    return "Connect to Wallet";
  } else if (loginState === LOGIN_AWAITING_USER) {
    return "Connecting...";
  } else if (ALERT_MESSAGE_LOGIN_STATES.includes(loginState)) {
    return "Error. Check alert message.";
  }
  return "ERROR";
};

// Text shown when a error occurs
const AlertMessage = (loginState) => {
  switch (loginState) {
    case LOGIN_ERROR_ALREADY_AWAITING_USER:
      return (
        "There is already a pending request to connect, please " +
        "check for a connection popup (Might need to click on your" +
        "wallet plugin). Upon accepting the request, " +
        "please click on the login button again. Please refresh " +
        "the page if no popup is found."
      );
    case LOGIN_ERROR_METHOD_NOT_SUPPORTED:
      return (
        "Current login method not supported. Please " +
        "ensure that you have downloaded a wallet. If this error " +
        "persists, try to use an updated Google Chrome browser."
      );
    default:
      // new error, should never reach here
      return "Unexpected error";
  }
};

export default function Login() {
  const accountStore = AccountStore.useStore();
  const contractStore = ContractStore.useStore();
  const [loginState, setLoginState] = useState(
    accountStore.get(ADDRESS) ? LOGIN_SUCCESSFUL : LOGIN_INIT
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    TryLogIn(accountStore, contractStore, setLoginState)
      .then(() => {
        setLoginState(LOGIN_SUCCESSFUL);
      })
      .catch((error) => HandleWalletRPCError(error, setLoginState));
  };

  if (loginState === LOGIN_SUCCESSFUL) {
    return <Redirect to={IDEAS_ROUTE} />;
  }

  const showAlert = ALERT_MESSAGE_LOGIN_STATES.includes(loginState);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {showAlert && <Alert severity="error">{AlertMessage(loginState)}</Alert>}
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <Button
                type="text"
                fullWidth
                variant="contained"
                disabled={loginState === LOGIN_AWAITING_USER}
                sx={{ mt: 3, mb: 2 }}
              >
                {ButtonMessage(loginState)}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Container>
  );
}
