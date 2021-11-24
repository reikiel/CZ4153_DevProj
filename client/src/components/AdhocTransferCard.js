import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  ADHOC_TRANSFER_AMOUNT,
  ADHOC_TRANSFER_TO,
  ADHOC_TRANSFER_NUM_APPROVALS,
  ADHOC_TRANSFER_USER_HAS_VOTED,
} from "../constants/AdhocTransferConstants";
import { Eth } from "react-cryptocoins";
import {
  GetAllActiveAdhocTransfers,
  TryApproveAdhocTransfer,
  TryRejectAdhocTransfer,
} from "../utils/TransferService";
import { default as AccountStore } from "../stores/AccountStore";
import { default as ContractStore } from "../stores/ContractStore";

const useStyles = makeStyles({
  card: {
    width: 500,
    minHeight: 150,
  },
  spacingRight5: {
    paddingRight: 5,
  },
  spacingBottom5: {
    paddingBottom: 5,
  },
  button: {
    width: 80,
  },
});

const ICON_INDICES = Array.from(Array(3).keys());

export default function AdhocTransferCard({
  adhocTransfer,
  setActiveAdhocTransfers,
}) {
  const classes = useStyles();
  const accountStore = AccountStore.useStore();
  const contractStore = ContractStore.useStore();

  const hasVoted = adhocTransfer[ADHOC_TRANSFER_USER_HAS_VOTED];
  console.log(adhocTransfer);

  const HandleApproveClick = () => {
    // TODO: Add exception handlers
    TryApproveAdhocTransfer(accountStore, contractStore, adhocTransfer.id)
      .then(() =>
        GetAllActiveAdhocTransfers(accountStore, contractStore).then(setActiveAdhocTransfers)
      )
      .catch(console.log);
  };

  const HandleRejectClick = () => {
    // TODO: Add exception handlers
    TryRejectAdhocTransfer(accountStore, contractStore, adhocTransfer.id)
      .then(() =>
        GetAllActiveAdhocTransfers(accountStore, contractStore).then(setActiveAdhocTransfers)
      )
      .catch(console.log);
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Box sx={{ display: "flex", height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">To:</Typography>
              <Box className={classes.spacingRight5} />
              <Typography variant="subtitle1">
                {adhocTransfer[ADHOC_TRANSFER_TO]}
              </Typography>
            </Box>
            <Box className={classes.spacingBottom5} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">Amount:</Typography>
              <Box className={classes.spacingRight5} />
              <Typography variant="subtitle1">
                {adhocTransfer[ADHOC_TRANSFER_AMOUNT]}
              </Typography>
              <Box className={classes.spacingRight5} />
              <Eth size={12} />
            </Box>
            <Box className={classes.spacingBottom5} />
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              {ICON_INDICES.map((index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    paddingLeft: 2,
                    paddingRight: 2,
                  }}
                >
                  <ThumbUpIcon
                    style={{
                      fontSize: 14,
                      fill:
                        index < adhocTransfer[ADHOC_TRANSFER_NUM_APPROVALS]
                          ? "green"
                          : "grey",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                </Box>
              ))}
            </Box>
            <Box className={classes.spacingBottom5} />
            {hasVoted ? (
              <Typography variant="subtitle1">Already Voted</Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Button
                  className={classes.button}
                  onClick={() => HandleApproveClick()}
                >
                  Approve
                </Button>
                <Button
                  className={classes.button}
                  onClick={() => HandleRejectClick()}
                >
                  Reject
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
