"use client";
import {useEffect,useRef,useState} from "react";
import {LuCheck} from "react-icons/lu";
type Copy={heading?:string;description?:string;overview?:string;overviewBenefits?:string[];benefits?:string[]};
type Section={heading:string;text:string};
export default function PurchaseContent({raw,fallback,guideFields,guideLabel,compatibility,safety}:{raw?:string;fallback:string;guideFields:{key:string;value:string}[];guideLabel:string;compatibility?:string;safety?:string}){
 const [tab,setTab]=useState<"benefits"|"overview">("benefits");
 const dialog=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLButtonElement>(null);
 let copy:Copy={};try{const v=JSON.parse(raw||"{}");if(v&&typeof v==="object")copy=v}catch{}
 const benefits=Array.isArray(copy.benefits)?copy.benefits.filter(v=>typeof v==="string"&&v.trim()):[];
 const fields=Object.fromEntries(guideFields.map(f=>[f.key,f.value]));
 let sections:Section[]=[];try{const v=JSON.parse(fields.sections||"[]");if(Array.isArray(v))sections=v.filter(s=>s&&typeof s.heading==="string"&&typeof s.text==="string")}catch{}
 useEffect(()=>{const el=dialog.current;if(!el)return;const close=()=>{trigger.current?.focus()};el.addEventListener("close",close);return()=>el.removeEventListener("close",close)},[]);
 const overview=copy.overview||copy.description||fallback;
 const overviewBenefits=Array.isArray(copy.overviewBenefits)?copy.overviewBenefits.filter(v=>typeof v==="string"&&v.trim()):[];
 return <div className="pawlira-product-description text-neutral-800 mb-6">
 <div role="group" aria-label="Produktpresentation" className="flex flex-wrap gap-x-6 gap-y-2 border-b border-stone-300 mb-4" style={{fontSize:"16px",lineHeight:"1.4"}}>
 {(["benefits","overview"] as const).map(key=><button type="button" key={key} aria-pressed={tab===key} onClick={()=>setTab(key)} className={"pb-2 border-b-2 "+(tab===key?"border-black font-semibold text-black":"border-transparent")}>{key==="benefits"?"Fördelar":"Översikt"}</button>)}
 {!!fields.title&&<button type="button" ref={trigger} className="pb-2" onClick={()=>dialog.current?.showModal()}>{guideLabel}</button>}
 </div>
 <div className="grid" style={{fontSize:"16px",lineHeight:"1.5"}}>
 <div className="space-y-3 col-start-1 row-start-1" style={{visibility:tab==="benefits"?"visible":"hidden"}} aria-hidden={tab!=="benefits"}>
 {benefits.length?<ul className="space-y-3" style={{display:"grid",gap:"10px",listStyle:"none",padding:0,margin:0}}>{benefits.map((b,i)=><li key={i} style={{display:"flex",alignItems:"flex-start",gap:"12px",padding:0,margin:0}}><span aria-hidden="true" style={{display:"inline-flex",flex:"0 0 21px",height:"21px",alignItems:"center",justifyContent:"center",borderRadius:"5px",background:"#242424",color:"white",marginTop:"2px"}}><LuCheck size={15} strokeWidth={3}/></span><span>{b}</span></li>)}</ul>:<p>{copy.description||fallback}</p>}
 </div>
 <div className="space-y-3 col-start-1 row-start-1" style={{visibility:tab==="overview"?"visible":"hidden"}} aria-hidden={tab!=="overview"}>{overview.split(/\n\s*\n/).filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}{overviewBenefits.length>0&&<ul style={{display:"grid",gap:"10px",listStyle:"none",padding:0,margin:"14px 0 0"}}>{overviewBenefits.map((b,i)=><li key={i} style={{display:"flex",alignItems:"flex-start",gap:"12px"}}><span aria-hidden="true" style={{display:"inline-flex",flex:"0 0 21px",height:"21px",alignItems:"center",justifyContent:"center",borderRadius:"5px",background:"#242424",color:"white",marginTop:"2px"}}><LuCheck size={15} strokeWidth={3}/></span><span>{b}</span></li>)}</ul>}</div>
 </div>
 <dialog ref={dialog} aria-labelledby="pawlira-guide-heading" className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md bg-white text-black p-0 shadow-xl backdrop:bg-black/50" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}}>
 <div className="p-6 sm:p-8 space-y-5">
 <div className="flex items-start justify-between gap-4"><h2 id="pawlira-guide-heading" className="text-2xl font-medium">{fields.title||guideLabel}</h2><button type="button" autoFocus aria-label="Stäng guide" onClick={()=>dialog.current?.close()} className="text-2xl">×</button></div>
 <p>{fields.intro}</p>
 {sections.map((s,i)=><section key={i} className="border-t border-stone-200 pt-4"><h3 className="font-semibold mb-1">{s.heading}</h3><p>{s.text}</p></section>)}
 {(compatibility||safety)&&<section className="border-t border-stone-200 pt-4 space-y-2"><h3 className="font-semibold">För den här modellen</h3>{compatibility&&<p>{compatibility}</p>}{safety&&<p>{safety}</p>}</section>}
 </div></dialog></div>
}
