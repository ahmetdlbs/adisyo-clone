"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Controller, useFieldArray, useForm, useWatch, type FieldErrors, type UseFormReturn } from "react-hook-form";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";
import { PageCard, PageContainer } from "@/components/kit/page";
import { SelectField, SwitchField, TextField } from "@/components/kit/form-fields";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CourseGroup } from "@/features/catalog/model/course-group";
import type { FeatureGroup } from "@/features/catalog/model/feature-group";
import type { KitchenGroup } from "@/features/catalog/model/kitchen-group";
import type { Unit } from "@/features/catalog/model/unit";
import type { VatDefinition } from "@/features/catalog/model/vat";
import { useHasApp } from "@/features/entitlements/components/active-apps-provider";
import { APP_KEYS } from "@/features/entitlements/model/app-keys";
import type { StockItem } from "@/features/stock/model/stock-item";
import { ROUTES } from "@/config/routes";
import { toAmountText } from "@/lib/money";
import { productFormSchema, type ProductFormInput, type ProductFormValues } from "../model/definition-forms";
import type { Category, Product } from "../model/pos-state";
import { usePosActions, usePosState } from "../store/pos-provider";

interface ProductDetailScreenProps {
  /** A real product's id, or "new" to create one. */
  productId: string;
  vatDefinitions: readonly VatDefinition[];
  kitchenGroups: readonly KitchenGroup[];
  courseGroups: readonly CourseGroup[];
  units: readonly Unit[];
  featureGroups: readonly FeatureGroup[];
  stockItems: readonly StockItem[];
}

const blankPortion = (isDefault: boolean) => ({
  id: crypto.randomUUID(),
  name: isDefault ? "Tam" : "",
  isDefault,
  tablePrice: "",
  takeawayPrice: "",
  deliveryPrice: "",
  unitId: "",
  costAmount: "",
  recipeLines: [],
});

const blankComboItem = () => ({ id: crypto.randomUUID(), productId: "", portionId: "", quantity: "1" });

/**
 * The full-page product editor: this replaces the old right-side "add product" sheet, matching the real POS's
 * "Ürün Detay" screen. The product itself comes from the already-loaded POS snapshot (no extra fetch, and it
 * stays in sync with the list screen); only the reference lists it links to (KDV/mutfak/marş grubu, birimler,
 * özellik grupları, stok kartları) are server-fetched props, since those are not part of that snapshot.
 */
export function ProductDetailScreen({ productId, vatDefinitions, kitchenGroups, courseGroups, units, featureGroups, stockItems }: ProductDetailScreenProps) {
  const router = useRouter();
  const state = usePosState();
  const actions = usePosActions();
  const isNew = productId === "new";
  const product = isNew ? null : (state.products.find((candidate) => candidate.id === productId) ?? null);

  if (!isNew && !product) {
    return (
      <PageContainer className="max-w-3xl items-center justify-center text-center">
        <p className="text-sm text-muted-foreground">Ürün bulunamadı.</p>
        <Button className="mt-4" onClick={() => router.push(ROUTES.productDefinition)}>
          Ürün listesine dön
        </Button>
      </PageContainer>
    );
  }

  // A combo can bundle any ordinary product, but never itself and never another combo (no nested menus).
  const comboCandidates = state.products.filter((candidate) => candidate.id !== product?.id && !candidate.isCombo);

  return (
    <ProductForm
      product={product}
      vatDefinitions={vatDefinitions}
      kitchenGroups={kitchenGroups}
      courseGroups={courseGroups}
      units={units}
      featureGroups={featureGroups}
      stockItems={stockItems}
      comboCandidates={comboCandidates}
      categories={state.categories}
      onSave={async (values) => {
        const saved = await actions.saveProduct(product?.id ?? null, values);
        toast.success(product ? "Ürün güncellendi" : "Ürün eklendi");
        router.push(ROUTES.productDefinition);
        return saved;
      }}
      onDelete={
        product
          ? async () => {
              try {
                await actions.deleteProduct(product.id);
                toast.success("Ürün silindi");
                router.push(ROUTES.productDefinition);
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Ürün silinemedi");
              }
            }
          : undefined
      }
    />
  );
}

interface ProductFormProps extends Omit<ProductDetailScreenProps, "productId"> {
  product: Product | null;
  categories: readonly Category[];
  comboCandidates: readonly Product[];
  onSave: (values: ProductFormValues) => Promise<unknown>;
  onDelete?: () => Promise<void>;
}

function ProductForm({
  product,
  categories,
  vatDefinitions,
  kitchenGroups,
  courseGroups,
  units,
  featureGroups,
  stockItems,
  comboCandidates,
  onSave,
  onDelete,
}: ProductFormProps) {
  const router = useRouter();
  const hasRecipeApp = useHasApp([APP_KEYS.recipeCost]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      categoryId: product?.categoryId ?? categories[0]?.id ?? "",
      color: product?.color ?? "",
      barcode: product?.barcode ?? "",
      productCode: product?.productCode ?? "",
      isFavorite: product?.isFavorite ?? false,
      showOnSalesScreen: product?.showOnSalesScreen ?? true,
      showOnKitchenScreen: product?.showOnKitchenScreen ?? true,
      vatExcluded: product?.vatExcluded ?? false,
      autoAskFeaturePortion: product?.autoAskFeaturePortion ?? false,
      useRecipe: product?.useRecipe ?? false,
      trackStock: product?.trackStock ?? false,
      isCombo: product?.isCombo ?? false,
      vatDefinitionId: product?.vatDefinitionId ?? "",
      kitchenGroupId: product?.kitchenGroupId ?? "",
      courseGroupId: product?.courseGroupId ?? "",
      portions:
        product && product.portions.length > 0
          ? product.portions.map((portion) => ({
              id: portion.id,
              name: portion.name,
              isDefault: portion.isDefault,
              tablePrice: toAmountText(portion.tablePrice),
              takeawayPrice: toAmountText(portion.takeawayPrice),
              deliveryPrice: toAmountText(portion.deliveryPrice),
              unitId: portion.unitId ?? "",
              costAmount: portion.costAmount != null ? toAmountText(portion.costAmount) : "",
              recipeLines: portion.recipeLines.map((line) => ({
                id: crypto.randomUUID(),
                stockItemId: line.stockItemId,
                quantity: String(line.quantity),
              })),
            }))
          : [blankPortion(true)],
      featureGroupIds: [...(product?.featureGroupIds ?? [])],
      comboItems: product?.comboItems.map((item) => ({
        id: crypto.randomUUID(),
        productId: item.productId,
        portionId: item.portionId,
        quantity: String(item.quantity),
      })) ?? [],
    },
  });

  const portions = useFieldArray({ control: form.control, name: "portions" });
  const comboItems = useFieldArray({ control: form.control, name: "comboItems" });
  const { errors } = form.formState;
  const portionsError = errors.portions?.message ?? errors.portions?.root?.message;
  const comboItemsError = errors.comboItems?.message ?? errors.comboItems?.root?.message;
  const featureGroupIds = useWatch({ control: form.control, name: "featureGroupIds" });
  const useRecipe = useWatch({ control: form.control, name: "useRecipe" });
  const trackStock = useWatch({ control: form.control, name: "trackStock" });
  const isCombo = useWatch({ control: form.control, name: "isCombo" });

  const toggleFeatureGroup = (id: string, checked: boolean) => {
    form.setValue("featureGroupIds", checked ? [...featureGroupIds, id] : featureGroupIds.filter((existing) => existing !== id), {
      shouldDirty: true,
    });
  };

  const makeDefaultPortion = (index: number) => {
    portions.fields.forEach((_, otherIndex) => form.setValue(`portions.${otherIndex}.isDefault`, otherIndex === index));
  };

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSave(values);
    } catch (error) {
      form.setError("name", { message: error instanceof Error ? error.message : "Kaydedilemedi" });
    }
  });

  return (
    <PageContainer className="max-w-6xl">
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col gap-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" size="icon" aria-label="Geri" onClick={() => router.push(ROUTES.productDefinition)}>
              <ArrowLeft />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Ürün Detay</h1>
          </div>
          <div className="flex items-center gap-2">
            {product && (
              <Button
                type="button"
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                Ürünü Sil
              </Button>
            )}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {product ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-auto pb-2 lg:grid-cols-[280px_1fr] lg:items-start">
          <aside className="flex flex-col gap-4">
            <PageCard className="gap-5 p-6">
              <div className="flex h-28 items-center justify-center rounded-md border border-dashed bg-muted text-xs text-muted-foreground">
                Ürün Görseli
              </div>
              <TextField control={form.control} name="name" label="Ürün Adı" required autoFocus />
            </PageCard>

            <PageCard className="gap-1 p-6">
              <h2 className="pb-2 text-base font-semibold tracking-tight text-foreground">Parametreler</h2>
              <SwitchField control={form.control} name="isFavorite" label="Favori Ürün" />
              <SwitchField control={form.control} name="showOnSalesScreen" label="Satış Ekranında Göster" />
              <SwitchField control={form.control} name="vatExcluded" label="KDV hariç olsun" />
              <SwitchField control={form.control} name="autoAskFeaturePortion" label="Özellik ve Porsiyon Otomatik Sorulsun" />
              <SwitchField control={form.control} name="showOnKitchenScreen" label="Mutfak Ekranında Göster" />
            </PageCard>

            <PageCard className="gap-1 p-6">
              <h2 className="pb-2 text-base font-semibold tracking-tight text-foreground">Diğer</h2>
              {hasRecipeApp && (
                <SwitchField
                  control={form.control}
                  name="useRecipe"
                  label="Reçeteli ürün kullan"
                  description="Porsiyonlarda tükettiği hammaddeleri aşağıda tanımlayın."
                />
              )}
              <SwitchField
                control={form.control}
                name="trackStock"
                label="Stok takibi yap"
                description="Ürünün kendisi bir stok kartına karşılık gelsin."
              />
              <SwitchField control={form.control} name="isCombo" label="Menü Tanımla" description="Bu ürün başka ürünleri bir arada satsın." />
            </PageCard>
          </aside>

          <div className="flex flex-col gap-4">
            <PageCard className="gap-5 p-6">
              <h2 className="text-base font-semibold tracking-tight text-foreground">Genel Bilgiler</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectField
                  control={form.control}
                  name="categoryId"
                  label="Kategoriler"
                  required
                  options={categories.map((category) => ({ value: category.id, label: category.name }))}
                />
                <TextField control={form.control} name="color" label="Ürün Rengi" placeholder="#22c55e" />
                <SelectField
                  control={form.control}
                  name="vatDefinitionId"
                  label="Ürün KDV Grubu"
                  options={vatDefinitions.map((vat) => ({ value: vat.id, label: vat.name }))}
                />
                <SelectField
                  control={form.control}
                  name="kitchenGroupId"
                  label="Mutfak Grubu"
                  options={kitchenGroups.map((group) => ({ value: group.id, label: group.name }))}
                />
                <TextField control={form.control} name="productCode" label="Ürün Kodu" />
                <SelectField
                  control={form.control}
                  name="courseGroupId"
                  label="Marş Grubu"
                  options={courseGroups.map((group) => ({ value: group.id, label: group.name }))}
                />
                <TextField control={form.control} name="barcode" label="Barkod" description="Kasada barkod okutarak arama yapabilmek için." />
              </div>
            </PageCard>

            <PageCard className="gap-5 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold tracking-tight text-foreground">Porsiyon Bilgileri</h2>
                <Button type="button" variant="outline" size="sm" onClick={() => portions.append(blankPortion(false))}>
                  <Plus />
                  Porsiyon Ekle
                </Button>
              </div>
              {portionsError && <FieldError errors={[{ message: portionsError }]} />}
              <div className="flex flex-col gap-4">
                {portions.fields.map((field, index) => (
                  <PortionCard
                    key={field.id}
                    form={form}
                    index={index}
                    rowErrors={errors.portions?.[index]}
                    units={units}
                    stockItems={stockItems}
                    useRecipe={useRecipe}
                    trackStock={trackStock}
                    canRemove={portions.fields.length > 1}
                    onRemove={() => portions.remove(index)}
                    onMakeDefault={() => makeDefaultPortion(index)}
                  />
                ))}
              </div>
            </PageCard>

            <PageCard className="gap-4 p-6">
              <h2 className="text-base font-semibold tracking-tight text-foreground">Özellik Tanımlama</h2>
              {featureGroups.length === 0 ? (
                <p className="text-sm text-muted-foreground">Henüz özellik grubu tanımlanmamış.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {featureGroups.map((group) => (
                    // Not a <label>: Base UI's checkbox already carries its full name via aria-label, and
                    // wrapping it in a <label> as well would announce that name twice.
                    <span key={group.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        aria-label={group.name}
                        checked={featureGroupIds.includes(group.id)}
                        onCheckedChange={(checked) => toggleFeatureGroup(group.id, checked === true)}
                      />
                      {group.name}
                    </span>
                  ))}
                </div>
              )}
            </PageCard>

            {isCombo && (
              <PageCard className="gap-4 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold tracking-tight text-foreground">Menü İçeriği</h2>
                  <Button type="button" variant="outline" size="sm" onClick={() => comboItems.append(blankComboItem())}>
                    <Plus />
                    Ürün Ekle
                  </Button>
                </div>
                {comboItemsError && <FieldError errors={[{ message: comboItemsError }]} />}
                {comboCandidates.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Menüye eklenebilecek başka ürün yok.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {comboItems.fields.map((field, index) => (
                      <ComboItemRow
                        key={field.id}
                        form={form}
                        index={index}
                        products={comboCandidates}
                        rowErrors={errors.comboItems?.[index]}
                        onRemove={() => comboItems.remove(index)}
                      />
                    ))}
                  </div>
                )}
              </PageCard>
            )}
          </div>
        </div>
      </form>

      {product && (
        <ConfirmDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          title="Ürün silinsin mi?"
          description={`"${product.name}" ürünü kalıcı olarak silinecek.`}
          confirmLabel="Sil"
          destructive
          onConfirm={() => onDelete?.()}
        />
      )}
    </PageContainer>
  );
}

type PortionAmountKey = "tablePrice" | "takeawayPrice" | "deliveryPrice" | "costAmount";
type FormReturn = UseFormReturn<ProductFormInput, unknown, ProductFormValues>;

function PortionAmountField({
  form,
  index,
  field,
  label,
  ariaLabel,
  error,
}: {
  form: FormReturn;
  index: number;
  field: PortionAmountKey;
  label: string;
  ariaLabel: string;
  error?: { message?: string };
}) {
  return (
    <div className="grid gap-2">
      <span className="text-[13px] font-semibold text-foreground/90">{label}</span>
      <Input
        {...form.register(`portions.${index}.${field}`)}
        inputMode="decimal"
        placeholder="0,00"
        aria-label={ariaLabel}
        aria-invalid={Boolean(error)}
      />
      {error?.message && <FieldError errors={[{ message: error.message }]} />}
    </div>
  );
}

interface PortionCardProps {
  form: FormReturn;
  index: number;
  rowErrors?: FieldErrors<ProductFormInput["portions"][number]>;
  units: readonly Unit[];
  stockItems: readonly StockItem[];
  useRecipe: boolean;
  trackStock: boolean;
  canRemove: boolean;
  onRemove: () => void;
  onMakeDefault: () => void;
}

/** One portion's own field array, so its "Reçete" rows can have their own `useFieldArray`. */
function PortionCard({ form, index, rowErrors, units, stockItems, useRecipe, trackStock, canRemove, onRemove, onMakeDefault }: PortionCardProps) {
  const hasRecipeApp = useHasApp([APP_KEYS.recipeCost]);
  const recipeLines = useFieldArray({ control: form.control, name: `portions.${index}.recipeLines` });
  const recipeLinesErrors = rowErrors?.recipeLines;

  return (
    <div className="grid gap-3 rounded-md border p-4">
      <div className="flex items-center gap-3">
        <div className="grid flex-1 gap-1">
          <Input
            {...form.register(`portions.${index}.name`)}
            aria-label={`Porsiyon adı ${index + 1}`}
            placeholder="Porsiyon adı (örn. Tam, Yarım)"
            aria-invalid={Boolean(rowErrors?.name)}
          />
          {rowErrors?.name && <FieldError errors={[rowErrors.name]} />}
        </div>
        {/* Not a <label>: see the Özellik Tanımlama checkboxes above for why. */}
        <span className="flex items-center gap-2 text-xs whitespace-nowrap text-muted-foreground">
          <Controller
            control={form.control}
            name={`portions.${index}.isDefault`}
            render={({ field: control }) => (
              <Checkbox
                aria-label={`Varsayılan porsiyon ${index + 1}`}
                checked={Boolean(control.value)}
                onCheckedChange={(checked) => checked && onMakeDefault()}
              />
            )}
          />
          Varsayılan
        </span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Porsiyon ${index + 1} sil`}
            className="text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <PortionAmountField form={form} index={index} field="tablePrice" label="Masa Siparişi" ariaLabel={`Masa siparişi fiyatı ${index + 1}`} error={rowErrors?.tablePrice} />
        <PortionAmountField
          form={form}
          index={index}
          field="takeawayPrice"
          label="Gel Al Sipariş"
          ariaLabel={`Gel al sipariş fiyatı ${index + 1}`}
          error={rowErrors?.takeawayPrice}
        />
        <PortionAmountField
          form={form}
          index={index}
          field="deliveryPrice"
          label="Paket Sipariş"
          ariaLabel={`Paket sipariş fiyatı ${index + 1}`}
          error={rowErrors?.deliveryPrice}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SelectField control={form.control} name={`portions.${index}.unitId`} label="Birim" options={units.map((unit) => ({ value: unit.id, label: unit.name }))} />
        {hasRecipeApp && (
          <PortionAmountField form={form} index={index} field="costAmount" label="Maliyet Tutarı" ariaLabel={`Maliyet tutarı ${index + 1}`} error={rowErrors?.costAmount} />
        )}
      </div>

      {useRecipe && hasRecipeApp && (
        <div className="grid gap-2 rounded-md border border-dashed p-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-foreground/90">Reçete</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => recipeLines.append({ id: crypto.randomUUID(), stockItemId: "", quantity: "" })}
            >
              <Plus />
              Malzeme Ekle
            </Button>
          </div>
          {stockItems.length === 0 ? (
            <p className="text-xs text-muted-foreground">Önce Stok Listesi ekranından bir stok kartı ekleyin.</p>
          ) : (
            recipeLines.fields.map((line, lineIndex) => {
              const lineError = recipeLinesErrors?.[lineIndex];
              return (
                <div key={line.id} className="grid grid-cols-[1fr_6rem_2rem] items-start gap-2">
                  <SelectField
                    control={form.control}
                    name={`portions.${index}.recipeLines.${lineIndex}.stockItemId`}
                    label={`Malzeme ${lineIndex + 1}`}
                    options={stockItems.map((item) => ({ value: item.id, label: `${item.name} (${item.unitName})` }))}
                  />
                  <div className="grid gap-1">
                    <span className="text-[13px] font-semibold text-foreground/90">Miktar</span>
                    <Input
                      {...form.register(`portions.${index}.recipeLines.${lineIndex}.quantity`)}
                      inputMode="decimal"
                      placeholder="0"
                      aria-label={`Malzeme ${lineIndex + 1} miktarı`}
                      aria-invalid={Boolean(lineError?.quantity)}
                    />
                    {lineError?.quantity?.message && <FieldError errors={[{ message: lineError.quantity.message }]} />}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Malzeme ${lineIndex + 1} sil`}
                    className="mt-5 text-destructive hover:text-destructive"
                    onClick={() => recipeLines.remove(lineIndex)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              );
            })
          )}
        </div>
      )}

      {trackStock && !useRecipe && (
        <div className="grid gap-1">
          <span className="text-[13px] font-semibold text-foreground/90">Stok Kartı</span>
          <Select
            items={stockItems.map((item) => ({ value: item.id, label: item.name }))}
            value={recipeLines.fields[0]?.stockItemId || null}
            onValueChange={(value) => recipeLines.replace(value ? [{ id: crypto.randomUUID(), stockItemId: String(value), quantity: "1" }] : [])}
          >
            <SelectTrigger className="w-full" aria-label={`Stok kartı ${index + 1}`}>
              <SelectValue placeholder="Seçiniz" />
            </SelectTrigger>
            <SelectContent>
              {stockItems.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

interface ComboItemRowProps {
  form: FormReturn;
  index: number;
  products: readonly Product[];
  rowErrors?: FieldErrors<ProductFormInput["comboItems"][number]>;
  onRemove: () => void;
}

/** One combo line's own product→portion dependency, so changing the product clears its stale portion choice. */
function ComboItemRow({ form, index, products, rowErrors, onRemove }: ComboItemRowProps) {
  const productId = useWatch({ control: form.control, name: `comboItems.${index}.productId` });
  const selectedProduct = products.find((product) => product.id === productId);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Picking a new product's default portion for them beats leaving the field blank — most products
    // have exactly one, so this is usually the only choice anyway.
    const defaultPortion = selectedProduct?.portions.find((portion) => portion.isDefault) ?? selectedProduct?.portions[0];
    form.setValue(`comboItems.${index}.portionId`, defaultPortion?.id ?? "");
    // selectedProduct is derived from productId/products on every render; keying off productId alone
    // avoids re-running this when only the products list identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, form, index]);

  return (
    <div className="grid grid-cols-[1fr_1fr_5rem_2rem] items-start gap-2">
      <SelectField control={form.control} name={`comboItems.${index}.productId`} label={`Ürün ${index + 1}`} options={products.map((product) => ({ value: product.id, label: product.name }))} />
      <SelectField
        control={form.control}
        name={`comboItems.${index}.portionId`}
        label={`Porsiyon ${index + 1}`}
        disabled={!selectedProduct}
        options={(selectedProduct?.portions ?? []).map((portion) => ({ value: portion.id, label: portion.name }))}
      />
      <div className="grid gap-1">
        <span className="text-[13px] font-semibold text-foreground/90">Adet</span>
        <Input
          {...form.register(`comboItems.${index}.quantity`)}
          inputMode="numeric"
          aria-label={`Ürün ${index + 1} adedi`}
          aria-invalid={Boolean(rowErrors?.quantity)}
        />
        {rowErrors?.quantity?.message && <FieldError errors={[{ message: rowErrors.quantity.message }]} />}
      </div>
      <Button type="button" variant="ghost" size="icon-sm" aria-label={`Ürün ${index + 1} sil`} className="mt-5 text-destructive hover:text-destructive" onClick={onRemove}>
        <Trash2 />
      </Button>
    </div>
  );
}
