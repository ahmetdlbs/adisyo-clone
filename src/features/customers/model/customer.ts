import { z } from "zod";
import type { Kurus } from "@/lib/money";
import { liraAmountSchema } from "@/lib/money-schema";
import { isPhoneNumber, nationalNumber } from "@/lib/phone";

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

/**
 * Adds a customer, or changes the one with `input.id`. A new customer gets the number after the highest in use.
 * Throws an Error with a Turkish message when the customer is unknown or the phone number belongs to someone else.
 */
export function saveCustomer(
  customers: readonly Customer[],
  input: CustomerFormValues & { id: string | null },
  newId: () => string
): readonly Customer[] {
  const { id, ...values } = input;
  assertPhonesFree(customers, values, id);

  if (id === null) {
    const no = Math.max(0, ...customers.map((customer) => customer.no)) + 1;
    return [...customers, { id: newId(), no, ...values }];
  }
  if (!customers.some((customer) => customer.id === id)) throw new Error("Müşteri bulunamadı");
  return customers.map((customer) => (customer.id === id ? { ...customer, ...values } : customer));
}

function assertPhonesFree(customers: readonly Customer[], values: Pick<Customer, "phone" | "phone2">, ignoreId: string | null) {
  const wanted = [values.phone, values.phone2].map(nationalNumber).filter((digits) => digits !== "");
  const taken = customers
    .filter((customer) => customer.id !== ignoreId)
    .flatMap((customer) => [customer.phone, customer.phone2])
    .map(nationalNumber);
  if (wanted.some((digits) => taken.includes(digits))) throw new Error("Bu telefon numarası başka bir müşteride kayıtlı");
}

export const totalBalance = (customers: readonly Customer[]): Kurus => customers.reduce((sum, customer) => sum + customer.balance, 0);

/** What a search box looks through. */
export const customerSearchText = (customer: Customer): string =>
  `${customer.firstName} ${customer.lastName} ${customer.phone} ${customer.phone2}`;
