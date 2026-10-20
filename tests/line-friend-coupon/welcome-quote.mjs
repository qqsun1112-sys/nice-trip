// Offline campaign pricing simulation. No LINE or database entitlement verification.
export const WELCOME_END_TAIPEI = "2026-12-31T23:59:59+08:00";
export function quoteWelcome({unitPrice, quantity, service, code, at}) {
  if (!Number.isSafeInteger(unitPrice) || unitPrice < 0 || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 20) throw Error("invalid_ticket");
  const gross = unitPrice * quantity;
  if (!Number.isSafeInteger(gross)) throw Error("invalid_amount");
  const now = at instanceof Date ? at : new Date(at ?? Date.now());
  if (Number.isNaN(now.getTime())) throw Error("invalid_date");
  const entered = String(code ?? "").trim().toUpperCase();
  const matches = entered === "WELCOME50";
  const eligible = matches && service === "city" && unitPrice > 0 && now.getTime() <= Date.parse(WELCOME_END_TAIPEI);
  // A shared coupon code does not establish LINE ownership or unused status.
  // Quote only; never submit a discounted registration from this function.
  const provisionalDiscount = eligible ? Math.min(50, unitPrice) : 0;
  return { gross, provisionalDiscount, provisionalTotal: gross - provisionalDiscount, codeRecognized: matches, eligibleForPreview: eligible, verified: false, redeemable: false };
}
