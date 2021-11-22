import Web3 from "web3";

import AccountsContract from "../contracts/Accounts.json";
import DGTContract from "../contracts/DGT.json";
import IdeasContract from "../contracts/Ideas.json";
import PoolContract from "../contracts/Pool.json";

import {
  LOGIN_AWAITING_USER,
  LOGIN_ERROR_METHOD_NOT_SUPPORTED,
} from "../constants/LoginStatusConstants";
import { ADDRESS } from "../constants/AccountConstants";
import {
  ACCOUNT_CONTRACT,
  IDEAS_CONTRACT,
  DGT_CONTRACT,
  POOL_CONTRACT,
} from "../constants/ContractConstants";
import {
  CONTRACT_NOT_SUPPORTED_CODE,
  CONTRACT_NOT_SUPPORTED_MESSAGE,
  WEB3_NOT_INITIALISED_CODE,
  WEB3_NOT_INITIALISED_MESSAGE,
} from "../constants/CustomCodedExceptionConstants";

import CodedException from "../utils/CodedException";

/**
 * Connects to Web3, and set Login state accordingly.
 * @param {*} setLoginState hook to set login state
 */
export const ConnectToWeb3 = async (accountStore, setLoginState) => {
  if (window.ethereum) {
    setLoginState(LOGIN_AWAITING_USER);
    const addresses = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const address = addresses[0];
    accountStore.set(ADDRESS)(address);
    return address;
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
  setLoginState(LOGIN_ERROR_METHOD_NOT_SUPPORTED);
  return null;
};

export const GetWeb3Instance = () => {
  if (window.web3.eth != null) {
    return window.web3;
  }

  window.web3 = new Web3(window.ethereum);
  return window.web3;
};

/**
 * Get Account contract. Create new instance if not exists.
 */
export const GetAccountContract = async (contractStore) => {
  return await getContract(contractStore, ACCOUNT_CONTRACT);
};

/**
 * Get DGT Token contract. Create new instance if not exists
 */
export const GetDGTContract = async (contractStore) => {
  return await getContract(contractStore, DGT_CONTRACT);
};

/**
 * Get DGT Token contract. Create new instance if not exists
 */
export const GetIdeasContract = async (contractStore) => {
  return await getContract(contractStore, IDEAS_CONTRACT);
};

/**
 * Get Pool contract. Creates new instance if not exists
 */
export const GetPoolContract = async (contractStore) => {
  return await getContract(contractStore, POOL_CONTRACT);
};

/**
 * Get contract based on the contractName. Create new instance if not
 * exists
 */
const getContract = async (
  contractStore,
  contractName,
  setupContractFunc = null
) => {
  const contract = contractStore.get(contractName);
  if (contract != null) {
    return contract;
  }

  // throws exception if web3 not detected
  const web3 = GetWeb3Instance();
  if (web3 == null) {
    throw CodedException(
      WEB3_NOT_INITIALISED_CODE,
      WEB3_NOT_INITIALISED_MESSAGE
    );
  }

  const deployedNetworkId = await getDeployedNetworkId(contractName);
  const contractAbi = getContractAbi(contractName);
  const contractInstance = new web3.eth.Contract(
    contractAbi,
    deployedNetworkId && deployedNetworkId.address
  );

  // Setup contract
  if (setupContractFunc != null) {
    setupContractFunc(contractInstance);
  }
  
  contractStore.set(contractName)(contractInstance);
  return contractInstance;
};

/**
 * Get deployed network id for the corresponding contract.
 */
const getDeployedNetworkId = async (contractName) => {
  const web3 = GetWeb3Instance();
  const networkId = await web3.eth.net.getId();

  switch (contractName) {
    case ACCOUNT_CONTRACT:
      return AccountsContract.networks[networkId];
    case DGT_CONTRACT:
      return DGTContract.networks[networkId];
    case IDEAS_CONTRACT:
      return IdeasContract.networks[networkId];
    case POOL_CONTRACT:
      return PoolContract.networks[networkId];
    default:
      throw CodedException(
        CONTRACT_NOT_SUPPORTED_CODE,
        CONTRACT_NOT_SUPPORTED_MESSAGE
      );
  }
};

const getContractAbi = (contractName) => {
  switch (contractName) {
    case ACCOUNT_CONTRACT:
      return AccountsContract.abi;
    case DGT_CONTRACT:
      return DGTContract.abi;
    case IDEAS_CONTRACT:
      return IdeasContract.abi;
    case POOL_CONTRACT:
      return PoolContract.abi;
    default:
      throw CodedException(
        CONTRACT_NOT_SUPPORTED_CODE,
        CONTRACT_NOT_SUPPORTED_MESSAGE
      );
  }
};
