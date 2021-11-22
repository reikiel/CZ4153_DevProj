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
  TextField,
} from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import { default as AccountStore } from "../stores/AccountStore";
import { default as ContractStore } from "../stores/ContractStore";
import { default as IdeaStore } from "../stores/IdeaStore";
import { LoadIdeas, TryCreateNewIdea } from "../utils/IdeasService";

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
    width: 400,
  },
  maxWidth: {
    width: "100%",
  },
});

export default function NewIdea() {
  const classes = useStyles();
  const accountStore = AccountStore.useStore();
  const contractStore = ContractStore.useStore();
  const ideaStore = IdeaStore.useStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hasSuccessfullySubmitted, setHasSuccessfullySubmitted] =
    useState(false);

  const HandleIdeaSubmit = (e) => {
    e.preventDefault();
    // TODO: Add checks - title and content not empty
    TryCreateNewIdea(accountStore, contractStore, title, content)
      .then(() => {
        setHasSuccessfullySubmitted(true);
        // force reload of ideas from chain
        LoadIdeas(contractStore, ideaStore);
      })
      .catch((e) => console.log(e)); // TODO: Add error handlers
  };

  return (
    <>
      <Typography variant="h2">New Idea</Typography>
      <Box className={classes.spacing5} />
      <Typography variant="subtitle1">
        Create a new idea and share it with the community!
      </Typography>
      <Dialog
        open={hasSuccessfullySubmitted}
        onClose={() => {
          setHasSuccessfullySubmitted(false);

          // reset title and content
          setTitle("");
          setContent("");
        }}
      >
        <DialogTitle>Successfully submitted a new idea!</DialogTitle>
        <DialogContent>
          <DialogContentText>{"Title: " + title}</DialogContentText>
        </DialogContent>
        <DialogContent>
          <DialogContentText>{"Description: " + content}</DialogContentText>
        </DialogContent>
      </Dialog>
      <Box className={classes.formContainer}>
        <Box
          className={classes.innerFormContainer}
          component="form"
          noValidate
          onSubmit={HandleIdeaSubmit}
          sx={{ display: "flex", textAlign: "center" }}
        >
          <FormControl className={classes.maxWidth}>
            <InputLabel>Title</InputLabel>
            <Input onChange={(e) => setTitle(e.target.value)} />
            <Box className={classes.spacing30} />
            <TextField
              multiline
              rows={5}
              label="Content"
              onChange={(e) => setContent(e.target.value)}
            />
            <Box className={classes.spacing30} />
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </FormControl>
        </Box>
      </Box>
    </>
  );
}
