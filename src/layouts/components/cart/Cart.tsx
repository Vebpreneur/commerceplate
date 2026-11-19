import { cookies } from "next/headers";
import CartModal from "./CartModal";
import { getCart } from "@/lib/shopify";

export default async function Cart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  let cart;

  if (cartId) {
    try { cart = await getCart(cartId); } catch { /* Keep navigation available during a temporary Shopify error. */ }
  }

  return <CartModal cart={cart} />;
}
