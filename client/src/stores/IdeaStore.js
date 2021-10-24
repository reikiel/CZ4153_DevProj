import { createConnectedStore } from "undux";
import { GetIdeas } from "../utils/IdeasService";

const initialIdeaState = {
  ideas: GetIdeas("all")
}

export default createConnectedStore(initialIdeaState);