"use client";

import PurchaseAssurance from "./PurchaseAssurance";
import { ProductOption, ProductVariant } from "@/lib/shopify/types";
import { createUrl } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {selectedProductVariant} from "@/lib/utils/productSelection";
import {customerOptions,customerVariants,isFulfillmentOption} from "@/lib/utils/customerProduct";
import type { ImageItem } from "./ProductGallery";

export const generateImageMap = (images: ImageItem[]) => Object.fromEntries(images.filter(image=>image.altText).map(image=>[image.altText.toLowerCase(),image.url]));

export function VariantSelector({options, variants, images}: {options:ProductOption[]; variants:ProductVariant[]; images:ImageItem[]}) {
 const router = useRouter();
 const pathname = usePathname();
 const params = useSearchParams();
 const active=selectedProductVariant(variants,params);
 const visibleVariants=customerVariants(variants);
 const imageMap = generateImageMap(images);
 const money = (m:{amount:string;currencyCode:string})=>new Intl.NumberFormat("sv-SE",{style:"currency",currency:m.currencyCode}).format(Number(m.amount));
 const labels:Record<string,string> = {color:"Färg",colour:"Färg",size:"Storlek",material:"Material",style:"Utförande"};
 return <div>
   {active && <div aria-live="polite" className="mb-6"><div className="flex flex-wrap items-baseline gap-3"><span className="text-3xl font-semibold">{money(active.price)}</span></div><p className="mt-2 text-sm flex items-center gap-2"><span aria-hidden="true" className={`rounded-full w-2 h-2 ${active.availableForSale?"bg-black":"bg-neutral-400"}`}/>{active.availableForSale?"Tillgänglig att beställa":"Slut i lager"}</p><PurchaseAssurance/></div>}
   {customerOptions(options).filter(o=>o.values.length>1).map(option=>{
     const key=option.name.toLowerCase();
     const value=active?.selectedOptions.find(o=>o.name.toLowerCase()===key)?.value;
     return <fieldset key={option.id} className="mb-5"><legend className="font-semibold mb-3">{labels[key]||option.name}{value && <span className="font-normal text-neutral-600"> – {value}</span>}</legend><div className="flex flex-wrap gap-2">
       {option.values.map(item=>{
         const candidates=visibleVariants.filter(v=>v.selectedOptions.some(o=>o.name.toLowerCase()===key&&o.value===item));
         const preferred=candidates.find(v=>v.availableForSale&&v.selectedOptions.every(o=>o.name.toLowerCase()===key||active?.selectedOptions.some(a=>a.name===o.name&&a.value===o.value)))||candidates.find(v=>v.availableForSale);
         const isActive=value===item;
         const thumb=["color","colour","färg"].includes(key)?preferred?.image?.url||candidates.find(v=>v.image?.url)?.image?.url||imageMap[item.toLowerCase()]:undefined;
         return <button key={item} type="button" aria-pressed={isActive} disabled={!preferred} className={`pawlira-option ${isActive?"is-selected":""}`} onClick={()=>{if(!preferred)return;const next=new URLSearchParams(params.toString());for(const name of Array.from(next.keys()))if(isFulfillmentOption(name))next.delete(name);customerOptions(preferred.selectedOptions).forEach(o=>next.set(o.name.toLowerCase(),o.value));router.replace(createUrl(pathname,next),{scroll:false});}}>{thumb&&<Image src={thumb} alt="" width={42} height={42} className="rounded object-contain aspect-square"/>}{item}{!preferred&&<span className="sr-only"> – slut i lager</span>}</button>
       })}
     </div></fieldset>
   })}
 </div>;
}
