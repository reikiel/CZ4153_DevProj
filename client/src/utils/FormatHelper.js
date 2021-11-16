/**
 * Adds commas between every 3 digits for an integer
 */
export const FormatTokenCount = (tokenCount) => {
  const stringifiedReversedTokenCount = tokenCount
    .toString()
    .split("")
    .reverse()
    .join("");
  const reversedNumberIntervals =
    stringifiedReversedTokenCount.match(/.{1,3}/g);

  return reversedNumberIntervals.reverse().join(",");
};
