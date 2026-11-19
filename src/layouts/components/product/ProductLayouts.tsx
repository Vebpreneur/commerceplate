"use client";
import {sorting,type SortFilterItem} from "@/lib/constants";
import {createUrl} from "@/lib/utils";
import ProductFilters from "@/partials/ProductFilters";
import {useRouter,useSearchParams} from "next/navigation";
import {useEffect,useRef,useState,Suspense} from "react";
import {FiGrid,FiList,FiSliders,FiX,FiChevronDown} from "react-icons/fi";
export type PathFilterItem={title:string;path:string};
export type ListItem=SortFilterItem|PathFilterItem;

export default function ProductLayouts(props:Parameters<typeof ProductFilters>[0]){
 const params=useSearchParams(),router=useRouter(),dialog=useRef<HTMLDialogElement>(null);
 const [open,setOpen]=useState(false);
 const list=params.get("layout")==="list";
 const keys=["c","b","t","minPrice","maxPrice"];
 const chips=keys.flatMap(k=>params.getAll(k).map(v=>({k,v,label:k==="c"?props.categories.find(c=>c.handle===v)?.title||v:k==="minPrice"?"Från "+v+" kr":k==="maxPrice"?"Till "+v+" kr":v})));
 const update=(fn:(p:URLSearchParams)=>void)=>{const next=new URLSearchParams(params.toString());fn(next);router.push(createUrl("/products",next),{scroll:false})};
 useEffect(()=>{const el=dialog.current;if(!el)return;if(open&&!el.open)el.showModal();if(!open&&el.open)el.close();if(!open)return;const prev=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=prev}},[open]);
 return <section className="container pawlira-catalog-toolbar-wrap"><div className="pawlira-catalog-toolbar">
 <div className="flex items-center gap-2"><button className="pawlira-mobile-filter" type="button" onClick={()=>setOpen(true)}><FiSliders size={18}/> Filtrera{chips.length>0&&<span>{chips.length}</span>}</button><div className="pawlira-view-switch"><button type="button" aria-label="Rutnätsvy" aria-pressed={!list} onClick={()=>update(p=>p.delete("layout"))}><FiGrid size={18}/></button><button type="button" aria-label="Listvy" aria-pressed={list} onClick={()=>update(p=>p.set("layout","list"))}><FiList size={20}/></button></div></div>
 <label className="pawlira-sort-control"><span className="hidden sm:inline">Sortera:</span><select aria-label="Sortera produkter" value={params.get("sort")||""} onChange={e=>update(p=>{if(e.target.value)p.set("sort",e.target.value);else p.delete("sort")})}>{sorting.map(item=><option key={item.slug||"default"} value={item.slug||""}>{item.title}</option>)}</select><FiChevronDown size={17}/></label>
 </div>
 {chips.length>0&&<div className="pawlira-active-filters">{chips.map(({k,v,label})=><button key={k+v} type="button" onClick={()=>update(p=>p.delete(k,v))}>{label}<FiX size={14}/></button>)}<button className="pawlira-clear-filters" type="button" onClick={()=>update(p=>keys.forEach(k=>p.delete(k)))}>Rensa alla</button></div>}
 <dialog ref={dialog} aria-label="Produktfilter" className="pawlira-filter-dialog" onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)setOpen(false)}}><div className="pawlira-filter-dialog-inner"><div className="pawlira-filter-dialog-head"><h2>Filtrera produkter</h2><button type="button" aria-label="Stäng filter" onClick={()=>setOpen(false)}><FiX size={23}/></button></div><div className="pawlira-filter-dialog-body"><Suspense><ProductFilters {...props}/></Suspense></div><div className="pawlira-filter-dialog-bottom"><button type="button" onClick={()=>setOpen(false)} className="btn btn-primary rounded-full w-full">Visa produkter</button></div></div></dialog>
 </section>;
}
