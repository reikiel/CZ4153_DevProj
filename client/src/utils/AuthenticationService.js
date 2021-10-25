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

const ALL_ROLES = [DRIVER, PARTNER_INVESTOR, INVESTOR, PARTNER, USER];

// Stores the map of routes with the corresponding permissions
const ROUTE_TO_ROLES_WITH_ACCESS = {
  [IDEAS_ROUTE]: ALL_ROLES,
  [NEW_IDEA_ROUTE]: ALL_ROLES,
  [MINT_ROUTE]: [DRIVER, INVESTOR, PARTNER],
};

/**
 * Get the list of roles that has access to the specified route.
 * Defaults to empty list - no user has access.
 */
const getRolesWithPageAccess = (route) => {
  const rolesWithAccess = ROUTE_TO_ROLES_WITH_ACCESS[route];

  return rolesWithAccess ?? [];
};

// Returns whether the user is logged in
export const IsLoggedIn = (accountStore) => {
  return accountStore.get(ACCOUNT_TYPE) !== null;
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

  if (rolesWithAccess == null) {
    return false;
  }

  return rolesWithAccess.indexOf(userRole) > -1;
};

/**
 * Attempts to login for the user.
 * Returns whether the user has successfully logged in
 */
export const TryLogIn = async (accountStore, contractStore, setLoginState) => {
  // TODO: Add authentication checks + Get account info => web3
  ConnectToWeb3(accountStore, setLoginState);

  // Successfully connected to metamusk, account address set.
  // Query AddressContract to obtain more Account info
  const address = accountStore.get(ADDRESS);
  if (address !== null) {
    console.log(address);
    const accountContract = await GetAccountContract(contractStore);
    const dgtContract = await GetDGTContract(contractStore);

    const accountRole = await accountContract.methods
      .viewAccountRole(address)
      .call();
    const accountName = await accountContract.methods
      .viewAccountName(address)
      .call();
    const dgtTokenCount = await dgtContract.methods.balanceOf(address).call();

    accountStore.set(ACCOUNT_TYPE)(accountRole);
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
