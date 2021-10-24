import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { IsLoggedIn, TryLogIn } from "../utils/AuthenticationService";
import { default as AccountStore } from "../stores/AccountStore";
import { IDEAS_ROUTE } from "../constants/RouteConstants";

export default function Login() {
  const accountStore = AccountStore.useStore();
  const routeHistory = useHistory();
  const [isFailedLogin, setFailedLogin] = useState(false);
  const [address, setAddress] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const hasSuccessfullyLoggedIn = TryLogIn(accountStore, address);

    if (hasSuccessfullyLoggedIn) {
      routeHistory.push(IDEAS_ROUTE);
    } else {
      setFailedLogin(true);
    }
  };

  if (IsLoggedIn(accountStore)) {
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
              <TextField
                error={isFailedLogin}
                margin="normal"
                required
                fullWidth
                id="address"
                label="Address"
                name="address"
                autoFocus
                helperText={isFailedLogin ? "Invalid address." : ""}
                onChange={(e) => setAddress(e.target.value)}
              />

              <Button
                type="text"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Container>
  );
}
