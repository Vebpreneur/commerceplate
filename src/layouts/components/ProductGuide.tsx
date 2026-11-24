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
const detailedAdvice=(category:Category)=>{
 const text=(category.title+" "+category.handle).toLowerCase();
 if(/kattlå|kattla|litter|toalett/.test(text))return [
  {title:"Rätt storlek för katten",body:"Jämför öppning, inre utrymme och produktens angivna vikt- och åldersgränser. Mät också platsen i hemmet och lämna utrymme för att öppna och rengöra apparaten."},
  {title:"Automatik och säkerhetsfunktioner",body:"Undersök vilka sensorer och stoppfunktioner den aktuella modellen har, och hur rengöringscykeln startas. Katter ska kunna vänja sig vid den nya toaletten utan stress."},
  {title:"Strö, behållare och skötsel",body:"Se vilka strötyper produkten stöder, hur stor avfallsbehållaren är och vilka delar som behöver tvättas. Det påverkar kostnaden och arbetet på lång sikt."},
  {title:"När ska du välja en annan modell?",body:"Om katten är mycket liten, har särskilda rörelsebehov eller inte kan använda produktens öppning är passform viktigare än automatiska funktioner."}
 ];
 if(/foder|mat|feed/.test(text))return [
  {title:"Kontrollera fodrets kompatibilitet",body:"Alla automater fungerar inte med alla typer eller storlekar av foder. Jämför modellens anvisningar med det foder katten faktiskt äter."},
  {title:"Portioner och scheman",body:"Titta på hur portionsstorleken ställs in, antal möjliga måltider och om schemat kan justeras direkt på enheten eller via app."},
  {title:"Reservström och anslutning",body:"Läs vilka nätverkskrav som gäller och om det finns alternativ vid strömavbrott. Batteridrift och Wi-Fi-stöd varierar mellan modeller."},
  {title:"Rengöring och foderförvaring",body:"Undersök hur skål, utmatning och behållare rengörs, samt hur länge foder bör förvaras i apparaten enligt modellens anvisningar."}
 ];
 if(/vatten|fontän|fontan|water|fountain/.test(text))return [
  {title:"Kapacitet och placering",body:"Utgå från vattenvolymen, kattens drickvanor och hur mycket plats som finns där fontänen ska stå."},
  {title:"Filtrering och förbrukningsdelar",body:"Jämför vilka filter som används, hur ofta de behöver bytas och vilka reservdelar som passar just den aktuella modellen."},
  {title:"Ljud och drift",body:"Olika pumpar och vattenflöden låter olika mycket. Undersök modellens drift och välj en placering där katten känner sig bekväm."},
  {title:"Rengöring i vardagen",body:"Se hur många delar som behöver rengöras, hur pumpen sköts och vilka instruktioner som gäller för vattennivå och strömförsörjning."}
 ];
 return [
  {title:"Börja med produktens användning",body:"Identifiera vilken uppgift produkten ska lösa och jämför den med kattens vanor och hemmets förutsättningar."},
  {title:"Granska mått och teknik",body:"Läs produktens uppgifter om storlek, kapacitet, funktioner och anslutning."},
  {title:"Se vad som ingår",body:"Kontrollera tillbehör, förbrukningsdelar och vad som ingår i den aktuella produktvarianten."},
  {title:"Planera underhåll",body:"Jämför skötsel, rengöring och tillgång till reservdelar före köp."}
 ];
};
export default function ProductGuide({categories,initialHandle}:{categories:Category[];initialHandle?:string}){
 const [handle,setHandle]=useState(categories.find(c=>c.handle===initialHandle)?.handle||categories[0]?.handle||"");
 const category=categories.find(c=>c.handle===handle)||categories[0];
 if(!category)return null;
 const data=guidance(category);
 const advice=detailedAdvice(category);
 return <section id="kopguide" className="container pawlira-home-section scroll-mt-36"><div className="pawlira-section-heading"><div><h2>Välj produktkategori</h2><p className="pawlira-section-description">Se vilka egenskaper som är bra att kontrollera för varje typ av produkt.</p></div><Link href="/contact" className="pawlira-text-link">Behöver du hjälp? <FiArrowUpRight size={20} strokeWidth={1.5}/></Link></div>
 <div className="pawlira-guide-choice-grid">{categories.map(c=><button type="button" key={c.handle} aria-pressed={c.handle===category.handle} onClick={()=>setHandle(c.handle)}><span className="pawlira-guide-choice-image">{c.image?.url?<Image src={c.image.url} alt="" fill sizes="100px" className="object-contain"/>:<FiBox size={26} strokeWidth={1.5}/>}</span><span>{c.title}</span><span className="pawlira-guide-choice-icon">{c.handle===category.handle?<FiCheck size={18} strokeWidth={1.5}/>:<FiArrowRight size={18} strokeWidth={1.5}/>}</span></button>)}</div>
 <div className="pawlira-guide-detail" key={category.handle}><div className="pawlira-guide-detail-intro"><h3>{data.title}</h3><p>{data.intro}</p><Link href={"/products?c="+encodeURIComponent(category.handle)} className="btn btn-inverse rounded-full">Utforska kategorin <FiArrowRight className="inline ml-2" strokeWidth={1.5}/></Link><Link href={"/compare?c="+encodeURIComponent(category.handle)} className="pawlira-white-link">Jämför modeller <FiArrowUpRight size={17} strokeWidth={1.5}/></Link></div><div className="pawlira-guide-checklist"><h3 className="pawlira-guide-checklist-heading">Viktigt inför ditt val</h3>{data.checks.map(([title,detail],i)=><div key={title}><span className="pawlira-guide-number">0{i+1}</span><div><h4>{title}</h4><p>{detail}</p></div></div>)}</div></div>
 <section className="pawlira-buying-advice" aria-labelledby="pawlira-buying-advice-title"><div className="pawlira-section-heading"><div><h2 id="pawlira-buying-advice-title">Så väljer du rätt modell</h2><p className="pawlira-section-description">Praktiska råd för {category.title.toLowerCase()} innan du jämför enskilda produkter.</p></div></div><div className="pawlira-buying-advice-rows">{advice.map((item,index)=><article key={item.title}><span className="pawlira-buying-advice-number">{String(index+1).padStart(2,"0")}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div><div className="pawlira-buying-advice-actions"><Link href={"/compare?c="+encodeURIComponent(category.handle)} className="btn btn-primary rounded-full">Jämför modeller <FiArrowUpRight size={18}/></Link><Link href="/guider" className="pawlira-text-link">Läs fler guider <FiArrowUpRight size={18}/></Link></div></section>
 </section>;
}
