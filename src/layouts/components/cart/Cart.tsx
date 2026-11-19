import { cookies } from "next/headers";
import CartModal from "./CartModal";
import {compatibleAccessories} from "@/lib/shopify/accessories";
import { getCart } from "@/lib/shopify";

export default async function Cart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  let cart;

  if (cartId) {
    try { cart = await getCart(cartId); } catch { /* Keep navigation available during a temporary Shopify error. */ }
  }

  const accessories=cart?await compatibleAccessories(cart.lines.map(l=>l.merchandise.product.handle),cart.cost.subtotalAmount.currencyCode):[];
  return <CartModal cart={cart} accessories={accessories} />;
}
