import {
  MINT_INITIATOR,
  MINT_STATUS,
  MINT_USERS_VOTED,
} from "../constants/MintVoteConstants";

/**
 * Returns whether there is currently an ongoing vote
 */
export const CurrentMintVoteOngoing = () => {
  return false;
};

/**
 * Returns the current minting vote object,
 * or null if it does not exist
 */
export const GetCurrentMintVote = () => {
  // TODO: Call web3
  const mintVoteStruct = {
    [MINT_INITIATOR]: "a",
    [MINT_STATUS]: "2/5", // Check logic for approval
    [MINT_USERS_VOTED]: ["a", "b", "c"],
  };

  return mintVoteStruct;
};

// Initiate a vote
export const InitiateMintVote = () => {
  // TODO: call web3
};

// Accept a vote
export const AcceptMintVote = () => {
  // TODO: call web3
};
