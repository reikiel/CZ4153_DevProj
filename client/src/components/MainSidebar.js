import React, { useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import List from "@mui/material/List";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";

import { HasSpecialAccess } from "../utils/AuthenticationService";
import { default as AccountStore } from "../stores/AccountStore";
import {
  IDEAS_ROUTE,
  MINT_ROUTE,
  NEW_IDEA_ROUTE,
} from "../constants/RouteConstants";

const drawerWidth = 240;

const SIDEBAR_ITEMS = [
  {
    text: "View Ideas",
    icon: <LightbulbIcon />,
    route: IDEAS_ROUTE,
  },
  {
    text: "Propose Ideas",
    icon: <PlaylistAddIcon />,
    route: NEW_IDEA_ROUTE,
  },
  {
    text: "Mint",
    icon: <AddCircleIcon />,
    route: MINT_ROUTE,
  },
];

const useStyles = makeStyles({
  mainContent: {
    width: "100%"
  },
});

export default function MainSidebar({ children }) {
  const accountStore = AccountStore.useStore();
  const classes = useStyles();

  const currentSidebarIndex = sessionStorage.getItem("sidebarIndex");
  const [selectedIndex, updateSelectedIndex] = useState(
    currentSidebarIndex ?? 0
  );

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        style={{ zIndex: 90 }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          <Toolbar />
          <Divider />
          <List style={{ paddingTop: 60 }}>
            {SIDEBAR_ITEMS.map((sidebarItem, index) => {
              return (
                HasSpecialAccess(accountStore, sidebarItem["route"]) && (
                  <MenuItem
                    style={{ height: "60px", marginBottom: "5px" }}
                    selected={parseInt(selectedIndex) === index}
                    component={Link}
                    to={sidebarItem["route"]}
                    key={sidebarItem["text"]}
                    onClick={() => {
                      sessionStorage.setItem("sidebarIndex", index);
                      updateSelectedIndex(index);
                    }}
                  >
                    <ListItemIcon>{sidebarItem["icon"]}</ListItemIcon>
                    <ListItemText primary={sidebarItem["text"]} />
                  </MenuItem>
                )
              );
            })}
          </List>
        </Drawer>
      </Box>
      <Box
        sx={{
          paddingTop: "80px",
          marginLeft: "20px",
          marginRight: "20px",
        }}
        className={classes.mainContent}
        maxWidth="100%"
        minWidth="400px"
      >
        {children ?? <></>}
      </Box>
    </Box>
  );
}
