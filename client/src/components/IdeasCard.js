import React, { useEffect, useState } from "react";
import {
  Box,
  CardActions,
  CardContent,
  Card,
  CardMedia,
  ClickAwayListener,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Input,
} from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import StarIcon from "@mui/icons-material/Star";
import Divider from "@material-ui/core/Divider";
import { Eth } from "react-cryptocoins";

import {
  TITLE,
  DESCRIPTION,
  NUM_VOTES,
  OWNER,
  IDEA_ID,
  APPROVAL_COUNT,
  REJECTION_COUNT,
  IDEA_ACTION_APPROVE,
  IDEA_ACTION_REJECT,
  IDEA_ACTION_VOTE,
  ALL_IDEA_ACTIONS,
} from "../constants/IdeaConstants";
import AccountStore from "../stores/AccountStore";
import ContractStore from "../stores/ContractStore";
import IdeaStore from "../stores/IdeaStore";
import {
  CanExecuteIdeaAction,
  LoadIdeas,
  TryApproveIdea,
  TryRejectIdea,
  TryVoteForIdea,
} from "../utils/IdeasService";
import { UpdateAccountTokenCount } from "../utils/TokenService";
import {
  IDEA_CARD_INIT_STATE,
  IDEA_CARD_MENU_OPEN_STATE,
  IDEA_CARD_VOTE_STATE,
} from "../constants/IdeaCardStateConstants";

const useStyles = (borderColor) => {
  return makeStyles({
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
    menu: {
      height: 200,
    },
    titleBox: {
      width: 200,
    },
  });
};

const loadMenuOptions = (accountStore, idea, setMenuOptions) => {
  setMenuOptions(
    ALL_IDEA_ACTIONS.filter((action) =>
      CanExecuteIdeaAction(accountStore, idea, action)
    )
  );
};

// Obtain the color of the star icon. This is used to show
// the number of approved/rejected votes by the council
const GetStarColor = (approvalCount, rejectionCount, id) => {
  if (id < approvalCount) {
    // Approved
    return "green";
  } else if (id < approvalCount + rejectionCount) {
    // rejected
    return "red";
  } else {
    // default color for unvoted
    return "grey";
  }
};

// corresponds with the number of council members: 3
// TODO: fetch from contract
const STAR_ICON_INDICES = Array.from(Array(3).keys());

export default function IdeasCard({ idea, setIdeas }) {
  const classes = useStyles("blue")();
  const accountStore = AccountStore.useStore();
  const contractStore = ContractStore.useStore();
  const ideaStore = IdeaStore.useStore();
  const [anchorEl, setAnchorEl] = useState();
  const [cardState, setCardState] = useState(IDEA_CARD_INIT_STATE);

  // hooks to force refresh specific components on specific actions
  const [voteCount, setVoteCount] = useState(0);
  const [ideaVoteCount, setIdeaVoteCount] = useState(parseInt(idea[NUM_VOTES]));
  const [menuOptions, setMenuOptions] = useState([]);
  const [approvalCount, setApprovalCount] = useState(
    parseInt(idea[APPROVAL_COUNT])
  );
  const [rejectCount, setRejectCount] = useState(
    parseInt(idea[REJECTION_COUNT])
  );

  // upon reset, obtain updated info and update specific components
  useEffect(() => {
    loadMenuOptions(accountStore, idea, setMenuOptions);
    setIdeaVoteCount(parseInt(idea[NUM_VOTES]));
    setApprovalCount(parseInt(idea[APPROVAL_COUNT]));
    setRejectCount(parseInt(idea[REJECTION_COUNT]));
  }, [idea]);

  const reloadIdeaState = () =>
    LoadIdeas(contractStore, ideaStore).then(setIdeas);

  // AdditionalOptions when user presses "Add" button
  // Component rendered depends on user's Account Type
  // TODO: Refactor to its own component
  //       and add exception handlers
  const AdditionalOptions = ({ menuOptions }) => {
    // TODO: fix clickawaylistener
    return (
      <>
        <ClickAwayListener
          onClickAway={() => {
            setCardState(IDEA_CARD_INIT_STATE);
          }}
          mouseEvent={
            cardState === IDEA_CARD_MENU_OPEN_STATE ? "onClick" : false
          }
        >
          {cardState === IDEA_CARD_MENU_OPEN_STATE ? (
            <Menu
              open={cardState === IDEA_CARD_MENU_OPEN_STATE}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              className={classes.menu}
            >
              {menuOptions.map((action) => {
                return (
                  <MenuItem
                    data-my-value={action}
                    key={action}
                    onClick={(e) => {
                      const { myValue } = e.currentTarget.dataset;
                      switch (myValue) {
                        case IDEA_ACTION_VOTE:
                          setCardState(IDEA_CARD_VOTE_STATE);
                          break;
                        case IDEA_ACTION_APPROVE:
                          TryApproveIdea(
                            accountStore,
                            contractStore,
                            idea[IDEA_ID]
                          )
                            .then(() => {
                              reloadIdeaState();
                            })
                            .then(console.log);
                          setCardState(IDEA_CARD_INIT_STATE);
                          break;
                        case IDEA_ACTION_REJECT:
                          TryRejectIdea(
                            accountStore,
                            contractStore,
                            idea[IDEA_ID]
                          )
                            .then(() => {
                              reloadIdeaState();
                            })
                            .then(console.log);
                          setCardState(IDEA_CARD_INIT_STATE);
                          break;
                        default:
                          console.log("TODO");
                        // TODO: CodedException
                      }
                    }}
                  >
                    {action}
                  </MenuItem>
                );
              })}
            </Menu>
          ) : (
            <div></div>
          )}
        </ClickAwayListener>
      </>
    );
  };

  return (
    <Card variant="outlined" className={classes.card}>
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
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="h6" className={classes.titleBox}>
                {idea[TITLE]}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                {STAR_ICON_INDICES.map((index) => (
                  <StarIcon
                    style={{
                      fontSize: 10,
                      fill: GetStarColor(approvalCount, rejectCount, index),
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {idea[OWNER]}
            </Typography>
            <Divider className={classes.divider} light />
            <Typography component="p" className={classes.contentBody}>
              {idea[DESCRIPTION]}
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
              <CardActions style={{ padding: 0, flexGrow: 1 }}>
                <AdditionalOptions menuOptions={menuOptions} />
                {cardState === IDEA_CARD_VOTE_STATE && (
                  <Input
                    required
                    type="number"
                    className={classes.voteInputBox}
                    onChange={(e) => {
                      setVoteCount(parseInt(e.target.value));
                    }}
                  />
                )}
                <IconButton
                  style={{ padding: 0, color: "grey" }}
                  onClick={(e) => {
                    if (cardState === IDEA_CARD_INIT_STATE) {
                      // check if there are any options
                      if (menuOptions.length > 0) {
                        setCardState(IDEA_CARD_MENU_OPEN_STATE);
                        setAnchorEl(e.target);
                      }
                    } else if (cardState === IDEA_CARD_MENU_OPEN_STATE) {
                      setCardState(IDEA_CARD_INIT_STATE);
                    } else if (cardState === IDEA_CARD_VOTE_STATE) {
                      // Submit vote
                      // TODO: Add error handler
                      TryVoteForIdea(
                        accountStore,
                        contractStore,
                        idea,
                        voteCount
                      )
                        .then(() => {
                          UpdateAccountTokenCount(accountStore, contractStore);
                          setCardState(IDEA_CARD_INIT_STATE);
                          reloadIdeaState();
                        })
                        .catch(console.log);
                    } else {
                      // TODO: Add exception and error handler
                      console.log("Unexpected error");
                    }
                  }}
                >
                  <AddCircleIcon />
                </IconButton>
              </CardActions>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
