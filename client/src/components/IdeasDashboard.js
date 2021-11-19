import React, { useState } from "react";

import { GetIdeas } from "../utils/IdeasService";
import IdeasCard from "./IdeasCard";
import IdeasPopupCard from "./IdeasPopupCard";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@material-ui/styles";
import { Grid, MenuItem, Select } from "@mui/material";
import {
  TITLE,
  OWNER,
  PENDING_STATUS,
  APPROVED_STATUS,
  REJECTED_STATUS,
} from "../constants/IdeaConstants";
import { default as ContractStore } from "../stores/ContractStore";

const useStyles = makeStyles({
  ideaCardSpacing: {
    paddingBottom: 20,
  },
  titleSpacing: {
    paddingBottom: 5,
  },
});

export default function IdeasDashboard() {
  const contractStore = ContractStore.useStore();
  const [ideaStatusFilter, setIdeaStatusFilter] = useState("all");
  const [ideaPopupID, setIdeaPopupID] = useState(-1); // -1 means that there are no popups

  const classes = useStyles();
  const ideas = GetIdeas(contractStore, ideaStatusFilter);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Typography variant="h2">Ideas Dashboard</Typography>
          <Box className={classes.titleSpacing} />
          <Typography variant="subtitle1">
            View the top community ideas!
          </Typography>
        </Box>
        <Box>
          <FormControl sx={{ m: 1, minWidth: 120, marginRight: 4 }}>
            <Select
              value={ideaStatusFilter}
              onChange={(e) => setIdeaStatusFilter(e.target.value)}
            >
              <MenuItem value={"all"}>ALL</MenuItem>
              <MenuItem value={PENDING_STATUS}>PENDING</MenuItem>
              <MenuItem value={APPROVED_STATUS}>APPROVED</MenuItem>
              <MenuItem value={REJECTED_STATUS}>REJECTED</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ m: 4 }} />
      <Grid container style={{ width: "100%" }} direction="row" wrap="wrap">
        {ideas.length > 0 ? (
          ideas.map((idea, index) => (
            <>
              <IdeasCard
                idea={idea}
                key={index}
                handleClick={() => {
                  setIdeaPopupID(-1);
                }} // Disable popup for now
              />
              <Box className={classes.ideaCardSpacing} />
              <IdeasPopupCard
                open={ideaPopupID === index}
                handleClose={() => setIdeaPopupID(-1)}
                key={"popup-" + index}
                idea={idea}
              />
            </>
          ))
        ) : (
          <>
            <Typography>No ideas found...</Typography>
          </>
        )}
      </Grid>
    </>
  );
}
