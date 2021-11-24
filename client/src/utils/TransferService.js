import { GetPoolContract, GetWeb3Instance } from "./Web3Client";

import {
  ADHOC_TRANSFER_IS_ACTIVE,
  ADHOC_TRANSFER_NUM_APPROVALS,
  ADHOC_TRANSFER_USER_HAS_VOTED,
} from "../constants/AdhocTransferConstants";
import { ADDRESS } from "../constants/AccountConstants";

/**
 * Get all adhoc transfers from chain
 */
const getAllAdhocTransfers = async (contractStore) => {
  const poolContract = await GetPoolContract(contractStore);
  const adhocTransfers = await poolContract.methods
    .getAllAdhocTransfers()
    .call();

  return adhocTransfers;
};

/**
 * Add new field to see if user has approved adhoc transfer
 */
const updateRawAdhocTransfersToUserViewableFormat = async (
  accountStore,
  contractStore,
  rawAdhocTransfer
) => {
  const poolContract = await GetPoolContract(contractStore);
  const address = accountStore.get(ADDRESS);

  const id = rawAdhocTransfer.id;
  rawAdhocTransfer[ADHOC_TRANSFER_USER_HAS_VOTED] = await poolContract.methods
    .getHasConfirmedAdhocTransfer(id)
    .call({ from: address });

  return rawAdhocTransfer;
};

/**
 * Obtain all active adhoc transfers, sorted based on number of approvals
 */
export const GetAllActiveAdhocTransfers = async (accountStore, contractStore) => {
  const adhocTransfers = await getAllAdhocTransfers(contractStore);
  const activeAdhocTransfers = adhocTransfers
    .filter((t) => t[ADHOC_TRANSFER_IS_ACTIVE])
    .sort(
      (a, b) =>
        b[ADHOC_TRANSFER_NUM_APPROVALS] - a[ADHOC_TRANSFER_NUM_APPROVALS]
    );

  return await Promise.all(
    activeAdhocTransfers.map(async (rawAdhocTransfer) =>
      updateRawAdhocTransfersToUserViewableFormat(
        accountStore,
        contractStore,
        rawAdhocTransfer
      )
    )
  );
};

/**
 * Attempts to create new adhoc transfers
 */
export const TryCreateNewAdhocTransfers = async (
  accountStore,
  contractStore,
  targetAddress,
  amount
) => {
  const poolContract = await GetPoolContract(contractStore);
  const address = accountStore.get(ADDRESS);
  const web3 = GetWeb3Instance();

  if (!web3.utils.isAddress(targetAddress)) {
    // TODO: Throw exception
    return;
  }

  await poolContract.methods
    .createNewAdhocTransfer(targetAddress, amount)
    .send({ from: address });
};

/**
 * Attempts to approve new adhoc transfer
 */
export const TryApproveAdhocTransfer = async (
  accountStore,
  contractStore,
  id
) => {
  const address = accountStore.get(ADDRESS);
  const poolContract = await GetPoolContract(contractStore);
  await poolContract.methods.approveAdhocTransfer(id).send({ from: address });
};

export const TryRejectAdhocTransfer = async (
  accountStore,
  contractStore,
  id
) => {
  const address = accountStore.get(ADDRESS);
  const poolContract = await GetPoolContract(contractStore);
  await poolContract.methods.rejectAdhocTransfer(id).send({ from: address });
};
