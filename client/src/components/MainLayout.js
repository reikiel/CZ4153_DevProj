import React from "react";
import MainHeader from "./MainHeader";
import MainSidebar from "./MainSidebar";
import { CssBaseline } from "@material-ui/core/";
import { Box } from "@mui/material"


export default function MainLayout({children}) {

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }} styles={{ width: "100%" }}>
      <CssBaseline />
      {/* header */}
      <MainHeader />

      {/* sidebar */}
      <MainSidebar children={children} />
    </Box>
  );
}
