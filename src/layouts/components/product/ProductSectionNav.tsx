"use client";
import {useEffect,useState,useRef,useMemo,type MouseEvent} from "react";
type Item={id:string;label:string};
export default function ProductSectionNav({title,hasFaq,hasRelated}:{title:string;hasFaq:boolean;hasRelated:boolean}){
 const items=useMemo<Item[]>(()=>[
  {id:"pdp-oversikt",label:"Detaljer"},
  {id:"pdp-fordelar",label:"Funktioner"},
  {id:"produktinformation",label:"Specifikationer"},
  ...(hasFaq?[{id:"kundinformation",label:"Vanliga frågor"}]:[]),
  ...(hasRelated?[{id:"relaterade",label:"Relaterat"}]:[])
 ],[hasFaq,hasRelated]);
 const [active,setActive]=useState("pdp-oversikt");
 const nav=useRef<HTMLElement>(null);
 useEffect(()=>{
  const ids=items.map(item=>item.id);
  let frame=0;
  const onScroll=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   let current="pdp-oversikt";
   for(const id of ids){const target=document.getElementById(id);if(target&&target.getBoundingClientRect().top<160)current=id;}
   setActive(current);
  })};
  onScroll();window.addEventListener("scroll",onScroll,{passive:true});
  return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",onScroll)};
 },[items]);
 function jump(e:MouseEvent<HTMLAnchorElement>,id:string){
  const target=document.getElementById(id);if(!target)return;
  e.preventDefault();
  const header=document.querySelector<HTMLElement>("header.pawlira-polished-header");
  const offset=(header?.getBoundingClientRect().height||0)+(nav.current?.getBoundingClientRect().height||0)+16;
  window.scrollTo({top:window.scrollY+target.getBoundingClientRect().top-offset,behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"});
  history.replaceState(null,"","#"+id);setActive(id);
 }
 return <nav ref={nav} aria-label="Produktnavigation" className="pawlira-product-sticky-nav pawlira-pdp-experience-nav">
  <div className="pawlira-pdp-nav-inner">
   <div className="pawlira-pdp-nav-title" title={title}><strong>{title}</strong></div>
   <div className="pawlira-pdp-nav-links">{items.map(item=><a key={item.id} href={"#"+item.id} onClick={e=>jump(e,item.id)} aria-current={active===item.id?"location":undefined}>{item.label}</a>)}</div>
   <a className="pawlira-pdp-nav-buy" href="#kop" onClick={e=>jump(e,"kop")}>Handla nu</a>
  </div>
 </nav>;
}
