import { createConnectedStore } from "undux";
import { ACCOUNT_TYPE, ADDRESS, TOKEN_COUNT, NAME } from "../constants/AccountConstants";

// Persistent Accounts store - state remains even after refresh
const initialAccountState = {
  [NAME]: null,
  [ADDRESS]: null,
  [ACCOUNT_TYPE]: null,
  [TOKEN_COUNT]: null,
};

/**
 * Saves Account state to localStorage
 */
const withLocalStorage = (store) => {
  window.addEventListener("unload", () =>
    window.localStorage.setItem(
      "accountState",
      JSON.stringify(store.getState())
    )
  );
  return store;
};

/**
 * Load Account state from localStorage if it exists
 */
const fromLocalStorage = () => {
  const savedAccountState = JSON.parse(
    window.localStorage.getItem("accountState")
  );

  if (savedAccountState == null) {
    return initialAccountState;
  }
  return { ...initialAccountState, ...savedAccountState };
};

export default createConnectedStore(fromLocalStorage(), withLocalStorage);
