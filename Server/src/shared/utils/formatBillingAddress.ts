export function formatBillingAddress(address: any): string {
  return typeof address === "string"
    ? address
    : `${address.line1}, ${address.line2 ? address.line2 + ", " : ""}${
        address.city
      }, ${address.state}, ${address.country}, ${
        address.postalCode || address.pincode
      }`;
}
