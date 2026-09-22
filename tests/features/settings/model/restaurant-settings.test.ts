import { describe, expect, it } from "vitest";
import { restaurantSettingsFormSchema } from "@/features/settings/model/restaurant-settings";

const values = { name: "Adisyo Cafe", dayStart: "06:00", dayEnd: "23:45", lockSeconds: "0", firstOrderNumber: "101" };

describe("restaurantSettingsFormSchema", () => {
  it("accepts a filled-in form", () => {
    const result = restaurantSettingsFormSchema.parse(values);

    expect(result).toMatchObject({ name: "Adisyo Cafe", dayStart: "06:00", dayEnd: "23:45", lockSeconds: 0, firstOrderNumber: 101 });
  });

  it("needs a restaurant name", () => {
    expect(restaurantSettingsFormSchema.safeParse({ ...values, name: " " }).error?.issues[0]?.message).toBe("Restaurant adı zorunludur");
  });

  it("needs the start and end time as HH:MM", () => {
    expect(restaurantSettingsFormSchema.safeParse({ ...values, dayStart: "6:00" }).error?.issues[0]?.message).toBe("Saat SS:DD biçiminde olmalıdır");
    expect(restaurantSettingsFormSchema.safeParse({ ...values, dayEnd: "25:00" }).error?.issues[0]?.message).toBe("Saat SS:DD biçiminde olmalıdır");
  });

  it("keeps the lock timeout within 0-3600 seconds", () => {
    expect(restaurantSettingsFormSchema.safeParse({ ...values, lockSeconds: "-1" }).success).toBe(false);
    expect(restaurantSettingsFormSchema.safeParse({ ...values, lockSeconds: "3601" }).success).toBe(false);
  });

  it("keeps the first order number within 0-9999", () => {
    expect(restaurantSettingsFormSchema.safeParse({ ...values, firstOrderNumber: "10000" }).error?.issues[0]?.message).toBe(
      "İlk sipariş numarası 0 ile 9999 arasında olmalıdır"
    );
  });
});
