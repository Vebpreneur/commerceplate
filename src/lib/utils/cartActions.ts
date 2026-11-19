"use server";
import {addToCart,createCart,getCart,removeFromCart,updateCart} from "@/lib/shopify";
import {refresh} from "next/cache";
import {cookies} from "next/headers";

const validVariant=(id:unknown):id is string=>typeof id==="string"&&/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(id);
export async function addSelectedItem(_state:string|null,formData:FormData):Promise<string|null>{
 const variant=formData.get("variantId");
 const quantity=Number(formData.get("quantity")||1);
 if(!validVariant(variant)||!Number.isInteger(quantity)||quantity<1||quantity>99)return "Välj en giltig variant och antal.";
 try{
   const store=await cookies();
   const existing=store.get("cartId")?.value;
   let cart=existing?await getCart(existing):undefined;
   if(!cart)cart=await createCart();
   const result=await addToCart(cart.id,[{merchandiseId:variant,quantity}]);
   store.set("cartId",result.id,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*24*30});
   refresh();
   return null;
 }catch{return "Produkten kunde inte läggas i varukorgen. Kontrollera lagerstatus och försök igen.";}
}
export async function addItem(state:string|null,selectedVariantId:string|undefined){
 const form=new FormData();if(selectedVariantId)form.set("variantId",selectedVariantId);return addSelectedItem(state,form);
}
export async function removeItem(_state:string|null,lineId:string):Promise<string|null>{
 try{
  const cartId=(await cookies()).get("cartId")?.value;
  if(!cartId)return "Varukorgen har gått ut. Ladda om sidan.";
  const cart=await getCart(cartId);
  if(!cart?.lines.some(line=>line.id===lineId))return "Produkten finns inte kvar i varukorgen.";
  await removeFromCart(cartId,[lineId]);refresh();return null;
 }catch{return "Kunde inte ta bort produkten. Försök igen.";}
}
export async function updateItemQuantity(_state:string|null,payload:{lineId:string;variantId:string;quantity:number}):Promise<string|null>{
 const {lineId,variantId,quantity}=payload;
 if(!validVariant(variantId)||!Number.isInteger(quantity)||quantity<0||quantity>99)return "Ange ett giltigt antal.";
 try{
  const cartId=(await cookies()).get("cartId")?.value;
  if(!cartId)return "Varukorgen har gått ut. Ladda om sidan.";
  const cart=await getCart(cartId);
  if(!cart?.lines.some(line=>line.id===lineId&&line.merchandise.id===variantId))return "Produkten finns inte kvar i varukorgen.";
  if(!quantity)await removeFromCart(cartId,[lineId]);else await updateCart(cartId,[{id:lineId,merchandiseId:variantId,quantity}]);
  refresh();return null;
 }catch{return "Antalet kunde inte ändras. Kontrollera lagerstatus och försök igen.";}
}
