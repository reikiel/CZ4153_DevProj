import {
  DRIVER,
  PARTNER_INVESTOR,
  INVESTOR,
  PARTNER,
  USER,
} from "../constants/RoleConstants";
import {
  IDEAS_ROUTE,
  MINT_ROUTE,
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

const ALL_ROLES = [DRIVER, PARTNER_INVESTOR, INVESTOR, PARTNER, USER];

// Stores the map of routes with the corresponding permissions
const ROUTE_TO_ROLES_WITH_ACCESS = {
  [IDEAS_ROUTE]: ALL_ROLES,
  [NEW_IDEA_ROUTE]: ALL_ROLES,
  [MINT_ROUTE]: [DRIVER, INVESTOR, PARTNER_INVESTOR, PARTNER],
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

  return rolesWithAccess.indexOf(userRole) > -1;
};

/**
 * Attempts to login for the user.
 * Throws exception for error states if there is a wallet connection issues
 * (user or otherwise)
 * Returns whether the user has successfully logged in
 */
export const TryLogIn = async (accountStore, contractStore, setLoginState) => {
  // deletes any localstorage using "accountState" key
  window.localStorage.removeItem("accountState");

  const address = await ConnectToWeb3(accountStore, setLoginState);

  // Successfully connected to metamusk, account address set.
  // Query AddressContract to obtain more Account info
  if (address !== null) {
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
    return true;
  }

  return false;
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
