"use client";
import {sorting,type SortFilterItem} from "@/lib/constants";
import {createUrl} from "@/lib/utils";
import {useRouter,useSearchParams} from "next/navigation";
import {useEffect,useRef,useState} from "react";
import {LuChevronDown} from "react-icons/lu";
export type PathFilterItem={title:string;path:string};
export type ListItem=SortFilterItem|PathFilterItem;
export default function ProductLayouts(){
 const params=useSearchParams(),router=useRouter();
 const [open,setOpen]=useState(false);
 const root=useRef<HTMLDivElement>(null);
 const currentSlug=params.get("sort")||"";
 const currentItem=sorting.find(item=>(item.slug||"")===currentSlug)||sorting[0];
 useEffect(()=>{
  if(!open)return;
  const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false)};
  const escape=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};
  document.addEventListener("pointerdown",outside);
  document.addEventListener("keydown",escape);
  return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape)};
 },[open]);
 const selectSort=(slug:string|null)=>{
  const next=new URLSearchParams(params.toString());
  ["b","t","minPrice","maxPrice","layout"].forEach(k=>next.delete(k));
  if(slug)next.set("sort",slug);else next.delete("sort");
  setOpen(false);
  router.push(createUrl("/products",next),{scroll:false});
 };
 return <div ref={root} className="pawlira-whisker-sort">
  <button type="button" className="pawlira-whisker-sort-trigger" aria-haspopup="listbox" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>
   <span>Sortera</span>
   <LuChevronDown size={18} strokeWidth={1.75} className={open?"rotate-180":""}/>
  </button>
  {open&&<div role="listbox" aria-label="Sortera produkter" className="pawlira-whisker-sort-menu">
   {sorting.map(item=>{
    const active=(item.slug||"")===currentSlug||(item===currentItem&&!currentSlug);
    return <button key={item.slug||"default"} type="button" role="option" aria-selected={active} className={"pawlira-whisker-sort-option "+(active?"is-active":"")} onClick={()=>selectSort(item.slug)}>
     {item.title}
    </button>;
   })}
  </div>}
 </div>;
}
