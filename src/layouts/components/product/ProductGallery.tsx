"use client";
import Image from "next/image";
import {useSearchParams} from "next/navigation";
import {useEffect,useRef,useState} from "react";
import {LuChevronLeft as FiChevronLeft,LuChevronRight as FiChevronRight,LuMaximize2 as FiMaximize2,LuMinimize2 as FiMinimize2,LuImage as FiImage,LuX as FiX} from "react-icons/lu";
import type {ProductVariant} from "@/lib/shopify/types";
import {selectedProductVariant} from "@/lib/utils/productSelection";

export interface ImageItem {url:string;altText:string;width:number;height:number}
type Props={images:ImageItem[];variants?:ProductVariant[];title?:string};
const imageKey=(url:string)=>url.split("?")[0];
function GalleryView({images,title}:{images:ImageItem[];title:string}){
 const [index,setIndex]=useState(0),[failed,setFailed]=useState<string[]>([]),[expanded,setExpanded]=useState(false),[zoom,setZoom]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),thumbs=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const touch=useRef<{x:number;y:number}|null>(null);
 const list=images.filter(p=>!failed.includes(p.url)),i=Math.min(index,Math.max(0,list.length-1)),current=list[i];
 useEffect(()=>{if(!current&&expanded){setExpanded(false);setZoom(false)}},[current,expanded]);
 const move=(step:number)=>{if(list.length<2)return;setIndex((i+step+list.length)%list.length);setZoom(false)};
 useEffect(()=>{const el=dialog.current;if(!el)return;if(expanded&&!el.open)el.showModal();if(!expanded&&el.open)el.close();if(!expanded)return;const prev=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=prev}},[expanded]);
 useEffect(()=>{const el=thumbs.current?.children[i] as HTMLElement|undefined;if(!el||!thumbs.current)return;const holder=thumbs.current;const left=el.offsetLeft-holder.offsetLeft;if(left<holder.scrollLeft||left+el.offsetWidth>holder.scrollLeft+holder.clientWidth){holder.scrollTo({left:Math.max(0,left-12),behavior:"auto"})}},[i]);
 const keys=(e:React.KeyboardEvent)=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();move(e.key==="ArrowLeft"?-1:1)}};
 const close=()=>{setExpanded(false);setZoom(false)};
 const error=(url:string)=>setFailed(old=>old.includes(url)?old:[...old,url]);
 if(!current)return <div className="pawlira-gallery-missing"><FiImage size={38} strokeWidth={1.5}/><p>Produktbild saknas</p></div>;
 return <div className="pawlira-product-gallery" onKeyDown={keys}>
 <div className="pawlira-gallery-stage" onTouchStart={e=>{const t=e.changedTouches[0];touch.current={x:t.clientX,y:t.clientY}}} onTouchEnd={e=>{const start=touch.current,t=e.changedTouches[0];touch.current=null;if(start&&Math.abs(t.clientX-start.x)>55&&Math.abs(t.clientY-start.y)<45){if(e.cancelable)e.preventDefault();move(t.clientX<start.x?1:-1)}}}>
 <button ref={trigger} type="button" className="pawlira-gallery-photo" aria-label="Öppna produktbild i stort format" onClick={()=>setExpanded(true)}>
 <Image key={current.url} src={current.url} alt={current.altText||title} fill sizes="(max-width: 1023px) 95vw, 720px" className="object-contain" onError={()=>error(current.url)} priority={i===0}/>
 </button>
 <span className="pawlira-gallery-counter" aria-live="polite">{i+1} / {list.length}</span>
 <button type="button" className="pawlira-gallery-expand" aria-label="Förstora bild" onClick={()=>setExpanded(true)}><FiMaximize2 size={20} strokeWidth={1.5}/></button>
 {list.length>1&&<><button type="button" className="pawlira-gallery-arrow prev" aria-label="Föregående bild" onClick={()=>move(-1)}><FiChevronLeft size={25} strokeWidth={1.5}/></button><button type="button" className="pawlira-gallery-arrow next" aria-label="Nästa bild" onClick={()=>move(1)}><FiChevronRight size={25} strokeWidth={1.5}/></button></>}
 </div>
 {list.length>1&&<div ref={thumbs} className="pawlira-gallery-thumbs" aria-label="Produktbilder">{list.map((p,n)=><button type="button" key={p.url} aria-label={`Visa produktbild ${n+1}`} aria-pressed={i===n} onClick={()=>{setIndex(n);setZoom(false)}}><Image src={p.url} alt="" fill sizes="100px" className="object-contain" onError={()=>error(p.url)}/></button>)}</div>}
 <dialog ref={dialog} className="pawlira-gallery-dialog" aria-label="Förstorad produktbild" onClose={()=>{close();trigger.current?.focus()}} onClick={e=>{if(e.target===e.currentTarget)close()}}>
 <div className="pawlira-lightbox">
 <div className="pawlira-lightbox-head"><div><p>{title}</p><span>Bild {i+1} av {list.length}</span></div><div className="flex items-center gap-2"><button type="button" aria-label={zoom?"Återställ zoom":"Zooma in"} aria-pressed={zoom} onClick={()=>setZoom(!zoom)}>{zoom?<FiMinimize2 size={22} strokeWidth={1.5}/>:<FiMaximize2 size={22} strokeWidth={1.5}/>}</button><button type="button" autoFocus aria-label="Stäng bildvisning" onClick={close}><FiX size={23} strokeWidth={1.5}/></button></div></div>
 {expanded&&<div className={"pawlira-lightbox-body "+(zoom?"is-zoomed":"")}><div className="pawlira-lightbox-image"><Image src={current.url} alt={current.altText||title} fill sizes="(max-width: 767px) 100vw, 1200px" className="object-contain" onError={()=>error(current.url)}/></div></div>}
 <div className="pawlira-lightbox-foot">{list.length>1&&<><button type="button" aria-label="Föregående bild" onClick={()=>move(-1)}><FiChevronLeft size={24} strokeWidth={1.5}/></button><div className="pawlira-lightbox-thumbs">{list.map((p,n)=><button key={p.url} type="button" aria-label={`Visa bild ${n+1}`} aria-pressed={i===n} onClick={()=>{setIndex(n);setZoom(false)}}><Image src={p.url} alt="" width={58} height={58} className="object-contain aspect-square"/></button>)}</div><button type="button" aria-label="Nästa bild" onClick={()=>move(1)}><FiChevronRight size={24} strokeWidth={1.5}/></button></>}</div>
 </div></dialog>
 </div>;
}
export default function ProductGallery({images,variants=[],title="Produktbild"}:Props){
 const params=useSearchParams();
 const variant=selectedProductVariant(variants,params);
 const variantImage=variant?.image;
 const color=params.get("color")||params.get("colour")||params.get("färg");
 const preferred=variantImage?.url?{url:variantImage.url,altText:variantImage.altText||title,width:variantImage.width||800,height:variantImage.height||800}:color?images.find(p=>p.altText?.toLowerCase()===color.toLowerCase()):undefined;
 const unique=Array.from(new Map(images.filter(p=>p.url).map(p=>[imageKey(p.url),p])).values());
 const ordered=preferred?[preferred,...unique.filter(p=>imageKey(p.url)!==imageKey(preferred.url))]:unique;
 return <GalleryView key={preferred?.url||"default"} images={ordered} title={title}/>;
}
