import React from "react";
import { default as AccountStore } from "../stores/AccountStore";
import { default as ContractStore } from "../stores/ContractStore";
import { default as IdeaStore } from "../stores/IdeaStore";

function StoreContainer({ children }) {
  return (
    <AccountStore.Container>
      <ContractStore.Container>
        <IdeaStore.Container>{children}</IdeaStore.Container>
      </ContractStore.Container>
    </AccountStore.Container>
  );
}

export default StoreContainer;
