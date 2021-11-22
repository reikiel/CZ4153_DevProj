import { createConnectedStore } from "undux";

const initialIdeaState = {
  ideas: null,
};

export default createConnectedStore(initialIdeaState);
