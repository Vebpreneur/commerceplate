"use client";
import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {LuPlus,LuX,LuArrowUpRight,LuShieldCheck,LuVolume2,LuTrash2,LuLayers} from "react-icons/lu";
import FadeInSection from "./FadeInSection";
const features=[
 {title:"Sensorer och säkerhet",text:"Kontrollera vilka sensorer och stoppfunktioner modellen har, och följ tillverkarens vikt- och åldersgränser.",Icon:LuShieldCheck,x:24,y:25},
 {title:"Ljudnivå",text:"Jämför angiven ljudnivå i dB och välj placering utifrån modellens instruktioner.",Icon:LuVolume2,x:72,y:25},
 {title:"Luktkontroll",text:"En avfallsbehållare samlar upp avfallet. Kontrollera om den valda modellen har tätning eller filter.",Icon:LuTrash2,x:24,y:72},
 {title:"Sandbädd och rengöring",text:"Kontrollera hur rengöringscykeln fungerar och vilka strötyper och fyllnadsnivåer som rekommenderas.",Icon:LuLayers,x:72,y:72}
];
export default function FeatureHotspots({image,href}:{image?:{url:string;altText?:string}|null;href:string}){
 const [active,setActive]=useState<number|null>(0);const [failed,setFailed]=useState(false);
 const f=active===null?null:features[active];
 return <section className="container pawlira-home-section"><FadeInSection>
 <div className="pawlira-section-heading"><div><p className="pawlira-eyebrow">Självrengörande kattlådor</p><h2>Ingenjörskonst i detalj</h2><p className="pawlira-section-description">Fyra funktioner att jämföra innan du väljer modell. Punkterna är en funktionsguide, inte en ritning över en specifik produkt.</p></div><Link href={href} className="pawlira-text-link">Utforska modeller<LuArrowUpRight size={20} strokeWidth={1.5}/></Link></div>
 <div className="pawlira-hotspot-layout"><div className="pawlira-hotspot-stage">{image?.url&&!failed?<Image src={image.url} alt={image.altText||"Självrengörande kattlåda"} fill sizes="(max-width:767px) 100vw, 1280px" className="object-contain" onError={()=>setFailed(true)}/>:<Image src="/images/hero.png" alt="Pawliras produktvärld" fill sizes="100vw" className="object-cover"/>}
 {features.map(({title,x,y},i)=><button type="button" key={title} className="pawlira-hotspot" style={{left:x+"%",top:y+"%"}} aria-label={title} aria-expanded={active===i} aria-controls={f?"pawlira-hotspot-detail":undefined} onClick={()=>setActive(active===i?null:i)}>{active===i?<LuX size={20} strokeWidth={1.5}/>:<LuPlus size={20} strokeWidth={1.5}/>}</button>)}
 </div>{f&&<div id="pawlira-hotspot-detail" className={"pawlira-hotspot-popover "+(f.x>50?"is-left":"is-right")} style={{top:f.y>50?"auto":f.y+"%",bottom:f.y>50?(100-f.y)+"%":"auto",left:f.x>50?"auto":f.x+"%",right:f.x>50?(100-f.x)+"%":"auto"}} role="status"><f.Icon size={24} strokeWidth={1.5}/><h3>{f.title}</h3><p>{f.text}</p><button type="button" aria-label="Stäng information" onClick={()=>setActive(null)}><LuX size={18} strokeWidth={1.5}/></button></div>}
 </div><div className="pawlira-hotspot-tabs">{features.map(({title,Icon},i)=><button key={title} type="button" aria-pressed={active===i} onClick={()=>setActive(i)}><Icon size={20} strokeWidth={1.5}/>{title}</button>)}</div>
 </FadeInSection></section>;
}
