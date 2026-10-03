import type { OrderStage, OrderStatus, OrderType, PaymentMethod, Order, OrderLine, Payment } from "../model/order";
import type { Area, Category, ComboItem, Portion, Product, TableDefinition, TableShape } from "../model/pos-state";
import type {
  ApiArea,
  ApiCategory,
  ApiComboItem,
  ApiOrder,
  ApiOrderLine,
  ApiOrderPayment,
  ApiPortion,
  ApiProduct,
  ApiTable,
} from "./wire-types";

export const lower = <T extends string>(value: string): T => value.toLowerCase() as T;
export const upper = (value: string): string => value.toUpperCase();

export const toArea = (area: ApiArea): Area => ({ id: area.id, name: area.name });

export const toTable = (table: ApiTable): TableDefinition => ({
  id: table.id,
  name: table.name,
  areaId: table.areaId,
  shape: lower<TableShape>(table.shape),
});

export const toCategory = (category: ApiCategory): Category => ({ id: category.id, name: category.name });

const toPortion = (portion: ApiPortion): Portion => ({
  id: portion.id,
  name: portion.name,
  isDefault: portion.isDefault,
  tablePrice: portion.tablePrice,
  takeawayPrice: portion.takeawayPrice,
  deliveryPrice: portion.deliveryPrice,
  ...(portion.unitId ? { unitId: portion.unitId } : {}),
  ...(portion.costAmount != null ? { costAmount: portion.costAmount } : {}),
  recipeLines: portion.recipeLines,
});

const toComboItem = (item: ApiComboItem): ComboItem => ({
  productId: item.itemProductId ?? "",
  portionId: item.itemPortionId ?? "",
  name: item.name,
  quantity: item.quantity,
});

export const toProduct = (product: ApiProduct): Product => ({
  id: product.id,
  name: product.name,
  categoryId: product.categoryId,
  ...(product.color ? { color: product.color } : {}),
  ...(product.barcode ? { barcode: product.barcode } : {}),
  ...(product.productCode ? { productCode: product.productCode } : {}),
  isFavorite: product.isFavorite,
  showOnSalesScreen: product.showOnSalesScreen,
  showOnKitchenScreen: product.showOnKitchenScreen,
  vatExcluded: product.vatExcluded,
  autoAskFeaturePortion: product.autoAskFeaturePortion,
  useRecipe: product.useRecipe,
  trackStock: product.trackStock,
  isCombo: product.isCombo,
  ...(product.vatDefinitionId ? { vatDefinitionId: product.vatDefinitionId } : {}),
  ...(product.kitchenGroupId ? { kitchenGroupId: product.kitchenGroupId } : {}),
  ...(product.courseGroupId ? { courseGroupId: product.courseGroupId } : {}),
  portions: product.portions.map(toPortion),
  featureGroupIds: product.featureGroups.map((group) => group.id),
  comboItems: product.comboItems.map(toComboItem),
});

const toOrderLine = (line: ApiOrderLine): OrderLine => ({
  id: line.id,
  productId: line.productId ?? "",
  portionId: line.portionId ?? "",
  name: line.name,
  unitPrice: line.unitPrice,
  quantity: line.quantity,
  isComplimentary: line.isComplimentary,
});

const toPayment = (payment: ApiOrderPayment): Payment => ({
  id: payment.id,
  method: lower<PaymentMethod>(payment.method),
  amount: payment.amount,
  paidAt: payment.paidAt,
  lineIds: payment.lineIds,
});

export const toOrder = (order: ApiOrder): Order => ({
  id: order.id,
  number: order.number,
  type: lower<OrderType>(order.type),
  tableId: order.tableId,
  ...(order.customerName ? { customerName: order.customerName } : {}),
  waiter: order.waiter,
  openedAt: order.openedAt,
  stage: lower<OrderStage>(order.stage),
  status: lower<OrderStatus>(order.status),
  closedAt: order.closedAt,
  lines: order.lines.map(toOrderLine),
  discountPercent: order.discountPercent,
  payments: order.payments.map(toPayment),
  charges: order.charges ?? [],
});
