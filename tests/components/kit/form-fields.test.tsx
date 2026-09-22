import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckboxField, SelectField, SwitchField, TextField } from "@/components/kit/form-fields";

const schema = z.object({
  name: z.string().trim().min(1, "Birim adı zorunludur"),
  type: z.enum(["percent", "amount"]),
  active: z.boolean(),
  printed: z.boolean(),
});
type Values = z.infer<typeof schema>;

const TYPE_OPTIONS = [
  { value: "percent", label: "Yüzde (%)" },
  { value: "amount", label: "Tutar (₺)" },
] as const;

function Harness({ onValid }: { onValid: (values: Values) => void }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", type: "percent", active: false, printed: false },
  });

  return (
    <form onSubmit={form.handleSubmit(onValid)} noValidate>
      <TextField control={form.control} name="name" label="Birim adı" description="Menüde görünür." required />
      <SelectField control={form.control} name="type" label="İndirim tipi" options={TYPE_OPTIONS} />
      <SwitchField control={form.control} name="active" label="Aktif" />
      <CheckboxField control={form.control} name="printed" label="Fişe yazdır" />
      <button type="submit">Gönder</button>
    </form>
  );
}

function setup() {
  const onValid = vi.fn();
  render(<Harness onValid={onValid} />);
  return { onValid, user: userEvent.setup() };
}

function PasswordHarness() {
  const form = useForm<{ password: string }>({ defaultValues: { password: "" } });
  return <TextField control={form.control} name="password" label="Şifre" type="password" />;
}

describe("form fields", () => {
  it("renders a password field with a visibility toggle when type is password", async () => {
    render(<PasswordHarness />);

    expect(screen.getByLabelText("Şifre")).toHaveAttribute("type", "password");
    await userEvent.click(screen.getByRole("button", { name: "Şifreyi göster" }));
    expect(screen.getByLabelText("Şifre")).toHaveAttribute("type", "text");
  });

  it("labels the input and shows its description", () => {
    setup();

    expect(screen.getByRole("textbox", { name: /Birim adı/ })).toBeInTheDocument();
    expect(screen.getByText("Menüde görünür.")).toBeInTheDocument();
  });

  it("flags a required field visually without changing its accessible label", () => {
    setup();

    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("reports the schema's message and marks the input invalid on submit", async () => {
    const { user, onValid } = setup();

    await user.click(screen.getByRole("button", { name: "Gönder" }));

    expect(await screen.findByText("Birim adı zorunludur")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Birim adı/ })).toHaveAttribute("aria-invalid", "true");
    expect(onValid).not.toHaveBeenCalled();
  });

  it("submits the typed value", async () => {
    const { user, onValid } = setup();

    await user.type(screen.getByRole("textbox", { name: /Birim adı/ }), "Tam");
    await user.click(screen.getByRole("button", { name: "Gönder" }));

    expect(onValid).toHaveBeenCalledOnce();
    expect(onValid.mock.calls[0]?.[0]).toMatchObject({ name: "Tam" });
  });

  it("shows the label of the selected option", () => {
    setup();

    expect(screen.getByRole("combobox", { name: "İndirim tipi" })).toHaveTextContent("Yüzde (%)");
  });

  it("changes the select value", async () => {
    const { user, onValid } = setup();

    await user.click(screen.getByRole("combobox", { name: "İndirim tipi" }));
    await user.click(await screen.findByRole("option", { name: "Tutar (₺)" }));
    await user.type(screen.getByRole("textbox", { name: /Birim adı/ }), "Tam");
    await user.click(screen.getByRole("button", { name: "Gönder" }));

    expect(onValid.mock.calls[0]?.[0]).toMatchObject({ type: "amount" });
  });

  it("toggles the switch", async () => {
    const { user, onValid } = setup();

    await user.click(screen.getByRole("switch", { name: "Aktif" }));
    await user.type(screen.getByRole("textbox", { name: /Birim adı/ }), "Tam");
    await user.click(screen.getByRole("button", { name: "Gönder" }));

    expect(onValid.mock.calls[0]?.[0]).toMatchObject({ active: true });
  });

  it("toggles the checkbox", async () => {
    const { user, onValid } = setup();

    await user.click(screen.getByRole("checkbox", { name: "Fişe yazdır" }));
    await user.type(screen.getByRole("textbox", { name: /Birim adı/ }), "Tam");
    await user.click(screen.getByRole("button", { name: "Gönder" }));

    expect(onValid.mock.calls[0]?.[0]).toMatchObject({ printed: true });
  });
});
