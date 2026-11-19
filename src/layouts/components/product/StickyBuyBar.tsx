"use client";
import {useEffect,useState} from "react";
import Image from "next/image";
import {LuShoppingBag} from "react-icons/lu";
import type {ProductVariant} from "@/lib/shopify/types";
export default function StickyBuyBar({title,image,variant,pending,buttonId,available,message}:{title:string;image?:string;variant?:ProductVariant;pending:boolean;buttonId:string;available:boolean;message?:string|null}){
 const [visible,setVisible]=useState(false),[top,setTop]=useState(0);
 useEffect(()=>{
  const button=document.getElementById(buttonId);if(!button){setVisible(false);return}
  const header=document.querySelector<HTMLElement>(".pawlira-polished-header");let frame=0;
  const measure=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const rect=header?.getBoundingClientRect();const value=rect&&header&&["sticky","fixed"].includes(getComputedStyle(header).position)?Math.max(0,rect.bottom):0;setTop(value);setVisible(button.getBoundingClientRect().bottom<=value)})};
  const io=new IntersectionObserver(measure,{threshold:[0,1]});io.observe(button);
  const ro=new ResizeObserver(measure);if(header)ro.observe(header);ro.observe(button);
  window.addEventListener("scroll",measure,{passive:true});window.addEventListener("resize",measure);measure();
  return()=>{cancelAnimationFrame(frame);io.disconnect();ro.disconnect();window.removeEventListener("scroll",measure);window.removeEventListener("resize",measure)};
 },[buttonId,variant?.id,variant?.availableForSale,available]);
 if(!visible||!available||!variant?.availableForSale)return null;
 const price=new Intl.NumberFormat("sv-SE",{style:"currency",currency:variant.price.currencyCode}).format(Number(variant.price.amount));
 const photo=variant.image?.url||image;
 return <div className="pawlira-sticky-buy" style={{top}}><div className="container pawlira-sticky-buy-inner">{photo&&<Image src={photo} width={52} height={52} alt="" className="pawlira-sticky-buy-photo"/>}<div className="pawlira-sticky-buy-copy"><span title={title}>{title}</span><strong>{price}</strong></div><button type="submit" disabled={pending} aria-busy={pending} className="btn btn-primary"><LuShoppingBag size={19} strokeWidth={1.5}/>{pending?"Lägger till…":"Lägg i varukorg"}</button></div>{message&&<p role="status" className="container pawlira-sticky-buy-error">{message}</p>}</div>;
}
