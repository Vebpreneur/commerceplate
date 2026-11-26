import type {ProductVariant} from "@/lib/shopify/types";
import {customerOptions,customerVariants,isFulfillmentOption} from "./customerProduct";
export function selectedProductVariant(variants:ProductVariant[],params:{entries():IterableIterator<[string,string]>}){
 const names=new Set(variants.flatMap(v=>customerOptions(v.selectedOptions).map(o=>o.name.toLowerCase())));
 const selection=Array.from(params.entries()).filter(([key])=>!isFulfillmentOption(key)&&names.has(key));
 const matches=customerVariants(variants).filter(v=>selection.every(([key,value])=>v.selectedOptions.some(o=>o.name.toLowerCase()===key&&o.value===value)));
 // Prefer the complete device when no explicit accessory choice has been made.
 // Use the same selection for gallery, price, cart, and server-rendered content.
 const isConsumable=(v:ProductVariant)=>customerOptions(v.selectedOptions).some(o=>/^(?:ONLY 18 Rolls|8 Extra Filters Pack)$/i.test(o.value.trim()));
 const available=matches.filter(v=>v.availableForSale);
 return available.find(v=>!isConsumable(v))||available[0]||matches.find(v=>!isConsumable(v))||matches[0];
}
