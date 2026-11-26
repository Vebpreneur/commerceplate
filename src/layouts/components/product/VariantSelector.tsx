"use client";


import { ProductOption, ProductVariant } from "@/lib/shopify/types";
import { createUrl } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {selectedProductVariant} from "@/lib/utils/productSelection";
import {customerOptions,customerVariants,isFulfillmentOption} from "@/lib/utils/customerProduct";
import type { ImageItem } from "./ProductGallery";

export const generateImageMap = (images: ImageItem[]) => Object.fromEntries(images.filter(image=>image.altText).map(image=>[image.altText.toLowerCase(),image.url]));

export function VariantSelector({options, variants, images, mode="all"}: {options:ProductOption[]; variants:ProductVariant[]; images:ImageItem[];mode?:"all"|"price"|"options"}) {
 const router = useRouter();
 const pathname = usePathname();
 const params = useSearchParams();
 const active=selectedProductVariant(variants,params);
 const visibleVariants=customerVariants(variants);
 const imageMap = generateImageMap(images);
 const money = (m:{amount:string;currencyCode:string})=>new Intl.NumberFormat("sv-SE",{style:"currency",currency:m.currencyCode}).format(Number(m.amount));
 const labels:Record<string,string> = {color:"Välj färg",colour:"Välj färg",färg:"Välj färg",size:"Välj storlek",material:"Välj material",style:"Välj modell",model:"Välj modell",volume:"Välj volym"};
 const translations:Record<string,string>={vit:"Vit",vitt:"Vit",grå:"Grå",svart:"Svart",rosa:"Rosa",ljusgrå:"Ljusgrå",mörkgrå:"Mörkgrå",white:"Vit",black:"Svart",gray:"Grå",grey:"Grå",pink:"Rosa",blue:"Blå",green:"Grön","light gray":"Ljusgrå","light grey":"Ljusgrå","dark gray":"Mörkgrå","grey white":"Grå/vit","white brown":"Vit/brun","dark-grey white":"Mörkgrå/vit","only 18 rolls":"18 rullar avfallspåsar","cat litter box set":"Kattlådeset","8 extra filters pack":"8 reservfilter","basic style":"Basic","wifi version":"Wi-Fi","video version":"Kamera","with plastic bowl":"Plastskål","with stainless bowl":"Rostfri skål","stainless steel bowl":"Rostfri skål","4lstainlesssteelbowl":"4 L med rostfri skål","2l wifi white":"Wi-Fi – vit","2l wifi black":"Wi-Fi – svart","2l button white":"Knappstyrning – vit","2l button black":"Knappstyrning – svart"};
 const display=(v:string)=>translations[v.toLowerCase().trim()]||(v===v.toUpperCase()?v.charAt(0).toUpperCase()+v.slice(1).toLowerCase():v);
 const colorValues=/^(white|black|gray|grey|pink|blue|green|vit|vitt|svart|grå|rosa|ljusgrå|mörkgrå|light gr[ae]y|dark gr[ae]y|grey white|white brown|dark-grey white)$/i;
 return <div>
   {mode!=="options"&&active&&<div aria-live="polite" className="mb-5"><div className="flex items-center gap-4 sm:gap-5"><span className="text-[26px] font-semibold tracking-tight whitespace-nowrap">{money(active.price)}</span>{active.availableForSale&&<><span aria-hidden="true" className="h-16 w-px shrink-0 bg-neutral-300"/><div className="rounded-2xl bg-[#f0eeee] px-4 py-3 text-black" style={{fontSize:"14px",lineHeight:1.35}}><span className="block font-semibold">Betala med <span className="rounded bg-[#ffb3c7] px-1.5 py-0.5 font-bold">Klarna</span></span><span className="block mt-1">Betala senare eller dela upp*</span><span className="block text-xs mt-1 text-neutral-600">*Tillgängliga alternativ visas i kassan.</span></div></>}</div>{!active.availableForSale&&<p className="mt-2 text-sm font-medium text-neutral-700">Slut i lager</p>}</div>}
   {mode!=="price"&&customerOptions(options).filter(o=>o.values.length>1).map(option=>{
     const key=option.name.toLowerCase();
     const labelKey=key.trim().replace(/[:：]+$/,"").trim();
     const value=active?.selectedOptions.find(o=>o.name.toLowerCase()===key)?.value;
     const colorOnly=["color","colour","färg"].includes(labelKey)&&option.values.every(v=>colorValues.test(v.trim()));
     const imageFor=(item:string)=>visibleVariants.find(v=>v.selectedOptions.some(o=>o.name.toLowerCase()===key&&o.value===item)&&v.image?.url)?.image?.url||imageMap[item.toLowerCase()]||images.find(i=>i.altText?.toLowerCase().startsWith(display(item).toLowerCase()+" "))?.url;
     const accessory=(v:string)=>/only 18 rolls|extra filters pack|reservfilter|avfallspåsar/i.test(v);
     const materialChoice=option.values.some(v=>/bowl|skål/i.test(v))&&option.values.every(v=>/bowl|skål|^4L$/i.test(v));
     const heading=colorOnly?"Välj färg":materialChoice?"Välj skål":option.values.some(accessory)?"Välj modell eller tillbehör":["color","colour","färg"].includes(labelKey)?"Välj modell":labels[labelKey]||option.name;
     const optionImage=(item:string)=>accessory(item)?undefined:imageFor(item);
     return <fieldset key={option.id} className="mb-5 min-w-0"><legend className="mb-3 text-base"><strong>{heading}</strong>{value&&<span className="font-normal text-neutral-800"> {display(value)}</span>}</legend><div className="grid grid-cols-2 gap-3">
       {option.values.map(item=>{
         const candidates=visibleVariants.filter(v=>v.selectedOptions.some(o=>o.name.toLowerCase()===key&&o.value===item));
         const preferred=candidates.find(v=>v.availableForSale&&customerOptions(v.selectedOptions).every(o=>o.name.toLowerCase()===key||active?.selectedOptions.some(a=>a.name===o.name&&a.value===o.value)))||candidates.find(v=>v.availableForSale);
         const isActive=value===item;
         const imagesOnly=!!optionImage(item)&&colorValues.test(item.trim());
         return <button key={item} type="button" aria-pressed={isActive} disabled={!preferred} aria-label={display(item)} title={display(item)} className={imagesOnly?"relative flex items-center justify-center h-[106px] sm:h-[120px] rounded-xl border-2 overflow-hidden bg-white "+(isActive?"border-black":"border-neutral-300 hover:border-neutral-500")+" disabled:opacity-40":"relative flex flex-col items-center justify-center gap-2 min-h-[106px] rounded-xl border-2 bg-white p-3 text-center "+(isActive?"border-black font-semibold":"border-neutral-300 hover:border-neutral-500")+" disabled:opacity-40"} onClick={()=>{if(!preferred)return;const next=new URLSearchParams(params.toString());for(const name of Array.from(next.keys()))if(isFulfillmentOption(name))next.delete(name);customerOptions(preferred.selectedOptions).forEach(o=>next.set(o.name.toLowerCase(),o.value));router.replace(createUrl(pathname,next),{scroll:false});}}>{imagesOnly?<Image src={optionImage(item)!} alt="" fill sizes="(max-width: 640px) 45vw, 220px" className="object-contain p-1"/>:<>{optionImage(item)&&<Image src={optionImage(item)!} alt="" width={88} height={88} className="rounded object-contain aspect-square"/>}{(accessory(item)||!optionImage(item)||!colorValues.test(item.trim()))&&<span className="text-sm">{materialChoice&&item==="4L"?"Standard":materialChoice&&/stainless/i.test(item)?"Rostfri skål":display(item)}</span>}</>}{!preferred&&<span className="sr-only"> – slut i lager</span>}</button>
       })}
     </div></fieldset>
   })}
 </div>;
}
