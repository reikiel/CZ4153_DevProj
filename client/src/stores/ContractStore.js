import { createConnectedStore } from "undux";
import { ACCOUNT_CONTRACT, DGT_CONTRACT, IDEAS_CONTRACT, POOL_CONTRACT } from "../constants/ContractConstants";

const initialContractState = {
  [ACCOUNT_CONTRACT]: null,
  [DGT_CONTRACT] : null,
  [IDEAS_CONTRACT]: null,
  [POOL_CONTRACT]: null,
}

export default createConnectedStore(initialContractState);