import { describe, expect, it } from "vitest";
import { courseGroupFormSchema } from "@/features/catalog/model/course-group";

function messages(input: unknown): string[] {
  const result = courseGroupFormSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe("courseGroupFormSchema", () => {
  it("accepts a new name and trims it", () => {
    expect(courseGroupFormSchema.parse({ name: "  Ana Yemek  " })).toEqual({ name: "Ana Yemek" });
  });

  it("requires a name", () => {
    expect(messages({ name: "   " })).toEqual(["Grup adı zorunludur"]);
  });

  it("limits the name length", () => {
    expect(messages({ name: "a".repeat(31) })).toEqual(["Grup adı en fazla 30 karakter olabilir"]);
  });
});
