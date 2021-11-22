import { ADDRESS, TOKEN_COUNT } from "../constants/AccountConstants";
import { GetDGTContract } from "./Web3Client";

/**
 * Fetch updated token count from chain and update
 * account store
 */
export const UpdateAccountTokenCount = async (accountStore, contractStore) => {
  const address = accountStore.get(ADDRESS);
  const dgtContract = await GetDGTContract(contractStore);
  const tokenCount = await dgtContract.methods.balanceOf(address).call();
  accountStore.set(TOKEN_COUNT)(tokenCount);
};
