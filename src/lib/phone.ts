const MIN_PHONE_DIGITS = 10;
const MAX_PHONE_DIGITS = 13;
const NATIONAL_NUMBER_DIGITS = 10;

const digitsOf = (phone: string) => phone.replace(/\D/g, "");

/** Empty is fine (a phone is usually optional); otherwise digits with the usual separators, 10 to 13 of them. */
export function isPhoneNumber(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed === "") return true;
  if (!/^\+?[\d\s()-]+$/.test(trimmed)) return false;
  const { length } = digitsOf(trimmed);
  return length >= MIN_PHONE_DIGITS && length <= MAX_PHONE_DIGITS;
}

/** The last ten digits, so "0532 …", "+90 532 …" and "532 …" are recognised as the same number. */
export const nationalNumber = (phone: string): string => digitsOf(phone).slice(-NATIONAL_NUMBER_DIGITS);
