/**
 * Formats tokenCount to a easily viewable format.
 * Adds commas between every 3 digits
 */
export const FormatTokenCount = (tokenCount) => {
  const stringifiedReversedTokenCount = reverseString(tokenCount.toString());

  const reversedNumberGroups = stringifiedReversedTokenCount.match(/.{1,3}/g);

  return reversedNumberGroups.map(reverseString).reverse().join(",");
};

// reverses a string
const reverseString = (string) => {
  return string.split("").reverse().join("");
};
