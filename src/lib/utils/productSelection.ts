import type {ProductVariant} from "@/lib/shopify/types";
import {customerOptions,customerVariants,isFulfillmentOption} from "./customerProduct";
export function selectedProductVariant(variants:ProductVariant[],params:{entries():IterableIterator<[string,string]>}){
 const names=new Set(variants.flatMap(v=>customerOptions(v.selectedOptions).map(o=>o.name.toLowerCase())));
 const selection=Array.from(params.entries()).filter(([key])=>!isFulfillmentOption(key)&&names.has(key));
 const matches=customerVariants(variants).filter(v=>selection.every(([key,value])=>v.selectedOptions.some(o=>o.name.toLowerCase()===key&&o.value===value)));
 return matches.find(v=>v.availableForSale)||matches[0];
}
