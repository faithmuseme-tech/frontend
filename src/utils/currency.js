/**
 * Format a number as Ugandan Shillings
 * e.g. 4500000 → "UGX 4,500,000"
 */
export const formatUGX = (amount) => {
  if (amount == null) return "UGX 0";
  return `UGX ${Number(amount).toLocaleString("en-UG")}`;
};

// USD → UGX conversion rate (update as needed)
export const USD_TO_UGX = 3700;

export const usdToUgx = (usd) => Math.round(usd * USD_TO_UGX);
