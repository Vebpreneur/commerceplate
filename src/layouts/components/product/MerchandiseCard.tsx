"use client";
import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {FiArrowUpRight,FiBarChart2,FiChevronLeft,FiChevronRight,FiImage} from "react-icons/fi";
import type {Product} from "@/lib/shopify/types";
import CatalogPrice from "./CatalogPrice";

export default function MerchandiseCard({product,compact=false}:{product:Product;compact?:boolean}){
 const photos=Array.from(new Map([product.featuredImage,...product.images].filter(i=>i?.url).map(i=>[i.url,i])).values()).slice(0,5);
 const [index,setIndex]=useState(0);
 const [failed,setFailed]=useState<string[]>([]);
 const usable=photos.filter(p=>!failed.includes(p.url));
 const current=usable[index%Math.max(usable.length,1)];
 const next=usable[(index+1)%Math.max(usable.length,1)];
 const href="/products/"+encodeURIComponent(product.handle);
 const move=(n:number)=>{if(usable.length>1)setIndex(i=>(i+n+usable.length)%usable.length)};
 return <article className={`pawlira-merch-card ${compact?"pawlira-merch-compact":""}`}>
 <div className="pawlira-merch-media">
  <Link href={href} className="pawlira-merch-photos" aria-label={product.title}>
   {current?<Image key={current.url} src={current.url} alt={current.altText||product.title} fill sizes="(max-width: 640px) 48vw, (max-width: 1024px) 50vw, 420px" className="pawlira-merch-main object-contain" onError={()=>setFailed(f=>[...f,current.url])}/>:<div className="pawlira-merch-placeholder"><FiImage size={36}/><span>Produktbild saknas</span></div>}
   {index===0&&next&&next.url!==current?.url&&<Image src={next.url} alt="" aria-hidden="true" fill sizes="(max-width: 640px) 48vw, (max-width: 1024px) 50vw, 420px" className="pawlira-merch-alt object-contain" onError={()=>setFailed(f=>[...f,next.url])}/>}
  </Link>
  {usable.length>1&&<div className="pawlira-merch-slide-controls"><button type="button" onClick={()=>move(-1)} aria-label="Föregående produktbild"><FiChevronLeft size={18}/></button><button type="button" onClick={()=>move(1)} aria-label="Nästa produktbild"><FiChevronRight size={18}/></button></div>}
  {usable.length>1?<div className="pawlira-merch-dots" aria-label="Produktbilder">{usable.map((p,i)=><button type="button" key={p.url} onClick={()=>setIndex(i)} aria-label={`Visa produktbild ${i+1}`} aria-pressed={i===index%usable.length}/>)}</div>:<div className="pawlira-merch-dots" aria-hidden="true"/>}
 </div>
 <div className="pawlira-merch-info">
  <div className="pawlira-merch-heading">
   <h3><Link href={href} title={product.title}>{product.title}</Link></h3>
  </div>
  <div className="pawlira-merch-bottom">
   <CatalogPrice product={product}/>
   <Link href={href} className="pawlira-merch-cta" aria-label={"Visa produkt: "+product.title}><span>Visa produkt</span><FiArrowUpRight size={21} aria-hidden="true"/></Link>
   <Link href={"/compare?product="+encodeURIComponent(product.handle)} className="pawlira-card-compare-link"><FiBarChart2 size={15} aria-hidden="true"/> Jämför modell</Link>
  </div>
 </div></article>;
}
