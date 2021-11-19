/**
 * Formats tokenCount to a easily viewable format.
 * Adds commas between every 3 digits for the 
 * tokenCount is in Wei
 */
export const FormatTokenCount = (tokenCount) => {
  const stringifiedReversedTokenCount = tokenCount
    .toString()
    .split("")
    .reverse()
    .join("");
  const reversedNumberGroups = stringifiedReversedTokenCount.match(/.{1,3}/g);

  // Convert Wei to ether format
  const numberOfGroups = reversedNumberGroups.length;
  const numberGroups = reversedNumberGroups.reverse();
  // last 18 digits are the decimal values. Since we have groups of 3,
  // this would mean that the last 6 groups form the decimals
  const decimals = "0." + numberGroups.slice(-6).join("");
  // remove trailing zeros for the decimal numbers.
  // parseFloat removes trailing zeros, and slice removes "0" string so that 
  // it is easier to concatenate with the formatted integer. 
  // If decimals == 0, formattedDecimals will become an empty string
  const formattedDecimals = parseFloat(decimals).toString().slice(1);

  // If the number of groups is less than 6, we have less that 1 DGT, and thus
  // integer is set to "0"
  const formattedInteger = numberOfGroups > 6 ? numberGroups.slice(0, -6).join(",") : "0";

  return formattedInteger + formattedDecimals;
};
