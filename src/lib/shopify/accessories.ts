import {getProducts} from "@/lib/shopify";
import {customerVariants} from "@/lib/utils/customerProduct";
import type {Money} from "@/lib/shopify/types";
export type AccessoryOffer={handle:string;title:string;variantId:string;price:Money;image?:string};
// Explicitly tagged products only: pawlira-accessory + pawlira-compatible:<main product handle>.
export async function compatibleAccessories(handles:string[],currency?:string):Promise<AccessoryOffer[]>{
 if(!handles.length)return [];
 const tags=new Set(handles.map(h=>"pawlira-compatible:"+h.toLowerCase()));
 try{
  const {products}=await getProducts({query:'tag:"pawlira-accessory"'});
  return products.filter(p=>!handles.includes(p.handle)&&p.tags.some(t=>t.toLowerCase()==="pawlira-accessory")&&p.tags.some(t=>tags.has(t.toLowerCase()))).flatMap(p=>{
   const variants=customerVariants(p.variants).filter(v=>v.availableForSale&&(!currency||v.price.currencyCode===currency));
   if(variants.length!==1)return [];
   return [{handle:p.handle,title:p.title,variantId:variants[0].id,price:variants[0].price,image:p.featuredImage?.url}];
  }).slice(0,2);
 }catch{return []}
}
