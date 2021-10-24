import React from "react";
import {
  Box,
  Button,
  Input,
  InputLabel,
  FormControl,
  Typography,
  TextField,
} from "@mui/material";
import { makeStyles } from "@material-ui/styles";

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

  return (
    <>
      <Typography variant="h2">New Idea</Typography>
      <Box className={classes.spacing5} />
      <Typography variant="subtitle1">
        Create a new idea and share it with the community!
      </Typography>
      <Box className={classes.formContainer}>
        <Box
          className={classes.innerFormContainer}
          sx={{ display: "flex", textAlign: "center" }}
        >
          <FormControl className={classes.maxWidth}>
            <InputLabel>Title</InputLabel>
            <Input />
            <Box className={classes.spacing30} />
            <TextField multiline rows={5} label="Content" />
            <Box className={classes.spacing30} />
            <Button>Submit</Button>
          </FormControl>
        </Box>
      </Box>
    </>
  );
}
