"use client";
import {useEffect,useRef,useState} from "react";
import {FiChevronLeft,FiChevronRight} from "react-icons/fi";
import type {Product} from "@/lib/shopify/types";
import MerchandiseCard from "./MerchandiseCard";
export default function ProductRail({products,label}:{products:Product[];label:string}){
 const rail=useRef<HTMLDivElement>(null);
 const [position,setPosition]=useState({start:true,end:true});
 useEffect(()=>{const el=rail.current;if(!el)return;const update=()=>setPosition({start:el.scrollLeft<=3,end:el.scrollLeft+el.clientWidth>=el.scrollWidth-3});update();const ro=new ResizeObserver(update);ro.observe(el);el.addEventListener("scroll",update,{passive:true});return()=>{ro.disconnect();el.removeEventListener("scroll",update)}},[products.length]);
 const move=(direction:number)=>{const el=rail.current;if(!el)return;const card=el.firstElementChild as HTMLElement|null;const gap=parseFloat(getComputedStyle(el).columnGap)||18;el.scrollBy({left:direction*((card?.offsetWidth||el.clientWidth)+gap),behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})};
 return <div className="pawlira-rail-shell"><div ref={rail} className="pawlira-product-rail" aria-label={label}>{products.map(p=><MerchandiseCard key={p.id} product={p} compact/>)}</div>{(!position.start||!position.end)&&<div className="pawlira-rail-navigation"><button type="button" aria-label="Föregående produkter" disabled={position.start} onClick={()=>move(-1)}><FiChevronLeft size={23}/></button><button type="button" aria-label="Fler produkter" disabled={position.end} onClick={()=>move(1)}><FiChevronRight size={23}/></button></div>}</div>;
}
