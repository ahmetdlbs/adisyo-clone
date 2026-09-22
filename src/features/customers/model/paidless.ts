import { z } from "zod";
import { isNameTaken } from "@/lib/collection";

/** Someone whose bills may be closed as "Ödenmez": settled without taking payment. */
export interface Paidless {
  id: string;
  /** Running number. Never reused, even after a delete. */
  no: number;
  firstName: string;
  lastName: string;
  title: string;
}

const FIRST_NUMBER = 10_000_000;
const MAX_LENGTH = 40;

export const paidlessFormSchema = z.object({
  firstName: z.string().trim().min(1, "Ad zorunludur").max(MAX_LENGTH, `Ad en fazla ${MAX_LENGTH} karakter olabilir`),
  lastName: z.string().trim().max(MAX_LENGTH, `Soyad en fazla ${MAX_LENGTH} karakter olabilir`),
  title: z.string().trim().max(MAX_LENGTH, `Unvan en fazla ${MAX_LENGTH} karakter olabilir`),
});
export type PaidlessFormValues = z.infer<typeof paidlessFormSchema>;

export const formatPaidlessNo = (no: number): string => `#${no}`;

const fullName = ({ firstName, lastName }: Pick<Paidless, "firstName" | "lastName">) => `${firstName} ${lastName}`.trim();

/**
 * Adds a person, or changes the one with `input.id`. Throws an Error with a Turkish message when the person is
 * unknown or another entry already has the same full name.
 */
export function savePaidless(
  items: readonly Paidless[],
  input: PaidlessFormValues & { id: string | null },
  newId: () => string
): readonly Paidless[] {
  const { id, ...values } = input;
  const names = items.map((item) => ({ id: item.id, name: fullName(item) }));
  if (isNameTaken(names, fullName(values), id)) throw new Error("Bu kişi zaten kayıtlı");

  if (id === null) {
    const no = Math.max(FIRST_NUMBER - 1, ...items.map((item) => item.no)) + 1;
    return [...items, { id: newId(), no, ...values }];
  }
  if (!items.some((item) => item.id === id)) throw new Error("Kayıt bulunamadı");
  return items.map((item) => (item.id === id ? { ...item, ...values } : item));
}

/** What a search box looks through. */
export const paidlessSearchText = (item: Paidless): string => `${fullName(item)} ${formatPaidlessNo(item.no)} ${item.title}`;
