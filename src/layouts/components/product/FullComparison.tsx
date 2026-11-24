"use client";
import {useTransition} from "react";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {LuArrowUpRight as FiArrowUpRight,LuBox as FiBox,LuCheck as FiCheck,LuChevronDown as FiChevronDown,LuPlus as FiPlus,LuX as FiX} from "react-icons/lu";
import type {ProductField} from "@/lib/utils/productFields";
import type {Product} from "@/lib/shopify/types";
import FieldDetails from "./FieldDetails";
type ImageData={url:string;altText?:string}|null;
type Category={title:string;handle:string;image?:ImageData;products:{title:string;handle:string;featuredImage?:ImageData}[]};
type Compared=Pick<Product,"id"|"handle"|"title"|"description"|"availableForSale"|"options"|"priceRange"> & {featuredImage:ImageData;variants:{availableForSale:boolean;price:{amount:string;currencyCode:string}}[];fields:ProductField[]};
const labels:Record<string,string>={color:"Färg",colour:"Färg",färg:"Färg",size:"Storlek",storlek:"Storlek",material:"Material",style:"Utförande"};
const optionLabel=(name:string)=>labels[name.trim().toLowerCase()]||name;
function price(p:Compared){
 const available=p.variants.filter(v=>v.availableForSale),variants=available.length?available:p.variants;
 const values=variants.map(v=>v.price).sort((a,b)=>Number(a.amount)-Number(b.amount));
 const lowest=values[0]||p.priceRange.minVariantPrice;
 const varying=values.some(p=>Number(p.amount)!==Number(lowest.amount));
 return (varying?"Från ":"")+new Intl.NumberFormat("sv-SE",{style:"currency",currency:lowest.currencyCode}).format(Number(lowest.amount));
}
export default function FullComparison({categories,categoryHandle,selectedHandles,products}:{categories:Category[];categoryHandle:string;selectedHandles:string[];products:Compared[]}){
 const router=useRouter();const [pending,startTransition]=useTransition();
 const category=categories.find(c=>c.handle===categoryHandle)!;
 const slots=selectedHandles.map(handle=>({handle,data:products.find(p=>p.handle===handle),summary:category.products.find(p=>p.handle===handle)}));
 const go=(handle:string,next:string[])=>{const params=new URLSearchParams({c:handle});next.forEach(p=>params.append("product",p));startTransition(()=>router.replace("/compare?"+params.toString(),{scroll:false}))};
 const optionNames=[...new Set(products.flatMap(p=>p.options.filter(o=>o.values.some(v=>v!=="Default Title")).map(o=>optionLabel(o.name))))];
 const fieldNames=[...new Map(products.flatMap(p=>p.fields).map(f=>[f.key,f.title])).entries()];
 const extra=category.products.find(p=>!selectedHandles.includes(p.handle));
 return <section className="container pawlira-home-section">
 <div className="pawlira-section-heading"><div><h2>Välj kategori</h2></div></div>
 <div className="pawlira-guide-choice-grid">{categories.map(c=><button type="button" disabled={pending} key={c.handle} aria-pressed={c.handle===categoryHandle} onClick={()=>go(c.handle,c.products.slice(0,2).map(p=>p.handle))}><span className="pawlira-guide-choice-image">{c.image?.url?<Image src={c.image.url} alt="" fill sizes="100px" className="object-contain"/>:<FiBox size={26} strokeWidth={1.5}/>}</span><span>{c.title}</span><span className="pawlira-guide-choice-icon">{c.handle===categoryHandle?<FiCheck size={18} strokeWidth={1.5}/>:<FiArrowUpRight size={18} strokeWidth={1.5}/>}</span></button>)}</div>
 <div className="pawlira-section-heading pawlira-compare-step"><div><h2>Välj modeller</h2><p className="pawlira-section-description">Jämför {category.title.toLowerCase()} sida vid sida. Ändra modell i rullgardinsmenyn.</p></div>{extra&&selectedHandles.length<3&&<button type="button" disabled={pending} className="btn btn-outline-primary rounded-full" onClick={()=>go(categoryHandle,[...selectedHandles,extra.handle])}><FiPlus className="inline mr-2" strokeWidth={1.5}/> Lägg till modell</button>}</div>
 <div role="status" aria-live="polite" className="pawlira-comparison-status">{pending?"Hämtar produktuppgifter…":selectedHandles.length+" modeller valda"}</div>
 <div className="pawlira-comparison-scroll" aria-busy={pending}><table className="pawlira-comparison-table pawlira-full-comparison"><thead><tr><th scope="col" className="pawlira-comparison-label">Modell</th>{slots.map(({handle,data,summary},i)=><th scope="col" key={handle}><div className="pawlira-comparison-slot-head"><span>Modell {i+1}</span>{slots.length>2&&<button type="button" disabled={pending} aria-label={"Ta bort modell "+(i+1)} onClick={()=>go(categoryHandle,selectedHandles.filter(p=>p!==handle))}><FiX size={18} strokeWidth={1.5}/></button>}</div><label className="pawlira-compare-select"><select aria-label={"Välj modell "+(i+1)} value={handle} disabled={pending} onChange={e=>go(categoryHandle,selectedHandles.map((p,n)=>n===i?e.target.value:p))}>{category.products.map(p=><option key={p.handle} value={p.handle} disabled={p.handle!==handle&&selectedHandles.includes(p.handle)}>{p.title}</option>)}</select><FiChevronDown size={17} strokeWidth={1.5}/></label><Link className="pawlira-comparison-image" href={"/products/"+encodeURIComponent(handle)}>{(data?.featuredImage||summary?.featuredImage)?.url?<Image src={(data?.featuredImage||summary?.featuredImage)!.url} alt={data?.title||summary?.title||""} fill sizes="(max-width:767px) 220px,350px" className="object-contain"/>:<FiBox size={30} strokeWidth={1.5}/>}</Link><Link className="pawlira-comparison-name" href={"/products/"+encodeURIComponent(handle)}>{data?.title||summary?.title||handle}</Link></th>)}</tr></thead><tbody>
 <tr><th scope="row">Pris</th>{slots.map(s=><td key={s.handle}><strong>{s.data?price(s.data):"Ej tillgängligt"}</strong></td>)}</tr>
 <tr><th scope="row">Lagerstatus</th>{slots.map(s=><td key={s.handle}>{s.data?<span className="pawlira-comparison-stock"><span aria-hidden="true" className={s.data.availableForSale?"in-stock":""}/>{s.data.availableForSale?"Tillgänglig att beställa":"Slut i lager"}</span>:"Ej tillgängligt"}</td>)}</tr>
 {optionNames.map(name=><tr key={name}><th scope="row">{name}</th>{slots.map(s=><td key={s.handle}>{s.data?.options.find(o=>optionLabel(o.name)===name)?.values.filter(v=>v!=="Default Title").join(", ")||"Ej angivet"}</td>)}</tr>)}
 {fieldNames.map(([key,title])=><tr key={key}><th scope="row">{title}</th>{slots.map(s=><td key={s.handle}>{s.data?.fields.some(f=>f.key===key)?s.data.fields.filter(f=>f.key===key).map((f,i)=><div key={i} className="pawlira-comparison-field"><FieldDetails value={f.value}/></div>):"Ej angivet"}</td>)}</tr>)}
 <tr><th scope="row">Beskrivning</th>{slots.map(s=><td key={s.handle}><div className="pawlira-compare-description">{s.data?.description||"Ej tillgängligt"}</div></td>)}</tr>
 <tr><th scope="row">Produkt</th>{slots.map(s=><td key={s.handle}><Link href={"/products/"+encodeURIComponent(s.handle)} className="pawlira-merch-cta">Visa produkt<FiArrowUpRight size={17} strokeWidth={1.5}/></Link></td>)}</tr>
 </tbody></table></div><p className="pawlira-comparison-note">Tekniska uppgifter visas när de finns tillgängliga i produktinformationen. ”Ej angivet” betyder att uppgiften saknas, inte att funktionen saknas.</p>
 <div className="pawlira-compare-help"><div><h3>Behöver du hjälp att välja?</h3><p>Se våra köpråd och vad du bör kontrollera innan du beställer.</p></div><Link href={"/kopguide?c="+encodeURIComponent(categoryHandle)} className="btn btn-outline-primary rounded-full">Till köpguiden <FiArrowUpRight className="inline ml-2" strokeWidth={1.5}/></Link></div>
 </section>;
}
