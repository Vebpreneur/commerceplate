"use client";
import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {FiArrowRight,FiChevronLeft,FiChevronRight,FiArrowUpRight} from "react-icons/fi";
import type {Product} from "@/lib/shopify/types";
import CatalogPrice from "./CatalogPrice";
import {modelName} from "@/lib/utils/modelName";
import {customerText} from "@/lib/utils/customerProduct";
function short(text:string){const value=text.replace(/\s+/g," ").trim();if(value.length<=280)return value;const cut=value.slice(0,280);return cut.slice(0,cut.lastIndexOf(" ")>150?cut.lastIndexOf(" "):280)+"…"}
export default function Spotlight({products}:{products:Product[]}){
 const [index,setIndex]=useState(0);
 const product=products[index]||products[0];if(!product)return null;
 const photo=product.featuredImage?.url?product.featuredImage:product.images.find(i=>i.url);
 const href="/products/"+encodeURIComponent(product.handle);
 const move=(n:number)=>setIndex(i=>(i+n+products.length)%products.length);
 return <section className="container pawlira-home-section"><div className="pawlira-section-heading"><div><p className="pawlira-eyebrow">I fokus</p><h2>Upptäck en produkt närmare.</h2></div><Link className="pawlira-text-link" href="/products">Alla produkter<FiArrowUpRight size={20}/></Link></div>
 <div className="pawlira-spotlight pawlira-spotlight-interactive"><div className="pawlira-spotlight-photo" key={photo?.url}>{photo?.url&&<Image src={photo.url} alt={photo.altText||product.title} fill sizes="(max-width:767px) 92vw, 650px" className="object-contain"/>}{products.length>1&&<span className="pawlira-spotlight-counter">{index+1} / {products.length}</span>}</div>
 <div className="pawlira-spotlight-content" key={product.id}><p className="pawlira-eyebrow">Utvalt hos Pawlira</p><h3>{product.title}</h3>{product.description&&<p className="leading-relaxed">{short(customerText(product.description))}</p>}<CatalogPrice product={product}/><Link href={href} className="btn btn-primary rounded-full inline-flex gap-3 items-center justify-center">Upptäck produkten<FiArrowRight/></Link></div></div>
 {products.length>1&&<div className="pawlira-spotlight-controls"><div className="pawlira-spotlight-tabs" aria-label="Utvalda modeller">{products.map((p,i)=><button type="button" key={p.id} aria-pressed={i===index} onClick={()=>setIndex(i)}><span className="pawlira-spotlight-thumb">{p.featuredImage?.url&&<Image src={p.featuredImage.url} alt="" fill sizes="64px" className="object-contain"/>}</span><span>{modelName(p.title)}</span></button>)}</div><div className="pawlira-rail-navigation"><button type="button" aria-label="Föregående utvalda produkt" onClick={()=>move(-1)}><FiChevronLeft size={22}/></button><button type="button" aria-label="Nästa utvalda produkt" onClick={()=>move(1)}><FiChevronRight size={22}/></button></div></div>}</section>;
}
