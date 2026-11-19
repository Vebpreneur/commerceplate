import type {ProductField} from "@/lib/utils/productFields";
import {LuRuler,LuWeight,LuBox,LuPackage,LuPlug,LuFilter,LuBookOpen} from "react-icons/lu";
import Link from "next/link";
import FadeInSection from "../FadeInSection";
const definitions=[
 {title:"Mått",Icon:LuRuler,match:/^(?:produktens? mått|produktmått|mått|dimensioner|dimensions|size)$/i},
 {title:"Rekommenderad kattvikt",Icon:LuWeight,match:/^(?:rekommenderad kattvikt|kattens vikt|kattvikt|pet weight|cat weight|suitable weight)$/i},
 {title:"Kapacitet",Icon:LuBox,match:/^(?:kapacitet|volym|behållarvolym|capacity|avfallsbehållarens kapacitet)$/i}
];
export default function DimensionsGuide({fields}:{fields:ProductField[]}){
 const specs=fields.filter(f=>f.key==="spec"||f.key==="details").flatMap(f=>f.value.split(/\r?\n/)).map(line=>{const m=line.match(/^\s*[-•]?\s*([^:]{1,80}):\s*(.+)$/);return m?{key:m[1].trim(),value:m[2].trim()}:null}).filter((m):m is {key:string;value:string}=>!!m);
 const items=definitions.map(d=>({...d,value:specs.find(s=>d.match.test(s.key))?.value}));
 const included=fields.filter(f=>f.key==="included").flatMap(f=>f.value.split(/\r?\n/)).map(s=>s.replace(/^[-•]\s*/,"").trim()).filter(Boolean);
 const icon=(s:string)=>/adapter|ström|power/i.test(s)?LuPlug:/filter|påse|påsar|bag/i.test(s)?LuFilter:/guide|manual|instruktion/i.test(s)?LuBookOpen:LuPackage;
 return <section className="container pawlira-home-section"><FadeInSection>
 <div className="pawlira-section-heading"><div><p className="pawlira-eyebrow">Produktinformation</p><h2>Mått och kapacitet</h2><p className="pawlira-section-description">Kontrollera modellens mått och användningsgränser innan du beställer.</p></div><Link href="/contact#kontakt" className="pawlira-text-link">Fråga om produkten</Link></div>
 <div className="pawlira-dimension-grid">{items.map(({title,Icon,value})=><article key={title}><Icon size={24} strokeWidth={1.5}/><h3>{title}</h3><p>{value||"Ej angivet"}</p></article>)}</div>
 {included.length>0&&<div className="pawlira-included"><h2>Vad ingår i förpackningen</h2><div className="pawlira-included-grid">{included.map((s,i)=>{const Icon=icon(s);return <article key={i}><Icon size={24} strokeWidth={1.5}/><p>{s}</p></article>})}</div></div>}
 </FadeInSection></section>;
}
