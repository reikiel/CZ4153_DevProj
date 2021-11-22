import {
  ADDRESS,
  ACCOUNT_TYPE,
  TOKEN_COUNT,
} from "../constants/AccountConstants";
import {
  ALL_ROLES,
  DRIVER,
  PARTNER,
  PARTNER_INVESTOR,
} from "../constants/RoleConstants";
import {
  DESCRIPTION,
  NUM_VOTES,
  OWNER,
  STATUS,
  IDEA_ID,
  IDEAS,
  IDEA_ACTION_VOTE,
  IDEA_ACTION_APPROVE,
  IDEA_ACTION_REJECT,
  APPROVAL_DECISION_SELECTED_COUNCIL_LIST,
  PENDING_STATUS,
} from "../constants/IdeaConstants";
import {
  GetAccountContract,
  GetDGTContract,
  GetPoolContract,
  GetIdeasContract,
} from "./Web3Client";

const MAX_OWNER_TEXT_LENGTH = 30;
const MAX_DESCRIPTION_LENGTH = 60;

/**
 * reduce owner field text length if it exceeds MAX_OWNER_TEXT_LENGTH
 */
const shrinkOwnerTextIfLengthOverrun = (idea) => {
  if (idea[OWNER].length > MAX_OWNER_TEXT_LENGTH) {
    idea[OWNER] = idea[OWNER].slice(0, MAX_OWNER_TEXT_LENGTH) + "...";
  }
  return idea;
};

/**
 * reduce description field text length if it exceeds MAX_DESCRIPTION_LENGTH
 */
const shrinkIdeaDescriptionIfLengthOverrun = (idea) => {
  if (idea[DESCRIPTION].length > MAX_DESCRIPTION_LENGTH) {
    idea[DESCRIPTION] =
      idea[DESCRIPTION].slice(0, MAX_DESCRIPTION_LENGTH) + "...";
  }
  return idea;
};

/**
 * Parses the raw idea from chain to a format viable for users to view
 * Does the following currently.
 * (1) Convert OWNER field to the recorded account name instead of raw address
 */
const updateRawIdeaToUserViewableFormat = async (idea, accountsContract) => {
  const address = idea[OWNER];

  // Override OWNER to use accountName
  // TODO: Currently assumes that viewAccountName always succeeds (address can
  // be found). Add guards to check.
  idea[OWNER] = await accountsContract.methods.viewAccountName(address).call();

  return idea;
};

/**
 * Load ideas directly from the ideas contract and overwrites ideaStore
 * Can be used to refresh the ideas state.
 */
export const LoadIdeas = async (contractStore, ideaStore) => {
  const [ideasContract, accountsContract] = await Promise.all([
    await GetIdeasContract(contractStore),
    await GetAccountContract(contractStore),
  ]);

  // Obtain ideas from blockchain
  const rawIdeas = await ideasContract.methods.getAllIdeas().call();

  // Update fields for frontend
  const ideas = await Promise.all(
    rawIdeas.map(async (idea) =>
      updateRawIdeaToUserViewableFormat(idea, accountsContract)
    )
  );

  ideaStore.set(IDEAS)(ideas);

  return ideas;
};

/**
 * Get ideas with the corresponding id
 * Returns undefined if not found
 */
export const GetIdeaWithID = (ideaStore, id) => {
  const ideas = ideaStore.get(IDEAS);

  return ideas.find((idea) => idea[IDEA_ID] === id);
};

/**
 * Get all ideas. Defaults to using the ideaStore, but will load
 * using the Idea contract if no idea found in store.
 */
export const GetAllIdeas = async (contractStore, ideaStore) => {
  const ideas = ideaStore.get(IDEAS);
  if (ideas != null) {
    return ideas;
  }

  return await LoadIdeas(contractStore, ideaStore);
};

/**
 * Get all ideas based on the provided filter
 */
export const GetIdeasWithFilter = async (
  contractStore,
  ideaStore,
  statusFilter
) => {
  const ideas = await GetAllIdeas(contractStore, ideaStore);

  return ideas
    .filter((idea) => statusFilter === "all" || idea[STATUS] === statusFilter)
    .map(shrinkIdeaDescriptionIfLengthOverrun)
    .map(shrinkOwnerTextIfLengthOverrun)
    .sort((a, b) => b[NUM_VOTES] - a[NUM_VOTES]);
};

/**
 * Vote for ideas
 */
export const TryVoteForIdea = async (
  accountStore,
  contractStore,
  idea,
  voteCount
) => {
  const userTokenCount = accountStore.get(TOKEN_COUNT);
  const address = accountStore.get(ADDRESS);

  const [ideasContract, dgtContract, poolContract] = await Promise.all([
    GetIdeasContract(contractStore),
    GetDGTContract(contractStore),
    GetPoolContract(contractStore),
  ]);

  if (userTokenCount < voteCount) {
    // Check if user has sufficient tokens. Possible for concurrency
    // attacks. Need verify on contract
    // TODO: Switch to throw CodedException
    return { success: false };
  }

  // increase allowance
  await dgtContract.methods
    .increaseAllowance(poolContract.options.address, voteCount)
    .send({ from: address });

  // vote idea on chain
  await ideasContract.methods
    .voteIdea(voteCount, idea[IDEA_ID])
    .send({ from: address });

  return { success: true };
};

/**
 * Attempts to approve the idea
 */
export const TryApproveIdea = async (accountStore, contractStore, ideaId) => {
  const address = accountStore.get(ADDRESS);
  const ideasContract = await GetIdeasContract(contractStore);

  const success = await ideasContract.methods
    .approveRejectIdea(true, ideaId, address)
    .send({ from: address });

  return success;
};

/**
 * Attempts to reject the idea
 */
export const TryRejectIdea = async (accountStore, contractStore, ideaId) => {
  const address = accountStore.get(ADDRESS);
  const ideasContract = await GetIdeasContract(contractStore);
  await ideasContract.methods
    .approveRejectIdea(false, ideaId, address)
    .send({ from: address });
};

/**
 * Attempts to create new idea on chain
 */
export const TryCreateNewIdea = async (
  accountStore,
  contractStore,
  title,
  content
) => {
  const address = accountStore.get(ADDRESS);
  const ideaContract = await GetIdeasContract(contractStore);

  await ideaContract.methods.createIdea(content, title).send({ from: address });
};

// stores the idea actions and corresponding roles that have the permissions
// to execute the actions
const IDEA_ACTION_PERMISSIONS = {
  [IDEA_ACTION_VOTE]: ALL_ROLES,
  [IDEA_ACTION_APPROVE]: [DRIVER, PARTNER, PARTNER_INVESTOR],
  [IDEA_ACTION_REJECT]: [DRIVER, PARTNER, PARTNER_INVESTOR],
};

/**
 * Determines if the current user has the ability to execute the
 * idea action
 */
export const CanExecuteIdeaAction = (accountStore, idea, actionType) => {
  const userRole = accountStore.get(ACCOUNT_TYPE);
  const address = accountStore.get(ADDRESS);

  // Check if user has permissions to the action
  const rolesWithPermissionsToExecuteAction =
    IDEA_ACTION_PERMISSIONS[actionType] ?? [];

  let userHasPermissions =
    rolesWithPermissionsToExecuteAction.includes(userRole);

  // Check if idea is in PENDING state
  const ideaInPendingState = idea[STATUS] === PENDING_STATUS;
  userHasPermissions = userHasPermissions && ideaInPendingState;

  // If it is an approval decision, check the following:
  // (1) if council has already voted
  // (2) vote more than 100
  if ([IDEA_ACTION_APPROVE, IDEA_ACTION_REJECT].includes(actionType)) {
    // (1) Check if user has voted
    // address is mapped to lower case as some eth wallets screw up the
    // casing, but the functionality works regardless of case.
    const councilMembersVoted =
      idea[APPROVAL_DECISION_SELECTED_COUNCIL_LIST] ?? [];
    const userHasNotVoted = !councilMembersVoted
      .map((s) => s.toLowerCase())
      .includes(address.toLowerCase());

    // (2) Check if number of votes exceed 100
    const votesExceedMinimum = idea[NUM_VOTES] > 100;

    userHasPermissions =
      userHasPermissions && userHasNotVoted && votesExceedMinimum;
  }
  return userHasPermissions;
};
