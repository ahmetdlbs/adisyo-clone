/** Route paths mirror the original app's router (pos.adisyo.com/#/...), without the hash. */

export const APP_PREFIX = "/app";

export const appPath = (segment: string) => `${APP_PREFIX}/${segment}`;

/** Order ids are `0` when the order is not tied to a table (takeaway / delivery) and vice versa. */
export const NO_TABLE_ID = "0";

export const PATHS = {
  login: "/login",
  signup: "/signup",
  forgot: "/forgot",
  dashboard: appPath("dashboard"),
  orders: appPath("control-page"),
  order: (orderId: string | number, tableId: string | number) =>
    appPath(`order/${orderId}/${tableId}`),
} as const;
