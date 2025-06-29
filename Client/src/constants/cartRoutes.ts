export const CART_ROUTES = {
  BASE: "/cart",
  ITEM: (itemId: string, itemType: string) =>
    `/cart/${itemId}?itemType=${itemType}`,
};
