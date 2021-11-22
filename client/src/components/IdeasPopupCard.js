import React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {
  TITLE,
  DESCRIPTION,
  NUM_VOTES,
  OWNER,
  STATUS,
} from "../constants/IdeaConstants";
import { makeStyles } from "@mui/styles";
import { DialogContent } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 600,
    minHeight: 800,
  },
}));

export default function IdeasPopupCard({ open, handleClose, idea }) {
  const classes = useStyles();

  return (
    <Dialog open={open} handleClose={handleClose}>
      <Box className={classes.card}>
        <DialogTitle>{idea[TITLE]}</DialogTitle>
        <DialogContent>
          {idea[DESCRIPTION]}
        </DialogContent>
      </Box>
    </Dialog>
  );
}
