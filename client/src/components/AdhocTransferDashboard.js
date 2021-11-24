import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import AccountStore from "../stores/AccountStore";
import ContractStore from "../stores/ContractStore";
import { GetAllActiveAdhocTransfers } from "../utils/TransferService";
import AdhocTransferCard from "./AdhocTransferCard";

const useStyles = makeStyles({
  spacing5: {
    paddingBottom: 5,
  },
  spacing20: {
    paddingBottom: 20,
  },
  spinner: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  transferCardSpacing: {
    paddingBottom: 20,
  },
});

export default function AdhocTransferDashboard() {
  const classes = useStyles();
  const accountStore = AccountStore.useStore();
  const contractStore = ContractStore.useStore();

  const [activeAdhocTransfers, setActiveAdhocTransfers] = useState(null);

  useEffect(() => {
    GetAllActiveAdhocTransfers(accountStore, contractStore).then(setActiveAdhocTransfers);
  }, []);

  // Still loading status
  if (activeAdhocTransfers == null) {
    return (
      <Box sx={{ display: "flex" }} className={classes.spinner}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h2">Adhoc Transfer</Typography>
      <Box className={classes.spacing5} />
      <Typography variant="subtitle1">Transfers to users</Typography>
      <Box className={classes.spacing20} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {activeAdhocTransfers.length > 0 ? (
          <div>
            {activeAdhocTransfers.map((adhocTransfer, index) => (
              <div key={index}>
                <AdhocTransferCard
                  adhocTransfer={adhocTransfer}
                  setActiveAdhocTransfers={setActiveAdhocTransfers}
                />
                <Box className={classes.transferCardSpacing} />
              </div>
            ))}
          </div>
        ) : (
          <Typography>No active adhoc transfers found...</Typography>
        )}
      </Box>
    </>
  );
}
