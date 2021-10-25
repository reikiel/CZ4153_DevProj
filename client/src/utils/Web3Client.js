import Web3 from "web3";

import AccountsContract from "../contracts/Accounts.json";
import DGTContract from "../contracts/DGT";

import {
  LOGIN_AWAITING_USER,
  LOGIN_FAILED,
  LOGIN_SUCCESSFUL,
} from "../constants/LoginStatusConstants";
import { ADDRESS } from "../constants/AccountConstants";
import { ACCOUNT_CONTRACT, DGT_CONTRACT } from "../constants/ContractConstants";

/**
 * Connects to Web3, and set Login state accordingly.
 * @param {*} setLoginState hook to set login state
 */
export const ConnectToWeb3 = async (accountStore, setLoginState) => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);

    setLoginState(LOGIN_AWAITING_USER);
    const addresses = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    accountStore.set(ADDRESS)(addresses[0]);
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    // Use Mist/MetaMask's provider.
    console.log("Injected web3 detected.");
  }
  // Fallback to localhost; use dev console port by default...
  else {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
    window.web3 = new Web3(provider);
    console.log("No web3 instance injected, using Local web3.");
  }
  return window.web3;
};

/**
 * Get Account contract. Create new instance if not exists.
 */
export const GetAccountContract = async (contractStore) => {
  const accountContract = contractStore.get(ACCOUNT_CONTRACT);
  if (accountContract !== null) {
    return accountContract;
  }

  if (window.web3 !== null) {
    const networkId = await window.web3.eth.net.getId();
    const deployedNetwork = AccountsContract.networks[networkId];
    const accountContract = new window.web3.eth.Contract(
      AccountsContract.abi,
      deployedNetwork && deployedNetwork.address
    );
    contractStore.set(ACCOUNT_CONTRACT)(accountContract);
    return accountContract;
  }
  console.log("ERROR: Web3 not initialised.");
};

/**
 * Get DGT Token contract. Create new instance if not exists
 */
export const GetDGTContract = async (contractStore) => {
  const dgtContract = contractStore.get(DGT_CONTRACT);
  if (dgtContract !== null) {
    return dgtContract;
  }

  if (window.web3 !== null) {
    const networkId = await window.web3.eth.net.getId();
    const deployedNetwork = DGTContract.networks[networkId];
    const dgtContract = new window.web3.eth.Contract(
      DGTContract.abi,
      deployedNetwork && deployedNetwork.address
    );
    contractStore.set(DGT_CONTRACT)(dgtContract);
    return dgtContract;
  }
  console.log("ERROR: Web3 not initialised.");
};
