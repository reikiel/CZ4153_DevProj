import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useHistory } from "react-router-dom";

import AccountStore from "../stores/AccountStore";
import { NAME, TOKEN_COUNT } from "../constants/AccountConstants";
import { LOGIN_ROUTE } from "../constants/RouteConstants";
import { LogOut } from "../utils/AuthenticationService";
import { Eth } from "react-cryptocoins";


export default function MainHeader() {
  const history = useHistory();
  const accountStore = AccountStore.useStore();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar style={{ zIndex: 100 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" }, rightPadding: 10 }}
          >
            {accountStore.get(NAME)}
          </Typography>
          <Box sx={{ flexGrow: 40 }} />
          <Box sx={{ display: "flex", minWidth: 50, paddingRight: 5}} flexDirection="row">
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" }, minWidth: 15 }}
            >
              {accountStore.get(TOKEN_COUNT)}
            </Typography>
            <Box sx={{ display: "flex", paddingRight: 1 }} />
            <Eth size={20}/>
          </Box>
          <Box
            sx={{ display: { xs: "none", md: "flex" } }}
            onClick={() => {
              LogOut(accountStore);
              history.push(LOGIN_ROUTE);
            }}
          >
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-haspopup="true"
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
