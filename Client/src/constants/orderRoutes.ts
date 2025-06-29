export const ORDER_ROUTES = {
  GET_PAYMENT_KEY: "/getKey",
  CREATE_ORDER: "/create-order",
  RETRY_PAYMENT: "/retry-payment",
  FETCH_ORDERS: "/orders",
  UPDATE_ORDER_STATUS: "/update-order-status",
  CONFIRM_PAYMENT: "/confirm-payment",
  CANCEL_PAYMENT: "/cancel-payment",
  VERIFY_PAYMENT: "/verify-payment",
  REQUEST_REFUND: (orderId: string) => `/${orderId}/refund`,
  VALIDATE_COUPON: "/orders/validate-coupon",
  PROCESS_REFUND: "/process-refund",
};
