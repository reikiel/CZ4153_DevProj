import { TOKEN_COUNT } from "../constants/AccountConstants";
import { TITLE, BODY, NUM_VOTES, IDEA_ID, TIMESTAMP, OWNER, STATUS, PENDING_STATUS, REJECTED_STATUS } from "../constants/IdeaConstants";


const MAX_BODY_LENGTH = 51;

const shrinkIdeaBodyIfLengthOverrun = idea => {
  if (idea[BODY].length > MAX_BODY_LENGTH) {
    idea[BODY] = idea[BODY].slice(0, MAX_BODY_LENGTH) + "..."
  }
  return idea;
}

/**
 * Get all ideas
 */
export const GetIdeas = ( statusFilter ) => {
  // Replace with call to getIdeas view
  const ideas = [
    {
      [TITLE]: "Title 1",
      [BODY]: "Lorem ipsum",
      [NUM_VOTES]: 2,
      [OWNER]: "123",
      [TIMESTAMP]: 1234,
      [STATUS]: PENDING_STATUS,
      [IDEA_ID]: 0
    },
    {
      [TITLE]: "Title 2",
      [BODY]: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      [NUM_VOTES]: 0,
      [OWNER]: "123",
      [TIMESTAMP]: 12345,
      [STATUS]: PENDING_STATUS,
      [IDEA_ID]: 1
    },
    {
      [TITLE]: "Title 3",
      [BODY]: "Lorem ipsum",
      [NUM_VOTES]: 2,
      [OWNER]: "123",
      [TIMESTAMP]: 12343,
      [STATUS]: PENDING_STATUS,
      [IDEA_ID]: 2
    },
    {
      [TITLE]: "Title 4",
      [BODY]: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBBBBAAAAAAAAAAAAAAAAAAAAAAAAA",
      [NUM_VOTES]: 0,
      [OWNER]: "123",
      [TIMESTAMP]: 123123,
      [STATUS]: PENDING_STATUS,
      [IDEA_ID]: 3
    },
    {
      [TITLE]: "Title 5",
      [BODY]: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBBBBAAAAAAAAAAAAAAAAAAAAAAAAA",
      [NUM_VOTES]: 0,
      [OWNER]: "123",
      [TIMESTAMP]: 123125,
      [STATUS]: REJECTED_STATUS,
      [IDEA_ID]: 4
    }
  ]; 

  return ideas
    .map(shrinkIdeaBodyIfLengthOverrun)
    .filter(idea => statusFilter === "all" || idea.status === statusFilter)
    .sort((a,b) => b[NUM_VOTES] - a[NUM_VOTES] || b[TIMESTAMP] - a[TIMESTAMP]);
};

/**
 * Vote for ideas
 */
export const TryVoteForIdea = (accountStore, idea, setIdeaVoteCount, ideaVoteCount, voteCount) => {

  // TODO: call web3 to consume tokens and fetch updated tokens left
  const updatedVoteCount = accountStore.get(TOKEN_COUNT);
  const updatedIdeaVoteCount = voteCount + ideaVoteCount;

  setIdeaVoteCount(updatedIdeaVoteCount);
  accountStore.set(TOKEN_COUNT)(updatedVoteCount - voteCount);
}