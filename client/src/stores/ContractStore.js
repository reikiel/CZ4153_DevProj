import { createConnectedStore } from "undux";
import { ACCOUNT_CONTRACT, DGT_CONTRACT } from "../constants/ContractConstants";

const initialContractState = {
  [ACCOUNT_CONTRACT]: null,
  [DGT_CONTRACT] : null
}

export default createConnectedStore(initialContractState);