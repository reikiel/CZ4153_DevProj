import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Input,
  Typography,
} from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import { Eth } from "react-cryptocoins";

import {
  GetCurrentMintVote,
  GetNumberOfTokensInPool,
  TryInitiateMintVote,
  TryAcceptMintVote,
  TryRejectMintVote,
} from "../utils/MintService";
import { FormatTokenCount } from "../utils/FormatHelper";

import { ACCOUNT_TYPE, ADDRESS } from "../constants/AccountConstants";
import {
  MINT_AMOUNT,
  MINT_IS_ACTIVE,
  MINT_USERS_VOTED,
} from "../constants/MintVoteConstants";
import AccountStore from "../stores/AccountStore";
import ContractStore from "../stores/ContractStore";
import { DRIVER } from "../constants/RoleConstants";

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
    width: "90px",
  },
  spinner: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  tokenCountText: {
    fontWeight: 500,
  },
});

export default function Mint() {
  const classes = useStyles();
  const accountStore = AccountStore.useStore();
  const contractStore = ContractStore.useStore();

  const [currentMintVote, setCurrentMintVote] = useState(null);
  const [numNewTokens, setNumNewTokens] = useState(0);
  const [numTokensInPool, setNumTokensInPool] = useState(null);

  useEffect(() => {
    GetCurrentMintVote(contractStore, setCurrentMintVote);
    GetNumberOfTokensInPool(contractStore, setNumTokensInPool);
  }, [numTokensInPool]);

  const userRole = accountStore.get(ACCOUNT_TYPE);

  // Still loading status
  if (currentMintVote == null || numTokensInPool == null) {
    return (
      <Box sx={{ display: "flex" }} className={classes.spinner}>
        <CircularProgress />
      </Box>
    );
  }

  const hasVoted = currentMintVote[MINT_USERS_VOTED].map((s) =>
    s.toLowerCase()
  ).includes(accountStore.get(ADDRESS).toLowerCase());

  return (
    <>
      <Typography variant="h2">Mint</Typography>
      <Box className={classes.spacing5} />
      <Typography variant="subtitle1">More coins!!!</Typography>
      {currentMintVote[MINT_IS_ACTIVE] ? (
        <Box
          className={classes.container}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Box>
            <Eth size={50} />
          </Box>
          <Typography className={classes.tokenCountText}>
            {"Pool Token Count: " + FormatTokenCount(numTokensInPool)}
          </Typography>
          <Typography>Current Vote Ongoing...</Typography>
          <Typography>
            Current Status:{" "}
            {currentMintVote[MINT_USERS_VOTED].length.toString() + "/3"}
          </Typography>
          <Typography>
            {"Target Mint Value: " + currentMintVote[MINT_AMOUNT].toString()}
          </Typography>
          {!hasVoted && (
            <Box>
              <Button
                className={classes.buttonWidth}
                onClick={() =>
                  TryAcceptMintVote(accountStore, contractStore)
                    .then(() => {
                      GetNumberOfTokensInPool(contractStore, setNumTokensInPool);
                    })
                    .catch(console.log)
                }
              >
                Approve
              </Button>
              <Button
                className={classes.buttonWidth}
                onClick={() =>
                  TryRejectMintVote(accountStore, contractStore)
                    .then(() =>
                      GetCurrentMintVote(contractStore, setCurrentMintVote)
                    )
                    .catch(console.log)
                }
              >
                Reject
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          {userRole === DRIVER ? (
            <Box
              className={classes.container}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Typography className={classes.tokenCountText}>
                {"Pool Token Count: " + FormatTokenCount(numTokensInPool)}
              </Typography>
              <Box sx={{ paddingBottom: "5px" }}>
                <Input
                  required
                  type="number"
                  inputprops={{
                    min: 0,
                  }}
                  onChange={(e) => setNumNewTokens(parseInt(e.target.value))}
                  endAdornment={<Eth />}
                />
              </Box>
              <Box>
                <Button
                  className={classes.buttonWidth}
                  onClick={(e) => {
                    // initiate vote
                    TryInitiateMintVote(
                      accountStore,
                      contractStore,
                      numNewTokens
                    )
                      .then(() => {
                        GetCurrentMintVote(contractStore, setCurrentMintVote);
                        setNumNewTokens(0);
                      })
                      .catch(console.log);
                  }}
                >
                  Mint!
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              className={classes.container}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Box>
                <Eth size={50} />
              </Box>
              <Typography className={classes.tokenCountText}>
                {"Pool Token Count: " + FormatTokenCount(numTokensInPool)}
              </Typography>
              <Typography>No Ongoing Minting Votes...</Typography>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
