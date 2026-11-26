"use client";
import {useEffect,useRef,useState} from "react";
import {LuCheck,LuCat,LuRuler,LuUsers,LuHeart,LuSettings,LuClock,LuUtensils,LuDroplets,LuFilter,LuSparkles,LuShieldCheck,LuPackage,LuX} from "react-icons/lu";
import Image from "next/image";
type Copy={heading?:string;description?:string;overview?:string;overviewBenefits?:string[];benefits?:string[]};
type Section={heading:string;text:string};
export default function PurchaseContent({raw,fallback,guideFields,guideLabel,compatibility,safety,guideImage,guideImageAlt}:{raw?:string;fallback:string;guideFields:{key:string;value:string}[];guideLabel:string;compatibility?:string;safety?:string;guideImage?:string;guideImageAlt?:string}){
 const [tab,setTab]=useState<"benefits"|"overview">("benefits");
 const dialog=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLButtonElement>(null);
 let copy:Copy={};try{const v=JSON.parse(raw||"{}");if(v&&typeof v==="object")copy=v}catch{}
 const benefits=Array.isArray(copy.benefits)?copy.benefits.filter(v=>typeof v==="string"&&v.trim()):[];
 const fields=Object.fromEntries(guideFields.map(f=>[f.key,f.value]));
 let sections:Section[]=[];try{const v=JSON.parse(fields.sections||"[]");if(Array.isArray(v))sections=v.filter(s=>s&&typeof s.heading==="string"&&typeof s.text==="string")}catch{}
 useEffect(()=>{const el=dialog.current;if(!el)return;const close=()=>{trigger.current?.focus()};el.addEventListener("close",close);return()=>el.removeEventListener("close",close)},[]);
 const iconFor=(heading:string)=>{const h=heading.toLowerCase();return /kattung|försiktig|introduktion/.test(h)?LuCat:/storlek|rörlighet|passform/.test(h)?LuRuler:/flera|två katt/.test(h)?LuUsers:/äldre|vanor/.test(h)?LuHeart:/styrning/.test(h)?LuSettings:/rutin|första|testa/.test(h)?LuClock:/foder|portion/.test(h)?LuUtensils:/filter/.test(h)?LuFilter:/vatten|drick|placering/.test(h)?LuDroplets:/skötsel|rengör/.test(h)?LuSparkles:/förpackning/.test(h)?LuPackage:LuShieldCheck;};
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
 <dialog ref={dialog} aria-labelledby="pawlira-guide-heading" className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-[460px] bg-white text-black p-0 shadow-xl backdrop:bg-black/50 overflow-y-auto" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}}>
 <div className="relative">
 {guideImage&&<div className="relative w-full aspect-[16/10] bg-[#f7f5ef]"><Image src={guideImage} alt={guideImageAlt||""} fill sizes="460px" className="object-contain"/></div>}
 <button type="button" autoFocus aria-label="Stäng guide" onClick={()=>dialog.current?.close()} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-black/80 text-white"><LuX size={23}/></button>
 <div className="px-7 sm:px-9 pt-8 pb-12" style={{fontSize:"15px",lineHeight:"1.55"}}>
 <h2 id="pawlira-guide-heading" style={{fontSize:"28px",fontWeight:600,lineHeight:1.15,letterSpacing:"-0.035em",margin:"0 0 18px"}}>{fields.title||guideLabel}</h2>
 <p style={{margin:"0 0 28px"}}>{fields.intro}</p>
 <div className="flex flex-col" style={{gap:"28px"}}>
 {sections.map((s,i)=>{const Icon=iconFor(s.heading);return <section key={i} style={{display:"grid",gridTemplateColumns:"44px minmax(0,1fr)",gap:"14px",alignItems:"start"}}><div aria-hidden="true" className="flex items-center justify-center rounded-xl bg-[#f7f5ef]" style={{height:44,width:44}}><Icon size={23} strokeWidth={2}/></div><div><h3 style={{fontSize:"17px",fontWeight:600,lineHeight:1.3,margin:"0 0 4px"}}>{s.heading}</h3><p style={{margin:0}}>{s.text}</p></div></section>})}
 </div>
 {(compatibility||safety)&&<section className="border-t border-stone-200 mt-8 pt-6" style={{display:"grid",gridTemplateColumns:"44px minmax(0,1fr)",gap:"14px"}}><div aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f7f5ef]"><LuShieldCheck size={23}/></div><div><h3 style={{fontSize:"17px",fontWeight:600,margin:"0 0 6px"}}>För den här modellen</h3>{compatibility&&<p style={{margin:"0 0 10px"}}>{compatibility}</p>}{safety&&<p style={{margin:0}}>{safety}</p>}</div></section>}
 </div>
 </div></dialog></div>
}
