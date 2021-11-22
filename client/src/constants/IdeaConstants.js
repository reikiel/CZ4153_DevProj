// Idea struct constants
export const TITLE = "title";
export const DESCRIPTION = "desc";
export const NUM_VOTES = "voteCount";
export const OWNER = "owner";
export const STATUS = "status";
export const IDEA_ID = "id";
export const APPROVAL_COUNT = "approvalCount";
export const REJECTION_COUNT = "rejectCount";
export const APPROVAL_DECISION_SELECTED_COUNCIL_LIST = "council";

export const IDEAS = "ideas";

// Statuses
export const PENDING_STATUS = "pending";
export const APPROVED_STATUS = "approved";
export const REJECTED_STATUS = "rejected";

// Idea action types
export const IDEA_ACTION_VOTE = "Vote";
export const IDEA_ACTION_APPROVE = "Approve";
export const IDEA_ACTION_REJECT = "Reject";
export const ALL_IDEA_ACTIONS = [
  IDEA_ACTION_VOTE,
  IDEA_ACTION_APPROVE,
  IDEA_ACTION_REJECT,
];
