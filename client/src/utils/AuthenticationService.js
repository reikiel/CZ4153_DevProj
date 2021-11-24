import {
  DRIVER,
  PARTNER_INVESTOR,
  INVESTOR,
  ALL_ROLES,
} from "../constants/RoleConstants";
import {
  ADHOC_TRANSFER_ROUTE,
  IDEAS_ROUTE,
  MINT_ROUTE,
  NEW_ADHOC_TRANSFER_ROUTE,
  NEW_IDEA_ROUTE,
} from "../constants/RouteConstants";
import {
  ADDRESS,
  ACCOUNT_TYPE,
  NAME,
  TOKEN_COUNT,
} from "../constants/AccountConstants";

import {
  ConnectToWeb3,
  GetAccountContract,
  GetDGTContract,
} from "./Web3Client";
import {
  LOGIN_INIT,
  LOGIN_FAILED,
  LOGIN_ERROR_ALREADY_AWAITING_USER,
} from "../constants/LoginStatusConstants";
import {
  ADDRESS_NOT_SET_AFTER_LOGIN_SUCCESS_CODE,
  ADDRESS_NOT_SET_AFTER_LOGIN_SUCCESS_MESSAGE,
} from "../constants/CustomCodedExceptionConstants";

import CodedException from "./CodedException";

// Stores the map of routes with the corresponding permissions
const ROUTE_TO_ROLES_WITH_ACCESS = {
  [IDEAS_ROUTE]: ALL_ROLES,
  [NEW_IDEA_ROUTE]: ALL_ROLES,
  [MINT_ROUTE]: [DRIVER, INVESTOR, PARTNER_INVESTOR],
  [NEW_ADHOC_TRANSFER_ROUTE]: [DRIVER, INVESTOR, PARTNER_INVESTOR],
  [ADHOC_TRANSFER_ROUTE]: [DRIVER, INVESTOR, PARTNER_INVESTOR],
};

/**
 * Get the list of roles that has access to the specified route.
 * Defaults to empty list - no user has access.
 */
const getRolesWithPageAccess = (route) => {
  return ROUTE_TO_ROLES_WITH_ACCESS[route] ?? [];
};

// Returns whether the user is logged in
export const IsLoggedIn = (accountStore) => {
  return accountStore.get(ADDRESS) !== null;
};

/**
 * Determines whether the user has access to the resource based on
 * the accountType.
 *
 * @param route route that the user is trying to access
 * @returns whether the current user has access to the resource
 */
export const HasSpecialAccess = (accountStore, route) => {
  const userRole = accountStore.get(ACCOUNT_TYPE);
  const rolesWithAccess = getRolesWithPageAccess(route);

  return rolesWithAccess.includes(userRole);
};

/**
 * Attempts to login for the user.
 * Throws exception for error states if there is a wallet connection issues
 * (user or otherwise)
 * If there are no exceptions, all the processes required for the user to log
 * in succeeded.
 */
export const TryLogIn = async (accountStore, contractStore, setLoginState) => {
  // deletes any localstorage using "accountState" key
  window.localStorage.removeItem("accountState");

  const address = await ConnectToWeb3(accountStore, setLoginState);

  // Successfully connected to metamusk, account address set.
  // Query AddressContract to obtain more Account info
  if (address == null) {
    throw CodedException(
      ADDRESS_NOT_SET_AFTER_LOGIN_SUCCESS_CODE,
      ADDRESS_NOT_SET_AFTER_LOGIN_SUCCESS_MESSAGE
    );
  }

  const [accountContract, dgtContract] = await Promise.all([
    GetAccountContract(contractStore),
    GetDGTContract(contractStore),
  ]);

  const [accountType, accountName, dgtTokenCount] = await Promise.all([
    accountContract.methods.viewAccountRole(address).call(),
    accountContract.methods.viewAccountName(address).call(),
    dgtContract.methods.balanceOf(address).call(),
  ]);

  accountStore.set(ACCOUNT_TYPE)(accountType);
  accountStore.set(NAME)(accountName);
  accountStore.set(TOKEN_COUNT)(dgtTokenCount);
};

export const LogOut = (accountStore) => {
  localStorage.clear();
  sessionStorage.clear();
  accountStore.set(ACCOUNT_TYPE)(null);
  accountStore.set(NAME)(null);
  accountStore.set(ADDRESS)(null);
  accountStore.set(TOKEN_COUNT)(null);
};

/**
 * Handles the error for the rpc calls
 */
export const HandleWalletRPCError = (error, setLoginState) => {
  switch (error.code) {
    case 4001:
      // User cancels request. Restart login process
      setLoginState(LOGIN_INIT);
      break;
    case -32002:
      // Already pending request
      setLoginState(LOGIN_ERROR_ALREADY_AWAITING_USER);
      break;
    default:
      // Should never reach this state unless there is a new error code
      setLoginState(LOGIN_FAILED);
  }
};
