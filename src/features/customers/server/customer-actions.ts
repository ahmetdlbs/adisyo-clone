"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { Customer, CustomerFormValues } from "../model/customer";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

/** Adds a customer. Throws (message meant for the phone field) on a duplicate phone number. */
export async function fetchCustomers(): Promise<Customer[]> {
  return apiFetch<Customer[]>("/customers");
}

export async function createCustomer(values: CustomerFormValues): Promise<Customer> {
  try {
    const customer = await apiFetch<Customer>("/customers", { method: "POST", body: values });
    revalidatePath(ROUTES.restaurantCustomers);
    return customer;
  } catch (error) {
    throw asError(error, "Müşteri eklenemedi");
  }
}

/** Changes an existing customer. Throws when the phone number now belongs to someone else. */
export async function updateCustomer(id: string, values: CustomerFormValues): Promise<Customer> {
  try {
    const customer = await apiFetch<Customer>(`/customers/${id}`, { method: "PATCH", body: values });
    revalidatePath(ROUTES.restaurantCustomers);
    return customer;
  } catch (error) {
    throw asError(error, "Müşteri güncellenemedi");
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  try {
    await apiFetch(`/customers/${id}`, { method: "DELETE" });
  } catch (error) {
    throw asError(error, "Müşteri silinemedi");
  }
  revalidatePath(ROUTES.restaurantCustomers);
}
