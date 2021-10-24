import { DRIVER, INVESTOR, PARTNER, USER } from "../constants/RoleConstants";
import { IDEAS_ROUTE, MINT_ROUTE, NEW_IDEA_ROUTE } from "../constants/RouteConstants";
import { ADDRESS, ACCOUNT_TYPE, NAME, TOKEN_COUNT } from "../constants/AccountConstants";

const ALL_ROLES = [DRIVER, INVESTOR, PARTNER, USER];

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
export const TryLogIn = (accountStore, address) => {
  // TODO: Add authentication checks + Get account info => web3
  const accountDetails = {
    [NAME]: address,
    [ACCOUNT_TYPE]: ["a", "b", "c", "d", "e"].some((a) => a === address) ? DRIVER : USER,
    [TOKEN_COUNT]: 500,
  };
  const isSuccessfullyAuthenticated = true; // add actual checks

  if (!isSuccessfullyAuthenticated) {
    return false;
  }

  accountStore.set(ADDRESS)(address);
  accountStore.set(NAME)(accountDetails[NAME]);
  accountStore.set(ACCOUNT_TYPE)(accountDetails[ACCOUNT_TYPE]);
  accountStore.set(TOKEN_COUNT)(accountDetails[TOKEN_COUNT] ?? 0);

  return true;
};

export const LogOut = (accountStore) => {
  localStorage.clear();
  sessionStorage.clear();
  accountStore.set(ACCOUNT_TYPE)(null);
  accountStore.set(NAME)(null);
  accountStore.set(ADDRESS)(null);
  accountStore.set(TOKEN_COUNT)(null);
}