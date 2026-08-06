/**
 * Format a number as Ugandan Shillings
 * e.g. 4500000 → "UGX 4,500,000"
 */
export const formatUGX = (amount) => {
  if (amount == null) return "UGX 0";
  return `UGX ${Number(amount).toLocaleString("en-UG")}`;
};

/**
 * Returns a Tailwind fontSize + fontWeight class pair that shrinks
 * as the formatted money string gets longer (more place values).
 *
 * len ≤ 9  (e.g. UGX 999)        → text-2xl font-extrabold
 * len ≤ 13 (e.g. UGX 99,999)     → text-xl  font-bold
 * len ≤ 17 (e.g. UGX 9,999,999)  → text-base font-bold
 * len ≤ 21 (e.g. UGX 999,999,999)→ text-sm   font-semibold
 * len >  21                       → text-xs   font-semibold
 */
export const moneyClass = (amount, base = "") => {
  const str = formatUGX(amount);
  const len = str.length;
  let cls;
  if (len <= 9)  cls = "text-2xl font-extrabold";
  else if (len <= 13) cls = "text-xl font-bold";
  else if (len <= 17) cls = "text-base font-bold";
  else if (len <= 21) cls = "text-sm font-semibold";
  else               cls = "text-xs font-semibold";
  return base ? `${cls} ${base}` : cls;
};

// USD → UGX conversion rate (update as needed)
export const USD_TO_UGX = 3700;

export const usdToUgx = (usd) => Math.round(usd * USD_TO_UGX);
