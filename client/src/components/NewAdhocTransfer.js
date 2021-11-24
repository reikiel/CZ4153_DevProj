import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  InputLabel,
  FormControl,
  Typography,
  OutlinedInput,
} from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import { default as AccountStore } from "../stores/AccountStore";
import { default as ContractStore } from "../stores/ContractStore";
import { default as IdeaStore } from "../stores/IdeaStore";

import { Eth } from "react-cryptocoins";
import { TryCreateNewAdhocTransfers } from "../utils/TransferService";

const useStyles = makeStyles({
  spacing5: {
    paddingBottom: 5,
  },
  spacing30: {
    paddingBottom: 30,
  },
  formContainer: {
    paddingTop: 40,
    justifyContent: "center",
  },
  innerFormContainer: {
    width: 340,
  },
  maxWidth: {
    width: "100%",
  },
});

export default function NewAdhocTransfer() {
  const classes = useStyles();
  const accountStore = AccountStore.useStore();
  const contractStore = ContractStore.useStore();

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [hasSuccessfullySubmitted, setHasSuccessfullySubmitted] =
    useState(false);

  const HandleIdeaSubmit = (e) => {
    e.preventDefault();
    TryCreateNewAdhocTransfers(accountStore, contractStore, address, amount)
      .then(() => {
        setHasSuccessfullySubmitted(true);
      })
      .catch((e) => console.log(e)); // TODO: Add error handlers
  };

  return (
    <>
      <Typography variant="h2">New Adhoc Transfer</Typography>
      <Box className={classes.spacing5} />
      <Typography variant="subtitle1">Create a new adhoc transfer.</Typography>
      <Dialog
        open={hasSuccessfullySubmitted}
        onClose={() => {
          setHasSuccessfullySubmitted(false);

          // reset address and amount
          setAddress("");
          setAmount(0);
        }}
      >
        <DialogTitle>Successfully submitted a new transfer request!</DialogTitle>
        <DialogContent>
          <DialogContentText>{"Address: " + address}</DialogContentText>
        </DialogContent>
        <DialogContent>
          <DialogContentText>{"Amount: " + amount}</DialogContentText>
        </DialogContent>
      </Dialog>
      <Box className={classes.formContainer}>
        <Box
          className={classes.innerFormContainer}
          component="form"
          noValidate
          onSubmit={HandleIdeaSubmit}
          sx={{ display: "flex", textAlign: "center", flexDirection: "column" }}
        >
          <FormControl className={classes.maxWidth}>
            <InputLabel>Address</InputLabel>
            <Input onChange={(e) => setAddress(e.target.value)} />
            <Box className={classes.spacing30} />
          </FormControl>
          <FormControl>
            <InputLabel>Amount</InputLabel>
            <OutlinedInput
              type="number"
              onChange={(e) => {
                const inputNumber = e.target.value;
                if (!inputNumber.includes("-") || !inputNumber.includes(".")) {
                  setAmount(parseInt(inputNumber));
                }
              }}
              endAdornment={<Eth />}
            />
          </FormControl>
          <Box className={classes.spacing30} />
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
}
