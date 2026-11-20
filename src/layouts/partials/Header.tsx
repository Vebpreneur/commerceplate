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
import {LuMenu as FiMenu,LuX as FiX,LuChevronDown as FiChevronDown,LuArrowUpRight as FiArrowUpRight,LuArrowUpRight as FiArrowRight,LuBox as FiBox,LuCircleHelp as FiHelpCircle,LuSearch as FiSearch,LuLayoutGrid as FiGrid,LuHeartHandshake,LuHeadset,LuPawPrint} from "react-icons/lu";

import {modelName} from "@/lib/utils/modelName";
const categoryHref=(handle:string)=>"/products?c="+encodeURIComponent(handle);
const productHref=(handle:string)=>"/products/"+encodeURIComponent(handle);
const support=[{title:"Om Pawlira",href:"/about"},{title:"Vanliga frågor",href:"/#faq"},{title:"Köpguide",href:"/kopguide"},{title:"Jämför produkter",href:"/compare"},{title:"Kundservice",href:"/contact"},{title:"Leverans",href:"/shipping-policy"},{title:"Retur och ångerrätt",href:"/refund-policy"}];
function MenuImage({image,size=56}:{image?:{url:string;altText?:string}|null;size?:number}){
 const [failed,setFailed]=useState(false);
 return image?.url&&!failed?<Image src={image.url} alt="" width={size*2} height={size*2} sizes={size+"px"} className="w-full h-full object-contain" onError={()=>setFailed(true)}/>:<FiBox aria-hidden="true" size={22} strokeWidth={1.5}/>;
}
function MenuModel({product,onClick,selected=false,card=false}:{product:NavigationProduct;onClick:()=>void;selected?:boolean;card?:boolean}){
 const href=productHref(product.handle);
 if(card)return <article className="pawlira-whisker-card"><Link href={href} onClick={onClick} className="pawlira-whisker-image" aria-label={product.title}><MenuImage key={product.featuredImage?.url} image={product.featuredImage} size={240}/></Link><Link href={href} onClick={onClick} className="pawlira-whisker-name">{modelName(product.title)}</Link><div className="pawlira-whisker-ctas"><Link href={href+"#kop"} onClick={onClick} className="pawlira-whisker-buy">Handla</Link><Link href={href+"#produktinformation"} onClick={onClick} className="pawlira-whisker-learn">Läs mer</Link></div></article>;
 return <Link href={href} onClick={onClick} aria-current={selected?"page":undefined} title={product.title} className="pawlira-menu-model"><span className="pawlira-menu-thumbnail"><MenuImage key={product.featuredImage?.url} image={product.featuredImage}/></span><span className="pawlira-menu-model-name">{modelName(product.title)}</span><FiArrowUpRight size={17} strokeWidth={1.5}/></Link>;
}
export default function Header({children,categories=[],favorites=[]}:{children:any;categories?:NavigationCategory[];favorites?:NavigationProduct[]}){
 const [open,setOpen]=useState(false),[mega,setMega]=useState<string|null>(null);
 const [query,setQuery]=useState("");
 const [searchOpen,setSearchOpen]=useState(false);
 const searchTrigger=useRef<HTMLButtonElement>(null),searchPanel=useRef<HTMLDivElement>(null);
 const closeSearch=()=>{setSearchOpen(false);searchTrigger.current?.focus()};
 useEffect(()=>{if(!searchOpen)return;searchPanel.current?.querySelector<HTMLInputElement>("input")?.focus();const escape=(e:KeyboardEvent)=>{if(e.key==="Escape"){setSearchOpen(false);searchTrigger.current?.focus()}};const outside=(e:PointerEvent)=>{if(!searchPanel.current?.contains(e.target as Node)&&!searchTrigger.current?.contains(e.target as Node))setSearchOpen(false)};document.addEventListener("keydown",escape);document.addEventListener("pointerdown",outside);return()=>{document.removeEventListener("keydown",escape);document.removeEventListener("pointerdown",outside)}},[searchOpen]);
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null),megaRegion=useRef<HTMLElement>(null);
 const pathname=usePathname();
 const uniqueFavorites=Array.from(new Map((favorites.length?favorites:categories.flatMap(c=>c.products)).map(p=>[p.handle,p])).values()).slice(0,4);
 const activateMega=(key:string)=>{setSearchOpen(false);setMega(key)};
 const close=()=>setOpen(false);
 const closeAll=()=>{setOpen(false);setMega(null);setSearchOpen(false)};
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
 useEffect(()=>{if(!mega)return;const outside=(e:PointerEvent)=>{if(!megaRegion.current?.contains(e.target as Node))setMega(null)};const escape=(e:KeyboardEvent)=>{if(e.key==="Escape"){setMega(null);megaRegion.current?.querySelector<HTMLButtonElement>('button[aria-expanded="true"]')?.focus()}};const resize=()=>{if(window.innerWidth<1200)setMega(null)};document.addEventListener("pointerdown",outside);document.addEventListener("keydown",escape);window.addEventListener("resize",resize);return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape);window.removeEventListener("resize",resize)}},[mega]);
 return <header className={`header pawlira-polished-header z-30 ${config.settings.sticky_header?"sticky top-0":""}`}>
 <div className="pawlira-promo-strip"><span>Fri frakt inom Sverige</span><Link href="/products" onClick={closeAll}>Handla nu</Link></div>
 {searchOpen&&<div ref={searchPanel} id="pawlira-header-search-panel" className="pawlira-search-overlay"><Suspense><SearchBar categories={categories} autoFocus onNavigate={()=>setSearchOpen(false)}/></Suspense><button type="button" aria-label="Stäng sökning" className="pawlira-search-close" onClick={closeSearch}><FiX size={21}/></button></div>}
 <div className="container pawlira-header-inner">
  <Logo variant="black" width={116} className="pawlira-header-logo"/>
  <nav ref={megaRegion} aria-label="Huvudmeny" className="pawlira-main-links pawlira-whisker-nav" onPointerLeave={e=>{if(e.pointerType==="mouse")setMega(null)}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setMega(null)}}>
   <button type="button" className="pawlira-whisker-tab" aria-expanded={mega==="favorites"} onPointerEnter={e=>{if(e.pointerType==="mouse")activateMega("favorites")}} onClick={e=>{if(e.detail===0||!window.matchMedia("(hover:hover) and (pointer:fine)").matches){setSearchOpen(false);setMega(v=>v==="favorites"?null:"favorites")}else activateMega("favorites")}}>Produkter</button>
   {[...categories].sort((a,b)=>{const rank=(t:string)=>/kattlå|kattla|litter/i.test(t)?0:/foder|feed/i.test(t)?1:/vatten|fontän/i.test(t)?2:3;return rank(a.title)-rank(b.title)}).map(c=><button key={c.handle} type="button" className="pawlira-whisker-tab" aria-expanded={mega===c.handle} onPointerEnter={e=>{if(e.pointerType==="mouse")activateMega(c.handle)}} onClick={e=>{if(e.detail===0||!window.matchMedia("(hover:hover) and (pointer:fine)").matches){setSearchOpen(false);setMega(v=>v===c.handle?null:c.handle)}else activateMega(c.handle)}}>{/självrengörande kattlådor/i.test(c.title)?"Kattlådor":c.title}</button>)}
   <Link href="/products?sale=1" className="pawlira-whisker-deals" onPointerEnter={()=>setMega(null)} onClick={closeAll}>Kampanjer</Link><span className="pawlira-whisker-divider" aria-hidden="true">|</span>
   <button type="button" className="pawlira-whisker-tab" aria-expanded={mega==="about"} onPointerEnter={e=>{if(e.pointerType==="mouse")activateMega("about")}} onClick={e=>{if(e.detail===0||!window.matchMedia("(hover:hover) and (pointer:fine)").matches){setSearchOpen(false);setMega(v=>v==="about"?null:"about")}else activateMega("about")}}>Om oss</button>
   {mega&&<div id="pawlira-mega" className="pawlira-mega-menu pawlira-whisker-panel">
    {mega==="about"?<div className="pawlira-whisker-about">{[{title:"Om oss",Icon:LuPawPrint,items:[support[0]]},{title:"Upptäck Pawlira",Icon:LuHeartHandshake,items:[support[2],support[3]]},{title:"Kundservice",Icon:LuHeadset,items:[support[1],support[4],support[5],support[6]]}].map(group=><div key={group.title}><h3><group.Icon size={14} strokeWidth={2.2} aria-hidden="true"/>{group.title}</h3>{group.items.map(item=><Link key={item.href} href={item.href} onClick={closeAll}>{item.title}</Link>)}</div>)}</div>:<div className="pawlira-whisker-mega-inner"><div className="pawlira-whisker-products">{(mega==="favorites"?uniqueFavorites:categories.find(c=>c.handle===mega)?.products||[]).slice(0,4).map(p=><MenuModel key={p.handle} product={p} card onClick={closeAll}/>)}</div><aside className="pawlira-whisker-side"><div><h3>Handla</h3>{(mega==="favorites"?categories:categories.filter(c=>c.handle===mega)).map(c=><Link key={c.handle} href={categoryHref(c.handle)} onClick={closeAll}>{c.title}</Link>)}{mega!=="favorites"&&(categories.find(c=>c.handle===mega)?.products||[]).slice(0,4).map(p=><Link key={p.handle} href={productHref(p.handle)} onClick={closeAll}>{modelName(p.title)}</Link>)}</div><div><h3>Läs mer</h3><Link href={mega==="favorites"?"/compare":"/compare?c="+encodeURIComponent(mega)} onClick={closeAll}>Jämför modeller</Link><Link href="/kopguide" onClick={closeAll}>Köpguide</Link><Link href="/#faq" onClick={closeAll}>Vanliga frågor</Link><Link href="/contact" onClick={closeAll}>Kundservice</Link></div></aside></div>}
   </div>}
  </nav>
  <Link href="/products" className="pawlira-whisker-shop" onClick={closeAll}>Handla</Link>
  <div className="pawlira-header-actions">{config.settings.search&&<button ref={searchTrigger} type="button" className="pawlira-search-trigger" aria-label="Sök" aria-expanded={searchOpen} onClick={()=>{setMega(null);setSearchOpen(v=>!v)}}><FiSearch size={21} strokeWidth={2}/></button>}{config.settings.account&&<NavUser/>}<Suspense fallback={children[0]}>{children[1]}</Suspense><button ref={trigger} type="button" aria-label="Öppna meny" aria-haspopup="dialog" aria-expanded={open} className="pawlira-menu-toggle" onClick={()=>{setMega(null);setSearchOpen(false);setQuery("");setOpen(true)}}><FiMenu size={23} strokeWidth={1.5}/><span className="hidden xl:inline">Meny</span></button></div>
 </div>
 <dialog ref={dialog} aria-label="Meny" className="pawlira-menu-dialog" onClose={()=>{close();trigger.current?.focus()}} onClick={e=>{if(e.target===e.currentTarget)close()}}>
 <div className="pawlira-menu-shell" onClick={e=>e.stopPropagation()}>
  <div className="pawlira-menu-head"><Logo variant="black" width={180} onClick={closeAll}/><button type="button" onClick={close} aria-label="Stäng meny" autoFocus className="pawlira-menu-close"><FiX size={22} strokeWidth={1.5}/></button></div>
  <div className="pawlira-menu-content"><h2 className="pawlira-drawer-title">Meny</h2><div className="pawlira-menu-search"><FiSearch size={19} strokeWidth={1.5}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Sök kategori eller modell" aria-label="Sök i menyn"/>{query&&<button type="button" onClick={()=>setQuery("")} aria-label="Rensa menysökning"><FiX size={18} strokeWidth={1.5}/></button>}</div>
  <Link href="/products" onClick={closeAll} className="pawlira-menu-all"><FiGrid size={20} strokeWidth={1.5}/><span>Alla produkter</span><FiArrowUpRight size={20} strokeWidth={1.5}/></Link>
  <div className="pawlira-drawer-categories">{matching.map(c=><details key={c.handle+"-"+(needle?"search":"browse")} className="pawlira-menu-category" open={needle?true:undefined}><summary><span className="pawlira-menu-category-thumb"><MenuImage image={c.image?.url?c.image:c.products[0]?.featuredImage}/></span><span className="pawlira-menu-category-title">{c.title}</span><FiChevronDown size={19} strokeWidth={1.5}/></summary><div className="pawlira-menu-models">{c.products.map(p=><MenuModel key={p.handle} product={p} onClick={closeAll} selected={pathname===productHref(p.handle)}/>)}<Link href={categoryHref(c.handle)} onClick={closeAll} className="pawlira-menu-category-more">Visa hela kategorin<FiArrowRight size={17} strokeWidth={1.5}/></Link></div></details>)}</div>
  {needle&&!matching.length&&<p className="pawlira-menu-empty">Inga matchande modeller. Prova ett annat ord eller <Link href={"/products?q="+encodeURIComponent(query.trim())} onClick={closeAll}>sök i hela sortimentet</Link>.</p>}
  <Link href="/products?sale=1" onClick={closeAll} className="pawlira-mobile-deals">Kampanjer<FiArrowUpRight size={17} strokeWidth={1.5}/></Link><div className="pawlira-menu-support"><p className="pawlira-menu-label">Information</p>{support.map(item=><Link key={item.href} href={item.href} onClick={closeAll}>{item.title}<FiArrowUpRight size={17} strokeWidth={1.5}/></Link>)}</div>
  </div><div className="pawlira-menu-bottom"><Link href="/contact" onClick={closeAll}><FiHelpCircle size={20} strokeWidth={1.5}/> Behöver du hjälp?<FiArrowRight strokeWidth={1.5}/></Link></div>
 </div></dialog>
 </header>;
}
