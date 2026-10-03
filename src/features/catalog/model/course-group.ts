import { z } from "zod";

export interface CourseGroup {
  id: string;
  name: string;
}

const MAX_NAME_LENGTH = 30;

export const courseGroupFormSchema = z.object({
  name: z.string().trim().min(1, "Grup adı zorunludur").max(MAX_NAME_LENGTH, `Grup adı en fazla ${MAX_NAME_LENGTH} karakter olabilir`),
});

export type CourseGroupFormValues = z.infer<typeof courseGroupFormSchema>;
