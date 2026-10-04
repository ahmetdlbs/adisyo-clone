import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadCsv, kurusCell, toCsv } from "@/lib/csv";

describe("toCsv", () => {
  it("joins cells with semicolons and rows with CRLF", () => {
    expect(toCsv(["Ad", "Adet"], [["Çay", 3]])).toBe("Ad;Adet\r\nÇay;3");
  });

  it("quotes cells holding separators, quotes or line breaks", () => {
    expect(toCsv(["a"], [['x;y'], ['say "hi"'], ["l1\nl2"]])).toBe('a\r\n"x;y"\r\n"say ""hi"""\r\n"l1\nl2"');
  });

  it("renders null and undefined as empty cells", () => {
    expect(toCsv(["a", "b", "c"], [[null, undefined, 0]])).toBe("a;b;c\r\n;;0");
  });

  it("neutralises text that a spreadsheet would run as a formula", () => {
    expect(toCsv(["a"], [["=SUM(A1)"], ["@cmd"], ["-5"]])).toBe("a\r\n'=SUM(A1)\r\n'@cmd\r\n-5");
  });
});

describe("downloadCsv", () => {
  afterEach(() => vi.restoreAllMocks());

  it("saves a BOM-prefixed UTF-8 file under the given name", async () => {
    const create = vi.fn<(blob: Blob) => string>().mockReturnValue("blob:x");
    vi.stubGlobal("URL", { createObjectURL: create, revokeObjectURL: vi.fn() });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    downloadCsv("stok.csv", ["Ad"], [["Çay"]]);

    const blob = create.mock.calls[0]![0];
    expect(blob.type).toBe("text/csv;charset=utf-8");
    const bytes = new Uint8Array(await blob.arrayBuffer());
    expect([...bytes.slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
    expect(await blob.text()).toBe("Ad\r\nÇay");
    expect(click).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });
});

describe("kurusCell", () => {
  it("writes kuruş as a decimal-comma number", () => {
    expect(kurusCell(1250)).toBe("12,50");
    expect(kurusCell(5)).toBe("0,05");
  });
});
