"use client";
import {DEFAULT_OPTION} from "@/lib/constants";
import {customerOptions} from "@/lib/utils/customerProduct";
import type {Cart} from "@/lib/shopify/types";
import {createUrl} from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {LuShoppingBag as BsBag,LuTruck,LuCheck} from "react-icons/lu";
import CartAccessories from "./CartAccessories";
import type {AccessoryOffer} from "@/lib/shopify/accessories";
import Price from "../Price";
import CloseCart from "./CloseCart";
import OpenCart from "./OpenCart";
import Logo from "@/components/Logo";
import {DeleteItemButton} from "./DeleteItemButton";
import {EditItemQuantityButton} from "./EditItemQuantityButton";

export default function CartModal({cart,accessories=[]}:{cart:Cart|undefined;accessories?:AccessoryOffer[]}){
 const [isOpen,setOpen]=useState(false);
 const quantity=cart?.totalQuantity||0;
 const quantityRef=useRef(quantity);
 const dialog=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLButtonElement>(null);
 const close=()=>setOpen(false);
 useEffect(()=>{if(quantity>quantityRef.current)setOpen(true);quantityRef.current=quantity;},[quantity]);
 useEffect(()=>{
  const el=dialog.current;
  if(!el)return;
  if(isOpen&&!el.open)el.showModal();
  if(!isOpen&&el.open)el.close();
  if(!isOpen)return;
  const before=document.body.style.overflow;document.body.style.overflow="hidden";
  return()=>{document.body.style.overflow=before;};
 },[isOpen]);
 return <>
  <button ref={trigger} type="button" aria-label={`Öppna varukorg, ${quantity} produkter`} aria-haspopup="dialog" aria-expanded={isOpen} onClick={()=>setOpen(true)} className="cursor-pointer p-1"><OpenCart quantity={quantity}/></button>
  <dialog ref={dialog} aria-labelledby="cart-heading" className="pawlira-cart-dialog" onClose={()=>{close();trigger.current?.focus();}} onClick={e=>{if(e.target===e.currentTarget)close();}}>
   <section className="flex flex-col h-full bg-white text-black" onClick={e=>e.stopPropagation()}>
    <div className="border-b border-border p-6 flex justify-between items-start"><div><Logo variant="black" width={132} onClick={close} className="mb-4"/><h2 id="cart-heading" className="text-2xl">Din varukorg</h2><p className="text-sm mt-1">{quantity} {quantity===1?"produkt":"produkter"}</p></div><button type="button" className="rounded-full border border-border p-3 cursor-pointer hover:border-black" onClick={close} aria-label="Stäng varukorg" autoFocus><CloseCart/></button></div>
    <div className="pawlira-cart-shipping"><div><LuTruck size={20} strokeWidth={1.5}/><span>{quantity>0?"Din beställning har fri frakt inom Sverige":"Alltid fri frakt inom Sverige"}</span><LuCheck size={18} strokeWidth={1.5}/></div>{quantity>0&&<div className="pawlira-cart-progress" role="progressbar" aria-label="Fri frakt inom Sverige" aria-valuemin={0} aria-valuemax={100} aria-valuenow={100}><span style={{width:"100%"}}/></div>}</div>
    {!cart?.lines.length ? <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8 text-center"><BsBag size={54} strokeWidth={1.5}/><h3 className="text-xl">Din varukorg är tom</h3><p>Upptäck smart teknik för livet med katt.</p><Link onClick={close} href="/products" className="btn btn-primary rounded-full w-full py-3">Utforska sortimentet</Link></div>:
    <><ul className="flex-1 min-h-0 overflow-y-auto px-6 divide-y divide-neutral-200">
     {cart.lines.map(item=>{
      const visibleOptions=customerOptions(item.merchandise.selectedOptions).filter(o=>o.value!==DEFAULT_OPTION);const params=new URLSearchParams();visibleOptions.forEach(({name,value})=>{if(value!==DEFAULT_OPTION)params.set(name.toLowerCase(),value);});
      const url=createUrl(`/products/${item.merchandise.product.handle}`,params);
      const image=item.merchandise.image||item.merchandise.product.featuredImage;
      return <li key={item.id} className="py-5 flex gap-4">
       <Link href={url} onClick={close} className="shrink-0 w-24 h-24 border border-border rounded-lg overflow-hidden">{image?.url?<Image src={image.url} alt={item.merchandise.product.title} width={96} height={96} className="w-full h-full object-contain"/>:<div className="h-full flex items-center justify-center text-xs text-neutral-600">Bild saknas</div>}</Link>
       <div className="flex-1 min-w-0"><div className="flex justify-between gap-2"><Link href={url} onClick={close} className="font-medium text-sm leading-snug hover:underline">{item.merchandise.product.title}</Link><DeleteItemButton item={item}/></div>{visibleOptions.length>0&&<p className="text-xs text-neutral-600 mt-1">{visibleOptions.map(o=>o.value).join(" / ")}</p>}
       <Price amount={item.cost.totalAmount.amount} currencyCode={item.cost.totalAmount.currencyCode} className="font-semibold mt-2"/>
       <div className="inline-flex items-center border rounded-full border-border mt-3"><EditItemQuantityButton item={item} type="minus"/><span className="text-sm px-2" aria-label="Antal">{item.quantity}</span><EditItemQuantityButton item={item} type="plus"/></div></div>
      </li>;
     })}
    {accessories.some(a=>!cart.lines.some(l=>l.merchandise.product.handle===a.handle))&&<li className="list-none"><CartAccessories items={accessories.filter(a=>!cart.lines.some(l=>l.merchandise.product.handle===a.handle))}/></li>}</ul><div className="border-t border-border p-6 space-y-4">
     <div className="flex justify-between items-center text-sm"><span>Delsumma</span><Price amount={cart.cost.subtotalAmount.amount} currencyCode={cart.cost.subtotalAmount.currencyCode}/></div>
     <div className="flex justify-between text-sm"><span>Frakt</span><span>0 kr inom Sverige</span></div>
     <div className="flex justify-between items-center text-lg font-semibold border-t border-border pt-4"><span>Beräknat totalbelopp</span><Price amount={cart.cost.totalAmount.amount} currencyCode={cart.cost.totalAmount.currencyCode}/></div>
     <p className="text-xs text-neutral-600">Slutligt belopp, leverans och eventuella skatter visas i kassan.</p>
     <a href={cart.checkoutUrl} className="btn btn-primary rounded-full w-full py-4">Till kassan</a>
     <button type="button" onClick={close} className="pawlira-text-link w-full cursor-pointer justify-center">Fortsätt handla</button>
    </div></>}
   </section>
  </dialog>
 </>;
}
