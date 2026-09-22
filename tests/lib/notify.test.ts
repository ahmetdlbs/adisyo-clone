import { beforeEach, describe, expect, it, vi } from "vitest";
import { notifyUnavailable, UNAVAILABLE_MESSAGE } from "@/lib/notify";

const toast = vi.hoisted(() => ({ info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

describe("notifyUnavailable", () => {
  beforeEach(() => toast.info.mockClear());

  it("tells the user the feature is not available yet, without blocking like alert()", () => {
    notifyUnavailable();

    expect(toast.info).toHaveBeenCalledExactlyOnceWith(UNAVAILABLE_MESSAGE);
    expect(UNAVAILABLE_MESSAGE).toBe("Bu özellik henüz kullanılabilir değil.");
  });
});
