"use client";
import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {FiArrowUpRight,FiChevronDown,FiImage} from "react-icons/fi";
import type {Product} from "@/lib/shopify/types";
import CatalogPrice from "./CatalogPrice";
type Group={title:string;handle:string;products:Product[]};
const labels:Record<string,string>={color:"Färg",colour:"Färg",färg:"Färg",size:"Storlek",storlek:"Storlek",material:"Material",style:"Utförande"};
const key=(s:string)=>s.trim().toLocaleLowerCase("sv-SE");
const normalized=(s:string)=>labels[key(s)]||s;
export default function CompareModels({groups}:{groups:Group[]}){
 const [handle,setHandle]=useState(groups[0]?.handle||"");
 const group=groups.find(g=>g.handle===handle)||groups[0];
 const [selection,setSelection]=useState<string[]>([]);
 if(!group)return null;
 const count=Math.min(3,group.products.length);
 const defaults=group.products.slice(0,count).map(p=>p.id);
 const ids=selection.length===count&&selection.every(id=>group.products.some(p=>p.id===id))?selection:defaults;
 const chosen=ids.map(id=>group.products.find(p=>p.id===id)!);
 const optionNames=[...new Set(chosen.flatMap(p=>p.options.filter(o=>o.values.length>1||!o.values.includes("Default Title")).map(o=>normalized(o.name))))];
 const change=(position:number,id:string)=>setSelection(ids.map((old,i)=>i===position?id:old));
 return <section id="jamfor" className="container pawlira-home-section scroll-mt-36">
 <div className="pawlira-section-heading"><div><p className="pawlira-eyebrow">Hitta rätt modell</p><h2>Jämför dina favoriter.</h2><p className="pawlira-section-description">Välj modeller inom samma kategori och jämför pris, tillgänglighet och produktalternativ.</p></div><Link href={"/products?c="+encodeURIComponent(group.handle)} className="pawlira-text-link">Visa kategorin <FiArrowUpRight size={20}/></Link></div>
 <div className="pawlira-compare-selector"><span>Välj kategori</span><div className="pawlira-compare-category-buttons">{groups.map(g=><button type="button" key={g.handle} aria-pressed={g.handle===group.handle} onClick={()=>{setHandle(g.handle);setSelection([])}}>{g.title}</button>)}</div></div>
 <div className="pawlira-comparison-scroll"><table className="pawlira-comparison-table"><thead><tr><th scope="col" className="pawlira-comparison-label">Modell</th>{chosen.map((p,i)=><th key={i} scope="col"><label className="pawlira-compare-select"><span>Modell {i+1}</span><select aria-label={"Välj modell "+(i+1)} value={p.id} onChange={e=>change(i,e.target.value)}>{group.products.map(item=><option key={item.id} value={item.id} disabled={ids.includes(item.id)&&item.id!==p.id}>{item.title}</option>)}</select><FiChevronDown size={17}/></label><Link href={"/products/"+encodeURIComponent(p.handle)} className="pawlira-comparison-image">{p.featuredImage?.url?<Image src={p.featuredImage.url} alt={p.title} fill sizes="(max-width: 767px) 220px, 350px" className="object-contain"/>:<FiImage size={30}/>}</Link><Link href={"/products/"+encodeURIComponent(p.handle)} className="pawlira-comparison-name">{p.title}</Link></th>)}</tr></thead><tbody>
 <tr><th scope="row">Pris</th>{chosen.map(p=><td key={p.id}><CatalogPrice product={p}/></td>)}</tr>
 {optionNames.map(name=><tr key={name}><th scope="row">{name}</th>{chosen.map(p=><td key={p.id}>{p.options.find(o=>normalized(o.name)===name)?.values.filter(v=>v!=="Default Title").join(", ")||"Ej angivet"}</td>)}</tr>)}
 <tr><th scope="row">Produktbeskrivning</th>{chosen.map(p=><td key={p.id}><p className="pawlira-compare-description">{p.description?.trim()||"Se produktinformationen."}</p></td>)}</tr>
 <tr><th scope="row">Mer information</th>{chosen.map(p=><td key={p.id}><Link href={"/products/"+encodeURIComponent(p.handle)} className="pawlira-merch-cta">Se modellen<FiArrowUpRight size={18}/></Link></td>)}</tr>
 </tbody></table></div><p className="pawlira-comparison-note">Priser och alternativ hämtas från aktuellt sortiment. Fullständiga specifikationer finns på respektive produktsida.</p><div className="flex justify-center mt-6"><Link href={"/compare?c="+encodeURIComponent(group.handle)+chosen.map(p=>"&product="+encodeURIComponent(p.handle)).join("")} className="btn btn-primary rounded-full">Öppna fullständig jämförelse <FiArrowUpRight className="inline ml-2"/></Link></div>
 </section>;
}
