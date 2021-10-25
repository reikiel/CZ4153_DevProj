import React, { useState } from "react";
import { Box, Button, Input, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import { Eth } from "react-cryptocoins";

import {
  CurrentMintVoteOngoing,
  GetCurrentMintVote,
} from "../utils/MintService";
import { NAME } from "../constants/AccountConstants";
import { MINT_STATUS, MINT_USERS_VOTED } from "../constants/MintVoteConstants";
import AccountStore from "../stores/AccountStore";

const useStyles = makeStyles({
  spacing5: {
    paddingBottom: 5,
  },
  spacing30: {
    paddingBottom: 30,
  },
  container: {
    paddingTop: 40,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    textAlign: "center",
  },
  buttonWidth: {
    width: "190px",
  },
});

export default function Mint() {
  const classes = useStyles();
  const accountStore = AccountStore.useStore();

  const [mintVoteCurrentlyOn, setMintVoteOngoing] = useState(
    CurrentMintVoteOngoing()
  );
  const mintVoteObject = GetCurrentMintVote();

  const currentUserName = accountStore.get(NAME);
  const hasVoted =
    mintVoteObject != null
      ? mintVoteObject[MINT_USERS_VOTED].some(
          (votedUser) => votedUser === currentUserName
        )
      : false;

  return (
    <>
      <Typography variant="h2">Mint</Typography>
      <Box className={classes.spacing5} />
      <Typography variant="subtitle1">More coins!!!</Typography>
      {mintVoteCurrentlyOn ? (
        <Box
          className={classes.container}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Box>
            <Eth size={50} />
          </Box>
          <Typography>Current Vote Ongoing...</Typography>
          <Typography>Current Status: {mintVoteObject[MINT_STATUS]}</Typography>
          {!hasVoted && (
            <Box>
              <Button className={classes.buttonWidth}>Approve</Button>
            </Box>
          )}
        </Box>
      ) : (
        <Box
          className={classes.container}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ paddingBottom: "5px" }}>
            <Input
              required
              type="number"
              InputProps={{
                min: 0,
              }}
              endAdornment={<Eth />}
            ></Input>
          </Box>
          <Box>
            <Button
              className={classes.buttonWidth}
              onClick={() => {
                setMintVoteOngoing(true);
              }}
            >
              Mint!
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}
