"use client";
import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {LuArrowUpRight as FiArrowRight,LuChevronLeft as FiChevronLeft,LuChevronRight as FiChevronRight,LuArrowUpRight as FiArrowUpRight} from "react-icons/lu";
import type {Product} from "@/lib/shopify/types";
import CatalogPrice from "./CatalogPrice";
import {modelName} from "@/lib/utils/modelName";
import {customerText} from "@/lib/utils/customerProduct";
import {customerTitle} from "@/lib/utils/customerTitle";
export default function Spotlight({products,showHeadingLink=true}:{products:Product[];showHeadingLink?:boolean}){
 const [index,setIndex]=useState(0);
 const product=products[index]||products[0];if(!product)return null;
 const photo=product.featuredImage?.url?product.featuredImage:product.images.find(i=>i.url);
 const href="/products/"+encodeURIComponent(product.handle);
 const summary=customerText(product.description||"").replace(/\s+/g," ").trim();
 const move=(n:number)=>setIndex(i=>(i+n+products.length)%products.length);
 return <section className="container pawlira-home-section"><div className="pawlira-section-heading"><div><h2>Utvalda modeller</h2></div>{showHeadingLink&&<Link className="pawlira-text-link" href="/products">Alla produkter<FiArrowUpRight size={20} strokeWidth={1.5}/></Link>}</div>
 <div className="pawlira-spotlight pawlira-spotlight-interactive"><div className="pawlira-spotlight-photo" key={photo?.url}>{photo?.url&&<Image src={photo.url} alt={photo.altText||product.title} fill sizes="(max-width:767px) 92vw, 650px" className="object-contain"/>}{products.length>1&&<span className="pawlira-spotlight-counter">{index+1} / {products.length}</span>}</div>
 <div className="pawlira-spotlight-content" key={product.id}><p className="pawlira-eyebrow">Utvald modell</p><h3>{customerTitle(product.title)}</h3>{summary&&<p className="pawlira-spotlight-summary">{summary.slice(0,180)}{summary.length>180?"…":""}</p>}<CatalogPrice product={product}/><div className="flex flex-wrap items-center gap-4 pt-1"><Link href={href} className="btn btn-primary rounded-full inline-flex gap-3 items-center justify-center">Visa produkt<FiArrowRight strokeWidth={1.5}/></Link><Link href={href+"#produktinformation"} className="pawlira-text-link">Läs mer<FiArrowUpRight size={17} strokeWidth={1.5}/></Link></div></div></div>
 {products.length>1&&<div className="pawlira-spotlight-controls"><div className="pawlira-spotlight-tabs" aria-label="Utvalda modeller">{products.map((p,i)=><button type="button" key={p.id} aria-pressed={i===index} onClick={()=>setIndex(i)}><span className="pawlira-spotlight-thumb">{p.featuredImage?.url&&<Image src={p.featuredImage.url} alt="" fill sizes="64px" className="object-contain"/>}</span><span>{modelName(p.title)}</span></button>)}</div><div className="pawlira-rail-navigation"><button type="button" aria-label="Föregående utvalda produkt" onClick={()=>move(-1)}><FiChevronLeft size={22} strokeWidth={1.5}/></button><button type="button" aria-label="Nästa utvalda produkt" onClick={()=>move(1)}><FiChevronRight size={22} strokeWidth={1.5}/></button></div></div>}</section>;
}
