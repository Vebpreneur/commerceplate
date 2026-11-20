"use client";
import {sorting,type SortFilterItem} from "@/lib/constants";
import {createUrl} from "@/lib/utils";
import {useRouter,useSearchParams} from "next/navigation";
import {LuLayoutGrid as FiGrid,LuList as FiList,LuChevronDown as FiChevronDown} from "react-icons/lu";
export type PathFilterItem={title:string;path:string};
export type ListItem=SortFilterItem|PathFilterItem;
export default function ProductLayouts(){
 const params=useSearchParams(),router=useRouter();
 const list=params.get("layout")==="list";
 const update=(fn:(p:URLSearchParams)=>void)=>{const next=new URLSearchParams(params.toString());["b","t","minPrice","maxPrice"].forEach(k=>next.delete(k));fn(next);router.push(createUrl("/products",next),{scroll:false})};
 return <section className="pawlira-catalog-toolbar-wrap"><div className="pawlira-catalog-toolbar">
 <div className="pawlira-view-switch"><button type="button" aria-label="Rutnätsvy" aria-pressed={!list} onClick={()=>update(p=>p.delete("layout"))}><FiGrid size={18} strokeWidth={1.5}/></button><button type="button" aria-label="Listvy" aria-pressed={list} onClick={()=>update(p=>p.set("layout","list"))}><FiList size={20} strokeWidth={1.5}/></button></div>
 <label className="pawlira-sort-control"><span className="hidden sm:inline">Sortera:</span><select aria-label="Sortera produkter" value={params.get("sort")||""} onChange={e=>update(p=>{if(e.target.value)p.set("sort",e.target.value);else p.delete("sort")})}>{sorting.map(item=><option key={item.slug||"default"} value={item.slug||""}>{item.title}</option>)}</select><FiChevronDown size={17} strokeWidth={1.5}/></label>
 </div></section>;
}
