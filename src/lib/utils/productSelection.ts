import type {ProductVariant} from "@/lib/shopify/types";
export function selectedProductVariant(variants:ProductVariant[],params:{entries():IterableIterator<[string,string]>}){
 const names=new Set(variants.flatMap(v=>v.selectedOptions.map(o=>o.name.toLowerCase())));
 const selection=Array.from(params.entries()).filter(([key])=>names.has(key));
 const matches=variants.filter(v=>selection.every(([key,value])=>v.selectedOptions.some(o=>o.name.toLowerCase()===key&&o.value===value)));
 return matches.find(v=>v.availableForSale)||matches[0];
}
