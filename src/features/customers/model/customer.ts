import { z } from "zod";
import type { Kurus } from "@/lib/money";
import { liraAmountSchema } from "@/lib/money-schema";
import { isPhoneNumber } from "@/lib/phone";

export interface Customer {
  id: string;
  /** Running number shown in the list. Never reused, even after a delete. */
  no: number;
  firstName: string;
  lastName: string;
  phone: string;
  phone2: string;
  /** What the customer owes, in kuruş. */
  balance: Kurus;
}

const MAX_NAME_LENGTH = 40;

const phoneSchema = z.string().trim().refine(isPhoneNumber, "Geçerli bir telefon numarası giriniz");

export const customerFormSchema = z.object({
  firstName: z.string().trim().min(1, "Ad zorunludur").max(MAX_NAME_LENGTH, `Ad en fazla ${MAX_NAME_LENGTH} karakter olabilir`),
  lastName: z.string().trim().max(MAX_NAME_LENGTH, `Soyad en fazla ${MAX_NAME_LENGTH} karakter olabilir`),
  phone: phoneSchema,
  phone2: phoneSchema,
  balance: liraAmountSchema({ message: "Geçerli bir bakiye giriniz", allowZero: true, allowEmpty: true }),
});
export type CustomerFormInput = z.input<typeof customerFormSchema>;
export type CustomerFormValues = z.output<typeof customerFormSchema>;

export const totalBalance = (customers: readonly Customer[]): Kurus => customers.reduce((sum, customer) => sum + customer.balance, 0);

/** What a search box looks through. */
export const customerSearchText = (customer: Customer): string =>
  `${customer.firstName} ${customer.lastName} ${customer.phone} ${customer.phone2}`;
