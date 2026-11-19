"use client";
import {useEffect,useState,useRef} from "react";
import Image from "next/image";
import Link from "next/link";
import {LuChevronLeft,LuChevronRight,LuImage} from "react-icons/lu";
import type {Product} from "@/lib/shopify/types";
export default function CardMedia({product,href,list=false}:{product:Product;href:string;list?:boolean}){
 const photos=Array.from(new Map([product.featuredImage,...product.images].filter(i=>i?.url).map(i=>[i.url.split("?")[0],i])).values()).slice(0,5);
 const [index,setIndex]=useState(0),[failed,setFailed]=useState<string[]>([]),[hover,setHover]=useState(false),[manual,setManual]=useState(false);
 const mediaRef=useRef<HTMLDivElement>(null);
 const usable=photos.filter(p=>!failed.includes(p.url)),count=usable.length;
 const current=usable[index%Math.max(count,1)];
 const next=usable[(index+1)%Math.max(count,1)];
 const fail=(url:string)=>setFailed(old=>old.includes(url)?old:[...old,url]);
 useEffect(()=>{
  if(!hover||manual||count<2)return;
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const tick=()=>{if(!document.hidden&&!media.matches)setIndex(i=>(i+1)%count)};
  const timer=window.setInterval(tick,1600);
  return()=>window.clearInterval(timer);
 },[hover,manual,count]);
 const step=(n:number)=>{setManual(true);if(count>1)setIndex(i=>(i+n+count)%count)};
 useEffect(()=>{
  const card=mediaRef.current?.closest("article");if(!card)return;
  const enter=(event:Event)=>{const e=event as PointerEvent;if(e.pointerType!=="mouse"||!window.matchMedia("(hover:hover) and (pointer:fine)").matches||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;setHover(true);setManual(false);if(count>1)setIndex(i=>(i+1)%count)};
  const leave=()=>{setHover(false);setManual(false);setIndex(0)};
  card.addEventListener("pointerenter",enter);card.addEventListener("pointerleave",leave);
  return()=>{card.removeEventListener("pointerenter",enter);card.removeEventListener("pointerleave",leave)};
 },[count]);
 return <div ref={mediaRef} className={"pawlira-card-media "+(list?"is-list":"")}>
  <Link href={href} className="pawlira-card-photo" aria-label={product.title}>
   {current?<><Image key={current.url} src={current.url} alt={current.altText||product.title} fill sizes={list?"(max-width:767px) 36vw, 300px":"(max-width:767px) 46vw, (max-width:1199px) 34vw, 360px"} className="pawlira-card-image" onError={()=>fail(current.url)}/>{count>1&&next&&next.url!==current.url&&<Image key={"preload-"+next.url} src={next.url} alt="" aria-hidden="true" fill sizes="(max-width:767px) 46vw, 360px" className="pawlira-card-preload" onError={()=>fail(next.url)}/>}</>:<span className="pawlira-card-missing"><LuImage size={30} strokeWidth={1.5}/><span>Produktbild saknas</span></span>}
  </Link>
  {!product.availableForSale&&<span className="pawlira-card-soldout">Slut i lager</span>}
  {count>1&&<div className="pawlira-card-image-controls" role="group" aria-label="Produktbilder"><button type="button" aria-label="Föregående produktbild" onClick={()=>step(-1)}><LuChevronLeft size={18} strokeWidth={1.5}/></button><span aria-hidden="true">{index%count+1}/{count}</span><button type="button" aria-label="Nästa produktbild" onClick={()=>step(1)}><LuChevronRight size={18} strokeWidth={1.5}/></button></div>}
 </div>;
}
