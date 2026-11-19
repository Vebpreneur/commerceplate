"use client";
import RangeSlider from "@/components/rangeSlider/RangeSlider";
import {useRouter,useSearchParams} from "next/navigation";
import type {ShopifyCollection} from "@/lib/shopify/types";
import {createUrl} from "@/lib/utils";
import {Suspense} from "react";
type Props={categories:ShopifyCollection[];vendors:{vendor:string;productCount:number}[];tags:string[];maxPriceData:{amount:string;currencyCode:string};vendorsWithCounts:{vendor:string;productCount:number}[];categoriesWithCounts:{category:string;productCount:number}[]};
export default function ProductFilters({categories,vendors,tags,maxPriceData}:Props){
 const router=useRouter(),params=useSearchParams();
 const change=(key:string,value:string,multiple=false)=>{
   const next=new URLSearchParams(params.toString());next.delete("cursor");
   const active=next.getAll(key).includes(value);
   if(multiple){if(active)next.delete(key,value);else next.append(key,value);}
   else{if(active)next.delete(key);else next.set(key,value);}
   router.push(createUrl("/products",next),{scroll:false});
 };
 const active=["c","b","t","minPrice","maxPrice"].some(k=>params.has(k));
 const reset=()=>{const next=new URLSearchParams(params.toString());["c","b","t","minPrice","maxPrice","cursor"].forEach(k=>next.delete(k));router.push(createUrl("/products",next),{scroll:false});};
 const choice=(key:string,label:string,value:string,multiple=false)=><button type="button" key={value} aria-pressed={params.getAll(key).includes(value)} onClick={()=>change(key,value,multiple)} className="pawlira-filter-choice"><span>{label}</span><span aria-hidden="true" className="pawlira-filter-check">{params.getAll(key).includes(value)?"✓":""}</span></button>;
 const availableTags=[...new Set([...tags,...params.getAll("t")])];
 return <div className="space-y-7"><div className="flex items-center justify-between gap-2"><h2 className="text-xl">Filtrera</h2>{active&&<button type="button" className="text-xs underline" onClick={reset}>Rensa filter</button>}</div>
 {categories.length>0&&<fieldset><legend className="font-semibold mb-3">Kategorier</legend><div className="space-y-1">{categories.map(c=>choice("c",c.title,c.handle))}</div></fieldset>}
 {Number(maxPriceData.amount)>0&&<fieldset className="border-t border-border pt-5"><legend className="font-semibold">Prisintervall</legend><Suspense><RangeSlider maxPriceData={maxPriceData}/></Suspense></fieldset>}
 {vendors.length>0&&<fieldset className="border-t border-border pt-5"><legend className="font-semibold">Varumärken</legend>{vendors.map(v=>choice("b",v.vendor,v.vendor,true))}</fieldset>}
 {availableTags.length>0&&<fieldset className="border-t border-border pt-5"><legend className="font-semibold">Egenskaper</legend>{availableTags.map(t=>choice("t",t,t,true))}</fieldset>}
 </div>;
}
