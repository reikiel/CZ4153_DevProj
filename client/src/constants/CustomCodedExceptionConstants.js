// Stores all the custom error codes and corresponding error message.
// Uses strings which starts with "c" to ensure that it does not clash with
// other external api error codes.
// [USER]: Error codes due to an invalid user side issue e.g. browser not supported
//         Starts with c1
// [DEV]: Error code usually implying a developer error - guard logic for defensive programming
//        Not to be exposed to user.
//        Starts with c2
// [INFRA]: All types of backend errors - not to be exposed directly to user
//          Starts with c3

// [USER] c10000: Web3 not detected - browser not supported
export const WEB3_NOT_INITIALISED_CODE = "c10000";
export const WEB3_NOT_INITIALISED_MESSAGE = "Web3 instance not detected.";

// [DEV] c20000: address not set after login call - this is a safety guard and
// should not happen unless login logic has been altered
export const ADDRESS_NOT_SET_AFTER_LOGIN_SUCCESS_CODE = "c20000";
export const ADDRESS_NOT_SET_AFTER_LOGIN_SUCCESS_MESSAGE =
  "User address not set after login success";

// [DEV] c20001: Contract not supported. This usually means that the
// contract is new, and the corresponding getter functions should be added
// to Web3Client.js
export const CONTRACT_NOT_SUPPORTED_CODE = "c20001";
export const CONTRACT_NOT_SUPPORTED_MESSAGE = "Contract not supported.";
