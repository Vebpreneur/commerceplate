"use client";
import {createUrl} from "@/lib/utils";
import {useRouter,useSearchParams} from "next/navigation";
import {useState,useEffect} from "react";
export default function RangeSlider({maxPriceData}:{maxPriceData:{amount:string;currencyCode:string}}){
 const router=useRouter(),params=useSearchParams();
 const limit=Math.max(1,Math.ceil(Number(maxPriceData.amount)||1));
 const minParam=params.get("minPrice")||"0",maxParam=params.get("maxPrice")||String(limit);
 const [min,setMin]=useState(minParam),[max,setMax]=useState(maxParam);
 useEffect(()=>{const id=window.setTimeout(()=>{setMin(minParam);setMax(maxParam)},0);return()=>window.clearTimeout(id)},[minParam,maxParam]);
 const low=Number(min),high=Number(max);
 const valid=min!==""&&max!==""&&Number.isFinite(low)&&Number.isFinite(high)&&low>=0&&low<=high;
 return <form className="pt-3 space-y-3" onSubmit={e=>{e.preventDefault();if(!valid)return;const next=new URLSearchParams(params.toString());next.delete("cursor");if(low===0)next.delete("minPrice");else next.set("minPrice",String(low));if(high>=limit)next.delete("maxPrice");else next.set("maxPrice",String(high));router.push(createUrl("/products",next),{scroll:false});}}>
 <div className="grid grid-cols-2 gap-2"><label className="text-xs">Från ({maxPriceData.currencyCode})<input type="number" inputMode="numeric" min="0" value={min} onChange={e=>setMin(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-white p-2" required/></label><label className="text-xs">Till ({maxPriceData.currencyCode})<input type="number" inputMode="numeric" min="0" value={max} onChange={e=>setMax(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-white p-2" required/></label></div>
 {!valid&&<p className="text-xs" role="status">Ange ett giltigt prisintervall.</p>}
 <button type="submit" className="btn btn-outline-primary w-full text-sm rounded-full" disabled={!valid}>Tillämpa pris</button></form>;
}
