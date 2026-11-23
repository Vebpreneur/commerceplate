import Link from "next/link";
import PawliraPageHero from "@/partials/PawliraPageHero";
import {LuArrowUpRight,LuBookOpen,LuHeartHandshake,LuSlidersHorizontal,LuSearch,LuClipboardCheck,LuShoppingBag} from "react-icons/lu";

export const metadata={title:"Om Pawlira | Smarta produkter för kattens vardag",description:"Lär känna Pawlira, vår filosofi, våra designprinciper och hur vi hjälper kattägare att välja rätt produkter."};

const principles=[
 {number:"01",title:"Passform och mått",text:"En smart produkt behöver fungera i ett riktigt hem. Därför är yttermått, öppningar, kapacitet och kattens storlek viktiga uppgifter att jämföra före köpet."},
 {number:"02",title:"Säker användning",text:"Produktens användningsgränser och säkerhetsfunktioner ska vara begripliga. Vi hjälper dig att hitta information om rätt användning, introduktion och tillsyn."},
 {number:"03",title:"Enkel skötsel över tid",text:"Förbrukningsdelar, rengöring och löpande underhåll spelar stor roll. En bra produkt ska vara rimlig att använda och sköta i vardagen."}
];
const steps=[
 {Icon:LuSearch,title:"Utgå från behovet",text:"Börja med den rutin du vill förenkla: kattlådan, måltiderna eller vattnet. Fundera på kattens vanor, storlek och hemmets förutsättningar."},
 {Icon:LuClipboardCheck,title:"Jämför produktens uppgifter",text:"Läs modellens mått, funktioner, kapacitet och tekniska krav. Använd köpguiden och jämförelsen för att förstå skillnaderna."},
 {Icon:LuShoppingBag,title:"Välj och introducera",text:"Välj modell och variant utifrån dina behov. Följ produktens instruktioner och låt katten vänja sig vid den nya utrustningen i lugn takt."}
];

export default function About(){
 return <main className="pawlira-about-page">
  <PawliraPageHero title="Om Pawlira"/>
  <section className="container pawlira-home-section"><div className="pawlira-about-manifesto"><div><h2 className="pawlira-large-heading">Teknik som får ta hand om måsten</h2></div><div className="pawlira-about-prose"><p>Pawlira är en svensk webbutik med självrengörande kattlådor, foderautomater och vattenfontäner. Vi samlar smarta lösningar för de rutiner som återkommer varje dag.</p><p>Vi vill göra produktvalet tydligare. Därför hjälper vi kattägare att jämföra mått, kapacitet, funktioner och skötsel – så att det blir lättare att välja utifrån katten och hemmet.</p><p>Automatiska funktioner kan avlasta vardagen, men ersätter aldrig omtanke eller tillsyn. Vårt fokus är praktisk teknik som fungerar tillsammans med kattens behov.</p></div></div></section>
  <section className="pawlira-home-black pawlira-about-overview"><div className="container"><div className="pawlira-about-black-head"><div><h2 className="pawlira-large-heading">Det här står Pawlira för</h2></div></div><div className="pawlira-about-values">
   {[{Icon:LuHeartHandshake,title:"Vår filosofi",text:"Teknik ska ge mer tid för katten och mindre tid åt återkommande måsten."},{Icon:LuSlidersHorizontal,title:"Våra designprinciper",text:"Tydliga mått, säker användning och enkel skötsel ska vägleda produktvalet."},{Icon:LuBookOpen,title:"Så fungerar det",text:"Från att hitta rätt kategori till att jämföra och introducera en produkt."}].map(({Icon,title,text},i)=><article key={title}><div className="pawlira-about-value-top"><Icon size={20} strokeWidth={1.5}/><span>0{i+1}</span></div><h3>{title}</h3><p>{text}</p></article>)}
  </div></div></section>
  <section id="var-filosofi" className="container pawlira-home-section scroll-mt-36"><div className="pawlira-about-manifesto"><div><h2 className="pawlira-large-heading">Vår filosofi</h2></div><div className="pawlira-about-prose"><p>En genomtänkt produkt ska lösa ett verkligt behov för både katten och människan. Automatik kan förenkla vissa rutiner, men den ska aldrig ersätta tillsyn, omsorg eller att vara uppmärksam på hur katten mår.</p><p>Vi vill att funktionerna ska vara enkla att förstå. Kattens storlek och vanor, hemmets utrymme och hur produkten ska skötas spelar större roll än antalet tekniska funktioner.</p><p>Det ska vara lätt att göra ett medvetet val – med jämförbara produktuppgifter och tydliga beskrivningar.</p></div></div></section>
  <section id="designprinciper" className="pawlira-about-principles scroll-mt-36"><div className="container pawlira-home-section"><h2 className="pawlira-large-heading">Våra designprinciper</h2><div className="pawlira-about-principle-rows">{principles.map(item=><article className="pawlira-about-principle-row" key={item.number}><span className="pawlira-about-principle-number">{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>
  <section id="sa-fungerar-det" className="container pawlira-home-section scroll-mt-36"><div className="pawlira-section-heading"><div><h2>Så fungerar det</h2><p className="pawlira-section-description">Så går du från ett vardagsbehov till ett genomtänkt produktval.</p></div></div><div className="pawlira-about-process">{steps.map(({Icon,title,text},i)=><article key={title}><div className="pawlira-about-process-index"><Icon size={22} strokeWidth={1.5}/><span>0{i+1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  <section className="pawlira-about-final"><div className="container pawlira-home-section"><div className="pawlira-about-manifesto"><div><h2 className="pawlira-large-heading">Hitta rätt lösning för ditt hem</h2><p className="pawlira-section-description">Redo att se vilka produkter som passar dig och din katt?</p></div><div className="pawlira-about-paths"><Link href="/products"><LuShoppingBag size={20} strokeWidth={1.5}/><div><h3>Utforska sortimentet</h3><p>Upptäck kattlådor, foderautomater och vattenfontäner.</p></div><LuArrowUpRight size={20} strokeWidth={1.5}/></Link><Link href="/kopguide"><LuBookOpen size={20} strokeWidth={1.5}/><div><h3>Öppna köpguiden</h3><p>Ta hjälp av en vägledd genomgång före köp.</p></div><LuArrowUpRight size={20} strokeWidth={1.5}/></Link></div></div></div></section>
 </main>;
}
