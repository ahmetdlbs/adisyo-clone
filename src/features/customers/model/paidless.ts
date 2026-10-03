import { z } from "zod";

/** Someone whose bills may be closed as "Ödenmez": settled without taking payment. */
export interface Paidless {
  id: string;
  /** Running number. Never reused, even after a delete. */
  no: number;
  firstName: string;
  lastName: string;
  title: string;
}

const MAX_LENGTH = 40;

export const paidlessFormSchema = z.object({
  firstName: z.string().trim().min(1, "Ad zorunludur").max(MAX_LENGTH, `Ad en fazla ${MAX_LENGTH} karakter olabilir`),
  lastName: z.string().trim().max(MAX_LENGTH, `Soyad en fazla ${MAX_LENGTH} karakter olabilir`),
  title: z.string().trim().max(MAX_LENGTH, `Unvan en fazla ${MAX_LENGTH} karakter olabilir`),
});
export type PaidlessFormValues = z.infer<typeof paidlessFormSchema>;

export const formatPaidlessNo = (no: number): string => `#${no}`;

const fullName = ({ firstName, lastName }: Pick<Paidless, "firstName" | "lastName">) => `${firstName} ${lastName}`.trim();

/** What a search box looks through. */
export const paidlessSearchText = (item: Paidless): string => `${fullName(item)} ${formatPaidlessNo(item.no)} ${item.title}`;
