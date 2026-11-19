"use client";

import Logo from "@/components/Logo";
import NavUser from "@/components/NavUser";
import SearchBar from "@/components/SearchBar";
import config from "@/config/config.json";
import type {NavigationCategory} from "@/lib/shopify/navigation";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {Suspense,useEffect,useRef,useState} from "react";
import {FiMenu,FiX,FiChevronDown,FiArrowUpRight,FiArrowRight,FiBox,FiHelpCircle} from "react-icons/fi";

function modelName(title:string){const name=title.split(/\s+[–—-]\s+/)[0].trim();return name.length>=5&&name.length<=55?name:title;}
const categoryHref=(handle:string)=>"/products?c="+encodeURIComponent(handle);
const productHref=(handle:string)=>"/products/"+encodeURIComponent(handle);
const support=[{title:"Om Pawlira",href:"/about"},{title:"Vanliga frågor",href:"/#faq"},{title:"Köpguide",href:"/#kopguide"},{title:"Kundservice",href:"/contact"},{title:"Leverans",href:"/shipping-policy"},{title:"Retur och ångerrätt",href:"/refund-policy"}];

export default function Header({children,categories=[]}:{children:any;categories?:NavigationCategory[]}){
 const [open,setOpen]=useState(false);
 const [mega,setMega]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLButtonElement>(null);
 const megaRegion=useRef<HTMLDivElement>(null);
 const pathname=usePathname();
 const close=()=>setOpen(false);
 const closeAll=()=>{setOpen(false);setMega(false)};
 useEffect(()=>{closeAll()},[pathname]);
 useEffect(()=>{
 const el=dialog.current;if(!el)return;
 if(open&&!el.open)el.showModal();
 if(!open&&el.open)el.close();
 if(!open)return;
 const previous=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=previous};
 },[open]);
 useEffect(()=>{if(!mega)return;const outside=(event:PointerEvent)=>{if(!megaRegion.current?.contains(event.target as Node))setMega(false)};const escape=(event:KeyboardEvent)=>{if(event.key==="Escape")setMega(false)};document.addEventListener("pointerdown",outside);document.addEventListener("keydown",escape);return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape)}},[mega]);
 return <header className={`header z-30 ${config.settings.sticky_header?"sticky top-0":""}`}>
  <div className="container pawlira-header-inner">
    <Logo variant="white" width={184} className="pawlira-header-logo"/>
    <nav aria-label="Huvudmeny" className="pawlira-main-links">
     <div ref={megaRegion} className="pawlira-mega-region">
      <div className="flex items-center gap-1"><Link href="/products" onClick={closeAll}>Produkter</Link><button type="button" aria-label="Visa produktkategorier" aria-expanded={mega} aria-controls="pawlira-mega" onClick={()=>setMega(!mega)} className="pawlira-mega-toggle"><FiChevronDown className={mega?"rotate-180":""}/></button></div>
      {mega&&<div id="pawlira-mega" className="pawlira-mega-menu"><div className="pawlira-mega-top"><p>Utforska vårt sortiment</p><Link href="/products" onClick={closeAll}>Alla produkter <FiArrowUpRight/></Link></div><div className="pawlira-mega-grid">{categories.map(c=><div key={c.handle}><Link href={categoryHref(c.handle)} onClick={closeAll} className="pawlira-mega-category">{c.title}<FiArrowUpRight/></Link><div className="pawlira-mega-models">{c.products.slice(0,5).map(p=><Link href={productHref(p.handle)} key={p.handle} onClick={closeAll} title={p.title}>{modelName(p.title)}</Link>)}</div>{c.products.length>5&&<Link href={categoryHref(c.handle)} onClick={closeAll} className="pawlira-mega-more">Visa alla modeller <FiArrowRight/></Link>}</div>)}</div>{!categories.length&&<Link href="/products" onClick={closeAll}>Upptäck hela sortimentet</Link>}</div>}
     </div>
     <Link href="/about" onClick={closeAll}>Om Pawlira</Link><Link href="/contact" onClick={closeAll}>Kundservice</Link>
    </nav>
    <div className="pawlira-header-search">{config.settings.search&&<Suspense><SearchBar/></Suspense>}</div>
    <div className="pawlira-header-actions"><Suspense fallback={children[0]}>{children[1]}</Suspense>{config.settings.account&&<NavUser/>}<button ref={trigger} type="button" aria-label="Öppna meny" aria-haspopup="dialog" aria-expanded={open} className="pawlira-menu-toggle" onClick={()=>{setMega(false);setOpen(true)}}><FiMenu size={23}/><span className="hidden xl:inline">Meny</span></button></div>
  </div>
  <dialog ref={dialog} aria-label="Meny" className="pawlira-menu-dialog" onClose={()=>{close();trigger.current?.focus()}} onClick={e=>{if(e.target===e.currentTarget)close()}}>
   <div className="pawlira-menu-shell" onClick={e=>e.stopPropagation()}>
    <div className="pawlira-menu-head"><Logo variant="black" width={196} onClick={closeAll}/><button type="button" onClick={close} aria-label="Stäng meny" autoFocus className="pawlira-menu-close"><FiX size={24}/></button></div>
    <div className="pawlira-menu-content"><p className="pawlira-menu-label">Handla efter kategori</p><Link href="/products" onClick={closeAll} className="pawlira-menu-all"><span>Alla produkter</span><FiArrowUpRight size={21}/></Link>
    {categories.map((c,i)=><details key={c.handle} className="pawlira-menu-category" open={i===0||undefined}><summary><span>{c.title}</span><FiChevronDown size={20}/></summary><div className="pawlira-menu-models">{c.products.map(p=><Link key={p.handle} href={productHref(p.handle)} onClick={closeAll} title={p.title} className="pawlira-menu-model">{p.featuredImage?.url?<span className="pawlira-menu-thumbnail"><Image src={p.featuredImage.url} alt="" width={52} height={52} className="object-contain w-full h-full"/></span>:<span className="pawlira-menu-thumbnail"><FiBox size={20}/></span>}<span>{modelName(p.title)}</span><FiArrowUpRight size={16}/></Link>)}<Link href={categoryHref(c.handle)} onClick={closeAll} className="pawlira-menu-category-more">Alla modeller i kategorin <FiArrowRight/></Link></div></details>)}
    <div className="pawlira-menu-support"><p className="pawlira-menu-label">Upptäck & få hjälp</p>{support.map(item=><Link key={item.href} href={item.href} onClick={closeAll}>{item.title}<FiArrowUpRight size={17}/></Link>)}</div>
    </div><div className="pawlira-menu-bottom"><Link href="/contact" onClick={closeAll}><FiHelpCircle size={20}/> Behöver du hjälp? <FiArrowRight/></Link></div>
   </div>
  </dialog>
 </header>;
}
