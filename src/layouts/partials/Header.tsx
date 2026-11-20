"use client";
import Logo from "@/components/Logo";
import NavUser from "@/components/NavUser";
import SearchBar from "@/components/SearchBar";
import config from "@/config/config.json";
import type {NavigationCategory,NavigationProduct} from "@/lib/shopify/navigation";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {Suspense,useEffect,useRef,useState} from "react";
import {LuMenu as FiMenu,LuX as FiX,LuChevronDown as FiChevronDown,LuArrowUpRight as FiArrowUpRight,LuArrowUpRight as FiArrowRight,LuBox as FiBox,LuCircleHelp as FiHelpCircle,LuSearch as FiSearch,LuLayoutGrid as FiGrid} from "react-icons/lu";

import {modelName} from "@/lib/utils/modelName";
const categoryHref=(handle:string)=>"/products?c="+encodeURIComponent(handle);
const productHref=(handle:string)=>"/products/"+encodeURIComponent(handle);
const support=[{title:"Om Pawlira",href:"/about"},{title:"Vanliga frågor",href:"/#faq"},{title:"Köpguide",href:"/#kopguide"},{title:"Jämför produkter",href:"/compare"},{title:"Kundservice",href:"/contact"},{title:"Leverans",href:"/shipping-policy"},{title:"Retur och ångerrätt",href:"/refund-policy"}];
function MenuImage({image,size=56}:{image?:{url:string;altText?:string}|null;size?:number}){
 const [failed,setFailed]=useState(false);
 return image?.url&&!failed?<Image src={image.url} alt="" width={size*2} height={size*2} sizes={size+"px"} className="w-full h-full object-contain" onError={()=>setFailed(true)}/>:<FiBox aria-hidden="true" size={22} strokeWidth={1.5}/>;
}
function MegaPrice({product}:{product:NavigationProduct}){const range=product.priceRange;if(!range)return null;const {minVariantPrice:min,maxVariantPrice:max}=range;const amount=Number(min.amount);if(!Number.isFinite(amount))return null;return <span className="pawlira-mega-product-price">{Number(max.amount)>amount?"Från ":""}{new Intl.NumberFormat("sv-SE",{style:"currency",currency:min.currencyCode}).format(amount)}</span>}
function MenuModel({product,onClick,selected=false,card=false}:{product:NavigationProduct;onClick:()=>void;selected?:boolean;card?:boolean}){
 return <Link href={productHref(product.handle)} onClick={onClick} aria-current={selected?"page":undefined} title={product.title} className={card?"pawlira-mega-product":"pawlira-menu-model"}>
 <span className={card?"pawlira-mega-product-image":"pawlira-menu-thumbnail"}><MenuImage key={product.featuredImage?.url} image={product.featuredImage} size={card?240:56}/></span>
 {card?<span className="pawlira-mega-product-info"><span className="pawlira-mega-product-name"><span>{modelName(product.title)}</span></span><MegaPrice product={product}/></span>:<span className="pawlira-menu-model-name">{modelName(product.title)}</span>}<FiArrowUpRight size={17} strokeWidth={1.5}/></Link>;
}
export default function Header({children,categories=[],favorites=[]}:{children:any;categories?:NavigationCategory[];favorites?:NavigationProduct[]}){
 const [open,setOpen]=useState(false),[mega,setMega]=useState(false);
 const [query,setQuery]=useState("");
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null),megaTrigger=useRef<HTMLButtonElement>(null),megaRegion=useRef<HTMLDivElement>(null);
 const pathname=usePathname();
 const close=()=>setOpen(false);
 const closeAll=()=>{setOpen(false);setMega(false)};
 const needle=query.trim().toLocaleLowerCase("sv-SE");
 const matching=categories.map(c=>({...c,products:!needle||c.title.toLocaleLowerCase("sv-SE").includes(needle)?c.products:c.products.filter(p=>p.title.toLocaleLowerCase("sv-SE").includes(needle))})).filter(c=>c.products.length);
 useEffect(()=>{closeAll()},[pathname]);
 useEffect(()=>{
 const el=dialog.current;if(!el)return;
 if(open&&!el.open)el.showModal();
 if(!open&&el.open)el.close();
 if(!open)return;
 const previous=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=previous};
 },[open]);
 useEffect(()=>{if(!mega)return;const outside=(e:PointerEvent)=>{if(!megaRegion.current?.contains(e.target as Node))setMega(false)};const escape=(e:KeyboardEvent)=>{if(e.key==="Escape"){setMega(false);megaTrigger.current?.focus()}};const resize=()=>{if(window.innerWidth<1200)setMega(false)};document.addEventListener("pointerdown",outside);document.addEventListener("keydown",escape);window.addEventListener("resize",resize);return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape);window.removeEventListener("resize",resize)}},[mega]);
 return <header className={`header pawlira-polished-header z-30 ${config.settings.sticky_header?"sticky top-0":""}`}>
 <div className="container pawlira-header-inner">
  <Logo variant="white" width={170} className="pawlira-header-logo"/>
  <nav aria-label="Huvudmeny" className="pawlira-main-links">
   <div ref={megaRegion} className="pawlira-mega-region" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setMega(false)}}>
    <button ref={megaTrigger} type="button" aria-expanded={mega} aria-controls={mega?"pawlira-mega":undefined} className="pawlira-main-menu-button" onClick={()=>setMega(!mega)}>Produkter<FiChevronDown size={17} className={mega?"rotate-180":""} strokeWidth={1.5}/></button>
    {mega&&<div id="pawlira-mega" className="pawlira-mega-menu">
     <div className="pawlira-mega-top"><div><h2>Produkter</h2></div><Link href="/products" onClick={closeAll} className="pawlira-mega-all">Alla produkter<FiArrowUpRight size={19} strokeWidth={1.5}/></Link></div>
     <div className="pawlira-favorites-mega-layout"><div className="pawlira-favorites-mega-main"><h3>Favoriter</h3>{favorites.length>0?<div className="pawlira-favorites-mega-products">{favorites.map(p=><MenuModel key={p.handle} product={p} card onClick={closeAll} selected={pathname===productHref(p.handle)}/>)}</div>:<div className="pawlira-favorites-empty"><h3>Upptäck sortimentet</h3><p>Hitta smarta produkter för kattens dagliga rutiner.</p><Link href="/products" className="pawlira-text-link" onClick={closeAll}>Alla produkter<FiArrowUpRight size={17} strokeWidth={1.5}/></Link></div>}</div><div className="pawlira-favorites-mega-links"><div><h3>Handla</h3>{categories.map(c=><Link key={c.handle} href={categoryHref(c.handle)} onClick={closeAll}>{c.title}<FiArrowUpRight size={15} strokeWidth={1.5}/></Link>)}<Link href="/products" onClick={closeAll}>Alla produkter<FiArrowUpRight size={15} strokeWidth={1.5}/></Link></div><div><h3>Upptäck Pawlira</h3>{[{title:"Jämför modeller",href:"/compare"},{title:"Köpguide",href:"/#kopguide"},{title:"Vanliga frågor",href:"/#faq"},{title:"Om Pawlira",href:"/about"},{title:"Kundservice",href:"/contact"}].map(item=><Link key={item.href} href={item.href} onClick={closeAll}>{item.title}<FiArrowUpRight size={15} strokeWidth={1.5}/></Link>)}</div></div></div>
    </div>}
   </div>
   <Link href="/about" onClick={closeAll} aria-current={pathname==="/about"?"page":undefined}>Om Pawlira</Link><Link href="/contact" onClick={closeAll} aria-current={pathname==="/contact"?"page":undefined}>Kundservice</Link>
  </nav>
  <div className="pawlira-header-search">{config.settings.search&&<Suspense><SearchBar categories={categories}/></Suspense>}</div>
  <div className="pawlira-header-actions"><Suspense fallback={children[0]}>{children[1]}</Suspense>{config.settings.account&&<NavUser/>}<button ref={trigger} type="button" aria-label="Öppna meny" aria-haspopup="dialog" aria-expanded={open} className="pawlira-menu-toggle" onClick={()=>{setMega(false);setQuery("");setOpen(true)}}><FiMenu size={23} strokeWidth={1.5}/><span className="hidden xl:inline">Meny</span></button></div>
 </div>
 <dialog ref={dialog} aria-label="Meny" className="pawlira-menu-dialog" onClose={()=>{close();trigger.current?.focus()}} onClick={e=>{if(e.target===e.currentTarget)close()}}>
 <div className="pawlira-menu-shell" onClick={e=>e.stopPropagation()}>
  <div className="pawlira-menu-head"><Logo variant="black" width={180} onClick={closeAll}/><button type="button" onClick={close} aria-label="Stäng meny" autoFocus className="pawlira-menu-close"><FiX size={22} strokeWidth={1.5}/></button></div>
  <div className="pawlira-menu-content"><h2 className="pawlira-drawer-title">Meny</h2><div className="pawlira-menu-search"><FiSearch size={19} strokeWidth={1.5}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Sök kategori eller modell" aria-label="Sök i menyn"/>{query&&<button type="button" onClick={()=>setQuery("")} aria-label="Rensa menysökning"><FiX size={18} strokeWidth={1.5}/></button>}</div>
  <Link href="/products" onClick={closeAll} className="pawlira-menu-all"><FiGrid size={20} strokeWidth={1.5}/><span>Alla produkter</span><FiArrowUpRight size={20} strokeWidth={1.5}/></Link>
  <div className="pawlira-drawer-categories">{matching.map(c=><details key={c.handle+"-"+(needle?"search":"browse")} className="pawlira-menu-category" open={needle?true:undefined}><summary><span className="pawlira-menu-category-thumb"><MenuImage image={c.image?.url?c.image:c.products[0]?.featuredImage}/></span><span className="pawlira-menu-category-title">{c.title}</span><FiChevronDown size={19} strokeWidth={1.5}/></summary><div className="pawlira-menu-models">{c.products.map(p=><MenuModel key={p.handle} product={p} onClick={closeAll} selected={pathname===productHref(p.handle)}/>)}<Link href={categoryHref(c.handle)} onClick={closeAll} className="pawlira-menu-category-more">Visa hela kategorin<FiArrowRight size={17} strokeWidth={1.5}/></Link></div></details>)}</div>
  {needle&&!matching.length&&<p className="pawlira-menu-empty">Inga matchande modeller. Prova ett annat ord eller <Link href={"/products?q="+encodeURIComponent(query.trim())} onClick={closeAll}>sök i hela sortimentet</Link>.</p>}
  <div className="pawlira-menu-support"><p className="pawlira-menu-label">Information</p>{support.map(item=><Link key={item.href} href={item.href} onClick={closeAll}>{item.title}<FiArrowUpRight size={17} strokeWidth={1.5}/></Link>)}</div>
  </div><div className="pawlira-menu-bottom"><Link href="/contact" onClick={closeAll}><FiHelpCircle size={20} strokeWidth={1.5}/> Behöver du hjälp?<FiArrowRight strokeWidth={1.5}/></Link></div>
 </div></dialog>
 </header>;
}
