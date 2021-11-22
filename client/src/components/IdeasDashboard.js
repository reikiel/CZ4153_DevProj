import React, { useEffect, useState } from "react";

import { GetIdeasWithFilter } from "../utils/IdeasService";
import IdeasCard from "./IdeasCard";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@material-ui/styles";
import { CircularProgress, Grid, MenuItem, Select } from "@mui/material";
import {
  PENDING_STATUS,
  APPROVED_STATUS,
  REJECTED_STATUS,
} from "../constants/IdeaConstants";
import { default as ContractStore } from "../stores/ContractStore";
import { default as IdeaStore } from "../stores/IdeaStore";

const useStyles = makeStyles({
  ideaCardSpacing: {
    paddingBottom: 20,
  },
  titleSpacing: {
    paddingBottom: 5,
  },
  spinner: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function IdeasDashboard() {
  const contractStore = ContractStore.useStore();
  const ideaStore = IdeaStore.useStore();
  const [ideaStatusFilter, setIdeaStatusFilter] = useState("all");
  const [ideas, setIdeas] = useState(null);

  const classes = useStyles();

  useEffect(() => {
    GetIdeasWithFilter(contractStore, ideaStore, ideaStatusFilter).then(
      setIdeas
    );
  }, [ideaStatusFilter]);

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
      <Box sx={{ m: 4}} />
      {ideas == null ? (
        <Box sx={{ display: "flex"  }} className={classes.spinner}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container style={{ width: "100%" }} direction="row" wrap="wrap">
          {ideas.length > 0 ? (
            ideas.map((idea, index) => (
              <div key={index}>
                <IdeasCard
                  idea={idea}
                  setIdeas={setIdeas}
                />
                <Box className={classes.ideaCardSpacing} />
              </div>
            ))
          ) : (
            <>
              <Typography>No ideas found...</Typography>
            </>
          )}
        </Grid>
      )}
    </>
  );
}
