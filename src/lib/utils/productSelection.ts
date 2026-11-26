import type {ProductVariant} from "@/lib/shopify/types";
import {customerOptions,customerVariants,isFulfillmentOption} from "./customerProduct";
export function productVariantRole(variant?:ProductVariant):string {
 const role=variant?.variantRole?.value?.trim();
 if(role)return role;
 const values=customerOptions(variant?.selectedOptions||[]).map(o=>o.value).join(" ");
 if(/ONLY 18 Rolls/i.test(values))return "bags";
 if(/8 Extra Filters Pack/i.test(values))return "filters";
 if(/video/i.test(values))return /stainless/i.test(values)?"video_stainless":"video";
 if(/wifi/i.test(values))return /stainless/i.test(values)?"wifi_stainless":"wifi";
 if(/basic style/i.test(values))return /stainless/i.test(values)?"basic_stainless":"basic";
 if(/button/i.test(values))return "button";
 if(/stainless/i.test(values))return "stainless_bowl";
 if(/plastic bowl/i.test(values))return "plastic_bowl";
 return "device";
}
export function selectedProductVariant(variants:ProductVariant[],params:{entries():IterableIterator<[string,string]>}){
 const names=new Set(variants.flatMap(v=>customerOptions(v.selectedOptions).map(o=>o.name.toLowerCase())));
 const selection=Array.from(params.entries()).filter(([key])=>!isFulfillmentOption(key)&&names.has(key));
 const matches=customerVariants(variants).filter(v=>selection.every(([key,value])=>v.selectedOptions.some(o=>o.name.toLowerCase()===key&&o.value===value)));
 // Prefer the complete device when no explicit accessory choice has been made.
 // Use the same selection for gallery, price, cart, and server-rendered content.
 const isConsumable=(v:ProductVariant)=>["bags","filters"].includes(productVariantRole(v));
 const available=matches.filter(v=>v.availableForSale);
 return available.find(v=>!isConsumable(v))||matches.find(v=>!isConsumable(v))||available[0]||matches[0];
}
