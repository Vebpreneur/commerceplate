"use client";
import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {LuArrowUpRight as FiArrowRight,LuArrowUpRight as FiArrowUpRight,LuCheck as FiCheck,LuBox as FiBox,LuInfo as FiInfo} from "react-icons/lu";
type Category={title:string;handle:string;image?:{url:string;altText?:string}|null};
function guidance(category:Category){
 const text=(category.title+" "+category.handle).toLowerCase();
 if(/kattlå|kattla|litter|toalett/.test(text))return {title:"Välja kattlåda",intro:"Utgå från kattens storlek, vanor och platsen där lådan ska stå.",checks:[["Storlek och användningsgränser","Kontrollera tillverkarens angivna vikt, ålder, öppning och utrymme inne i lådan."],["Strö och rengöring","Jämför kompatibla strötyper, avfallsbehållare och instruktioner för rengöring."],["Placering och säkerhet","Kontrollera mått, strömförsörjning och instruktioner för säker introduktion."]]};
 if(/foder|mat|feed/.test(text))return {title:"Välja foderautomat",intro:"Välj en lösning som passar fodret och de portioner din katt behöver.",checks:[["Foder och portionsstorlek","Kontrollera kompatibel foderstorlek och hur portionerna ställs in."],["Kapacitet och schema","Jämför behållarens kapacitet, antal måltider och tillgängliga inställningar."],["Ström och underhåll","Kontrollera strömförsörjning och hur behållare och skål rengörs."]]};
 if(/vatten|fontän|fontan|water|fountain/.test(text))return {title:"Välja vattenfontän",intro:"Utgå från kattens drickvanor och hur mycket plats du har hemma.",checks:[["Kapacitet och material","Jämför behållarens storlek, material och produktens mått."],["Filter och rengöring","Kontrollera filtertyp, tillgång till reservdelar och rengöringsinstruktioner."],["Placering och drift","Kontrollera strömförsörjning och de funktioner den aktuella modellen erbjuder."]]};
 return {title:"Produktval",intro:"Jämför produkter efter dina och kattens faktiska behov.",checks:[["Mått och användning","Kontrollera produktmått och tillverkarens användningsinstruktioner."],["Funktioner","Jämför funktioner, varianter och vad som ingår."],["Underhåll","Läs om rengöring, tillbehör och eventuella anslutningskrav."]]};
}
export default function ProductGuide({categories}:{categories:Category[]}){
 const [handle,setHandle]=useState(categories[0]?.handle||"");
 const category=categories.find(c=>c.handle===handle)||categories[0];
 if(!category)return null;
 const data=guidance(category);
 return <section id="kopguide" className="container pawlira-home-section scroll-mt-36"><div className="pawlira-section-heading"><div><h2>Köpguide</h2></div><Link href="/contact" className="pawlira-text-link">Behöver du hjälp? <FiArrowUpRight size={20} strokeWidth={1.5}/></Link></div>
 <div className="pawlira-guide-choice-grid">{categories.map(c=><button type="button" key={c.handle} aria-pressed={c.handle===category.handle} onClick={()=>setHandle(c.handle)}><span className="pawlira-guide-choice-image">{c.image?.url?<Image src={c.image.url} alt="" fill sizes="100px" className="object-contain"/>:<FiBox size={26} strokeWidth={1.5}/>}</span><span>{c.title}</span><span className="pawlira-guide-choice-icon">{c.handle===category.handle?<FiCheck size={18} strokeWidth={1.5}/>:<FiArrowRight size={18} strokeWidth={1.5}/>}</span></button>)}</div>
 <div className="pawlira-guide-detail" key={category.handle}><div className="pawlira-guide-detail-intro"><p className="pawlira-eyebrow">{category.title}</p><h3>{data.title}</h3><p>{data.intro}</p><Link href={"/products?c="+encodeURIComponent(category.handle)} className="btn btn-inverse rounded-full">Utforska kategorin <FiArrowRight className="inline ml-2" strokeWidth={1.5}/></Link><Link href={"/compare?c="+encodeURIComponent(category.handle)} className="pawlira-white-link">Jämför modeller <FiArrowUpRight size={17} strokeWidth={1.5}/></Link></div><div className="pawlira-guide-checklist"><p className="pawlira-eyebrow">Tre saker att kontrollera</p>{data.checks.map(([title,detail],i)=><div key={title}><span className="pawlira-guide-number">0{i+1}</span><div><h4>{title}</h4><p>{detail}</p></div></div>)}<p className="pawlira-guide-disclaimer"><FiInfo size={17} strokeWidth={1.5}/> Funktioner varierar mellan modeller. Följ alltid tillverkarens instruktioner.</p></div></div>
 </section>;
}
