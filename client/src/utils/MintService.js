import { ADDRESS } from "../constants/AccountConstants";
import {
  MINT_AMOUNT,
  MINT_IS_ACTIVE,
  MINT_USERS_VOTED,
} from "../constants/MintVoteConstants";

import { GetPoolContract } from "./Web3Client";

/**
 * Returns the current minting vote object
 */
export const GetCurrentMintVote = async (contractStore, setCurrentMintVote) => {
  const poolContract = await GetPoolContract(contractStore);

  const mintStatus = await poolContract.methods.viewMintStatus().call();

  setCurrentMintVote({
    [MINT_IS_ACTIVE]: mintStatus[0],
    [MINT_AMOUNT]: mintStatus[1],
    [MINT_USERS_VOTED]: mintStatus[2],
  });
};

/**
 * Get the current pool size
 */
export const GetNumberOfTokensInPool = async (
  contractStore,
  setNumTokensInPool
) => {
  const poolContract = await GetPoolContract(contractStore);

  const numberOfTokensInPool = await poolContract.methods
    .viewPoolBalance()
    .call();

  setNumTokensInPool(numberOfTokensInPool);
};

// Initiate a vote
export const TryInitiateMintVote = async (
  accountStore,
  contractStore,
  numTokens
) => {
  const address = accountStore.get(ADDRESS);
  const poolContract = await GetPoolContract(contractStore);

  await poolContract.methods.requestMint(numTokens).send({ from: address });
};

// Accept mint
export const TryAcceptMintVote = async (accountStore, contractStore) => {
  const address = accountStore.get(ADDRESS);
  const poolContract = await GetPoolContract(contractStore);
  await poolContract.methods.approveMint(address).send({ from: address });
};

// Reject mint
export const TryRejectMintVote = async (accountStore, contractStore) => {
  const address = accountStore.get(ADDRESS);
  const poolContract = await GetPoolContract(contractStore);
  await poolContract.methods.rejectMint(address).send({ from: address });
};
