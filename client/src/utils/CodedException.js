const CodedException = (code, message) => {
  const exception = new Error(message);
  exception.code = code;
  return exception;
};

export default CodedException;
