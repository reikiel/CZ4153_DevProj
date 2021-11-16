export const LOGIN_INIT = "login_init";
export const LOGIN_SUCCESSFUL = "login_successful";
export const LOGIN_AWAITING_USER = "login_awaiting_user";
export const LOGIN_TIMEOUT = "login_timeout";

// Error type handling constants

// Login method not supported. This will happen when web3 cannot be detected or
// is running on a legacy version
export const LOGIN_ERROR_METHOD_NOT_SUPPORTED = "login_error_method_not_supported"

// [USER ERROR] -32002: Already pending for response
export const LOGIN_ERROR_ALREADY_AWAITING_USER =
  "login_error_already_waiting_user";

// Terminal state that should never be reached unless its a new error type
// that has not been handled.
export const LOGIN_FAILED = "login_failed";
