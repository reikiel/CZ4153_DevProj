import React, { useState } from "react";
import {
  Box,
  CardActions,
  CardContent,
  Card,
  CardMedia,
  IconButton,
  Typography,
  Input,
} from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Divider from "@material-ui/core/Divider";
import { Eth } from "react-cryptocoins";

import { TITLE, BODY, NUM_VOTES, OWNER } from "../constants/IdeaConstants";
import { ACCOUNT_TYPE } from "../constants/AccountConstants";
import AccountStore from "../stores/AccountStore";
import { TryVoteForIdea } from "../utils/IdeasService";
import { USER } from "../constants/RoleConstants";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 275,
    marginRight: "10px",
    marginBottom: "20px",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
    },
    height: 350,
  },
  media: {
    paddingTop: "56.25%",
  },
  content: {
    textAlign: "left",
    padding: 2 * 3,
  },
  contentBody: {
    wordWrap: "break-word",
    overflow: "hidden",
    height: 45,
  },
  divider: {
    margin: `${2 * 3}px 0`,
  },
  heading: {
    fontWeight: "bold",
  },
  subheading: {
    lineHeight: 1.8,
  },
  avatar: {
    display: "inline-block",
    border: "2px solid white",
    "&:not(:first-of-type)": {
      marginLeft: -2,
    },
  },
  voteInputBox: {
    width: 100,
    height: 25,
    padding: 0,
  },
  paddingLeft10: {
    paddingLeft: 2,
  },
}));

export default function IdeasCard({ idea, handleClick }) {
  const classes = useStyles();
  const accountStore = AccountStore.useStore();
  const [additionalButtonClicked, setAdditionalButtonClicked] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Using dict, do not use setUserVoteCount directly
  const [voteCount, setVoteCount] = useState(0);
  const [ideaVoteCount, setIdeaVoteCount] = useState(idea[NUM_VOTES]);

  // AdditionalOptions when user presses "Add" button
  // Component rendered depends on user's Account Type
  const AdditionalOptions = () => {
    const userAccountType = accountStore.get(ACCOUNT_TYPE);
    if (userAccountType === USER) {
      return (
        <>
          <Input
            type="number"
            className={classes.voteInputBox}
            onChange={(e) => {
              setVoteCount(parseInt(e.target.value));
            }}
            value={voteCount}
          />
          <IconButton
            style={{ padding: 0, color: "grey" }}
            onClick={() => {
              setAdditionalButtonClicked(false);
              TryVoteForIdea(accountStore, idea, setIdeaVoteCount, ideaVoteCount, voteCount);
            }}
          >
            <AddCircleIcon />
          </IconButton>
        </>
      );
    }

    return (
      <>
        {/*
        <Menu
          open={additionalButtonClicked}
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MenuItem>Approve</MenuItem>
          <MenuItem>Reject</MenuItem>
          <MenuItem>Vote</MenuItem>
        </Menu>
      */}
        <IconButton
          style={{ padding: 0, color: "grey" }}
          onClick={() => {
            setAdditionalButtonClicked(false);
          }}
        >
          <AddCircleIcon />
        </IconButton>
      </>
    );
  };

  return (
    <Card variant="outlined" className={classes.card} onClick={handleClick}>
      <CardMedia
        className={classes.media}
        image={
          "https://image.freepik.com/free-photo/river-foggy-mountains-landscape_1204-511.jpg"
        }
      />
      <CardContent style={{ height: 200 }}>
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            <Typography variant="h6">{idea[TITLE]}</Typography>
            <Typography variant="caption" color="text.secondary">
              {idea[OWNER]}
            </Typography>
            <Divider className={classes.divider} light />
            <Typography component="p" className={classes.contentBody}>
              {idea[BODY]}
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Box sx={{ display: "flex", flexGrow: 1 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", minWidth: "15px" }}
              >
                <Typography>{ideaVoteCount}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  verticalAlign: "middle",
                }}
                className={classes.paddingLeft10}
              >
                <Eth color="grey" size={18} />
              </Box>
            </Box>
            <Box>
              <CardActions nospacing style={{ padding: 0, flexGrow: 1 }}>
                {additionalButtonClicked ? (
                  <AdditionalOptions />
                ) : (
                  <IconButton
                    style={{ padding: 0, color: "grey" }}
                    onClick={(e) => {
                      setAdditionalButtonClicked(true);
                      setVoteCount(0);
                    }}
                  >
                    <AddCircleIcon />
                  </IconButton>
                )}
              </CardActions>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
