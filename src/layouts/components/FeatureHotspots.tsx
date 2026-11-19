"use client";
import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {LuPlus,LuMinus,LuArrowUpRight,LuShieldCheck,LuVolume2,LuTrash2,LuLayers} from "react-icons/lu";
import {customerTitle} from "@/lib/utils/customerTitle";
const features=[
 {title:"Sensorer och säkerhet",text:"Sensorer och stoppfunktioner varierar mellan modeller. Följ modellens angivna vikt- och åldersgränser.",Icon:LuShieldCheck,x:25,y:28},
 {title:"Ljudnivå",text:"Jämför ljudnivån i dB och följ modellens anvisningar för placering.",Icon:LuVolume2,x:75,y:28},
 {title:"Luktkontroll",text:"Avfallet samlas i en behållare. Tätning och filter varierar mellan modeller.",Icon:LuTrash2,x:25,y:73},
 {title:"Sandbädd och rengöring",text:"Rengöringscykel, strötyp och fyllnadsnivå bestäms av modellens konstruktion.",Icon:LuLayers,x:75,y:73}
];
type Model={title:string;href:string;specs:(string|null)[]};
export default function FeatureHotspots({image,href,model}:{image?:{url:string;altText?:string}|null;href:string;model?:Model}){
 const [active,setActive]=useState(0),[failed,setFailed]=useState(false);
 const f=features[active],spec=model?.specs[active];
 return <section className="container pawlira-home-section">
 <div className="pawlira-section-heading"><div><p className="pawlira-eyebrow">Självrengörande kattlådor</p><h2>Ingenjörskonst i detalj</h2><p className="pawlira-section-description">Fyra funktioner att undersöka när du väljer kattlåda.</p></div><Link href={href} className="pawlira-text-link">Utforska modeller<LuArrowUpRight size={20} strokeWidth={1.5}/></Link></div>
 <div className="pawlira-hotspot-layout pawlira-hotspot-inline"><div className="pawlira-hotspot-stage">{image?.url&&!failed?<Image src={image.url} alt={image.altText||model?.title||"Självrengörande kattlåda"} fill sizes="(max-width:1023px) 95vw, 900px" className="object-contain" onError={()=>setFailed(true)}/>:<Image src="/images/hero.png" alt="Pawliras produktvärld" fill sizes="100vw" className="object-contain"/>}
 {features.map(({title,x,y},i)=><button type="button" key={title} className="pawlira-hotspot" style={{left:x+"%",top:y+"%"}} aria-label={title} aria-pressed={active===i} aria-controls="pawlira-hotspot-detail" onClick={()=>setActive(i)}>{active===i?<LuMinus size={20} strokeWidth={1.5}/>:<LuPlus size={20} strokeWidth={1.5}/>}</button>)}
 </div><div id="pawlira-hotspot-detail" className="pawlira-hotspot-popover" role="status"><f.Icon size={24} strokeWidth={1.5}/><p className="pawlira-eyebrow">Funktion {active+1} av 4</p><h3>{f.title}</h3><p>{spec||f.text}</p>{model&&<div className="pawlira-hotspot-model"><small>{spec?"Modellens produktinformation":"Visad modell"}</small><Link href={model.href} className="pawlira-text-link">{customerTitle(model.title)}<LuArrowUpRight size={16} strokeWidth={1.5}/></Link></div>}</div></div>
 <div className="pawlira-hotspot-tabs">{features.map(({title,Icon},i)=><button key={title} type="button" aria-pressed={active===i} aria-controls="pawlira-hotspot-detail" onClick={()=>setActive(i)}><Icon size={20} strokeWidth={1.5}/>{title}</button>)}</div>
 </section>;
}
