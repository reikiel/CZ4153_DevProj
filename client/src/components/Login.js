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

import { TryLogIn } from "../utils/AuthenticationService";
import { default as AccountStore } from "../stores/AccountStore";
import { default as ContractStore } from "../stores/ContractStore";
import { IDEAS_ROUTE } from "../constants/RouteConstants";
import { ADDRESS } from "../constants/AccountConstants";
import {
  LOGIN_AWAITING_USER,
  LOGIN_INIT,
  LOGIN_SUCCESSFUL,
} from "../constants/LoginStatusConstants";

export default function Login() {
  const accountStore = AccountStore.useStore();
  const contractStore = ContractStore.useStore();
  const [loginState, setLoginState] = useState(
    accountStore.get(ADDRESS) ? LOGIN_SUCCESSFUL : LOGIN_INIT
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    TryLogIn(accountStore, contractStore, setLoginState)
      .then((response) => {
        setLoginState(LOGIN_SUCCESSFUL);
      })
      .catch((error) => console.log(error));
  };

  const ButtonMessage = () => {
    if (loginState === LOGIN_INIT) {
      return "Connect to Wallet";
    } else if (loginState === LOGIN_AWAITING_USER) {
      return "Connecting...";
    }
    return "ERROR";
  };

  if (loginState === LOGIN_SUCCESSFUL) {
    return <Redirect to={IDEAS_ROUTE} />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
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
                {ButtonMessage()}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Container>
  );
}
