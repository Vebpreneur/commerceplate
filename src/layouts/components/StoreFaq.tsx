"use client";
import {useState} from "react";
import {usePathname} from "next/navigation";
import type {ReactNode} from "react";
import Link from "next/link";
import Accordion from "@/shortcodes/Accordion";
import {LuBox as FiBox,LuTruck as FiTruck,LuRefreshCcw as FiRefreshCcw,LuMessageCircle as FiMessageCircle,LuArrowUpRight as FiArrowUpRight,LuSearch as FiSearch} from "react-icons/lu";

type Policy={title:string;body:string;url:string}|null;
type Question={title:string;answer:ReactNode;keywords?:string};
type Group={title:string;icon:typeof FiBox;items:Question[]};
function PolicyDetails({policy,href,label}:{policy:Policy;href:string;label:string}){
 return <div className="pawlira-faq-policy">{policy?.body?<details><summary>{label} – fullständiga aktuella villkor</summary><div className="content max-w-none" dangerouslySetInnerHTML={{__html:policy.body}}/></details>:<p>Kontrollera de aktuella villkoren före köpet. <Link href={href}>{label}</Link>.</p>}</div>;
}
export default function StoreFaq({shipping=null,refund=null,terms=null,email=null}:{shipping?:Policy;refund?:Policy;terms?:Policy;email?:string|null}){
 const groups:Group[]=[
 {title:"Produkter & teknik",icon:FiBox,items:[
 {title:"Vilken typ av produkt passar min katt?",keywords:"välja modell storlek kattlåda foderautomat vattenfontän",answer:<><p>Mät platsen där produkten ska stå. För kattlådor: kontrollera öppning, innermått samt tillverkarens vikt- och åldersgränser. För foderautomater: jämför behållarens volym i liter, foderstorlek och portionsinställningar. För fontäner: kontrollera volym, filter och hur delarna rengörs.</p></>},
 {title:"Hur vänjer jag min katt vid en ny automatisk produkt?",answer:<><p>Ställ den nya produkten bredvid den gamla om det är möjligt. Låt katten själv bekanta sig med den. Följ manualens introduktionsråd och aktivera automatiska funktioner först när det är lämpligt enligt tillverkaren.</p></>},
 {title:"Behöver produkterna Wi-Fi, app eller elanslutning?",answer:<><p>Kontrollera om modellen styrs med knappar eller app. Läs nätverkskraven – exempelvis 2,4 GHz om det anges i specifikationen – och kontrollera om nätadapter eller batteri ingår.</p></>},
 {title:"Hur väljer jag rätt kattströ till en självrengörande kattlåda?",answer:<><p>Använd strötypen och kornstorleken som anges i manualen. Följ fyllnadsmarkeringen. Klumpbildande strö kan fungera i vissa modeller, men inte i alla.</p></>},
 {title:"Hur rengör och underhåller jag produkterna?",answer:<><p>Följ produktens manual och stäng av eller koppla bort strömmen när instruktionerna kräver det. Rengör de löstagbara delarna enligt angiven metod; elektroniska delar och motorer ska inte blötas ned om tillverkaren inte uttryckligen tillåter det.</p><p>Kontrollera också hur ofta filter, behållare och andra förbrukningsdelar behöver rengöras eller bytas.</p></>},
 {title:"Vad ingår när jag beställer en produkt?",answer:<><p>Innehållet varierar mellan modeller och produktvarianter. Läs avsnittet om vad som ingår och produktens specifikationer innan du beställer. Där det finns information anges exempelvis medföljande delar, strömförsörjning och tillbehör.</p><p>Kontakta kundservice om en del som är viktig för dig inte framgår tydligt av produktinformationen.</p></>}]},
 {title:"Beställning & leverans",icon:FiTruck,items:[
 {title:"Hur gör jag en beställning?",answer:<><p>Välj modell och antal, lägg i varukorgen och gå till kassan. Fyll i leveransadress och välj betalningssätt. Du får en orderbekräftelse när beställningen är genomförd.</p></>},
 {title:"Hur lång tid tar leveransen?",keywords:"leveranstid dagar frakt paket",answer:<><p>Se leveransvillkoren för aktuella tider. Om kassan visar en uppskattad leveranstid gäller den din beställning.</p><PolicyDetails policy={shipping} href="/shipping-policy" label="Leveransvillkor"/></>},
 {title:"Vad kostar frakten och vart kan jag beställa?",answer:<><p>Frakten är kostnadsfri vid beställning till Sverige. Ange din leveransadress i kassan och kontrollera att uppgifterna är korrekta innan du slutför köpet.</p><PolicyDetails policy={shipping} href="/shipping-policy" label="Leveransvillkor"/></>},
 {title:"Hur kan jag följa min beställning?",answer:<><p>Spara din orderbekräftelse och ditt ordernummer. När försändelsen skickats kan eventuell spårningsinformation finnas i leveransmeddelandet. Kontrollera även skräppostmappen om du förväntar dig ett meddelande.</p><p>Om du saknar uppdateringar, kontakta kundservice med ordernumret och den e-postadress du använde vid köpet.</p></>},
 {title:"Vilka betalningssätt kan jag använda?",answer:<><p>Du ser tillgängliga betalningssätt i kassan innan du godkänner köpet. Skicka aldrig kortuppgifter till kundservice.</p></>},
 {title:"Kan jag ändra eller avbryta min beställning?",answer:<><p>Kontakta kundservice så snart som möjligt med ordernummer och vad du vill ändra. Möjligheten att ändra en adress, variant eller beställning beror på hur långt ordern har behandlats. Om varan redan har skickats kan en ändring behöva hanteras genom returförfarandet.</p><PolicyDetails policy={terms} href="/terms-services" label="Köpvillkor"/></>}]},
 {title:"Retur & kundservice",icon:FiRefreshCcw,items:[
 {title:"Hur går jag tillväga om jag vill returnera en vara?",answer:<><p>Kontrollera de aktuella returvillkoren och kontakta kundservice med ordernummer, vilken vara det gäller och att du önskar returnera den. Följ de returinstruktioner du får så att försändelsen kan identifieras och hanteras korrekt.</p><PolicyDetails policy={refund} href="/refund-policy" label="Retur och ångerrätt"/></>},
 {title:"Vad gör jag om en produkt är skadad eller inte fungerar?",answer:<><p>Sluta använda produkten om du misstänker att den är osäker. Spara orderbekräftelse, förpackning och dokumentera problemet med en tydlig beskrivning och gärna bilder. Kontakta kundservice så att ärendet kan utredas och du kan få instruktioner för nästa steg.</p><p>Skicka inte betalningsuppgifter, lösenord eller andra känsliga uppgifter tillsammans med din felbeskrivning.</p></>},
 {title:"Vad är skillnaden mellan retur och reklamation?",answer:<><p>En retur gäller normalt att du vill lämna tillbaka en vara. En reklamation gäller att du anser att varan är felaktig, skadad eller inte motsvarar vad du har rätt att förvänta dig. Villkor och hantering kan därför skilja sig åt.</p><p>Beskriv tydligt vilket ärende du har när du kontaktar kundservice, så att du får rätt instruktioner.</p><PolicyDetails policy={refund} href="/refund-policy" label="Returvillkor"/></>},
 {title:"Hur hanteras en eventuell återbetalning?",answer:<><p>Återbetalningens hantering beror på ärendet, de gällande villkoren och betalningssättet. Spara returkvitto och eventuell bekräftelse så att ärendet kan följas upp om en återbetalning inte syns.</p><PolicyDetails policy={refund} href="/refund-policy" label="Aktuella returvillkor"/></>},
 {title:"Hur får jag hjälp med en produkt eller beställning?",answer:<><p>För en produktfråga, ange modellnamn och vilken funktion du behöver hjälp med. För en orderfråga, ange ordernummer och den e-postadress som användes vid köpet. För tekniska problem kan bilder och en beskrivning av vad som händer vara till stor hjälp.</p><p>{email?<a href={"mailto:"+email}>Kontakta kundservice via e-post.</a>:<>Har du redan beställt kan du använda kontaktuppgifterna i orderbekräftelsen. Annars finns kundinformationen på <Link href="/contact">kundservicesidan</Link>.</>}</p></>}]}];
 const [active,setActive]=useState(0),[query,setQuery]=useState("");
 const pathname=usePathname();
 const needle=query.trim().toLocaleLowerCase("sv-SE");
 const tokens=needle.split(/\s+/).filter(Boolean);
 const compact=pathname!=="/contact";
 const matches=needle?groups.flatMap(g=>g.items).filter(q=>tokens.every(token=>(q.title+" "+(q.keywords||"")).toLocaleLowerCase("sv-SE").includes(token))):compact? [groups[0].items[0],groups[0].items[1],groups[1].items[1],groups[1].items[2],groups[2].items[0]]:groups[active].items;
 return <section id="faq" className="container pawlira-home-section pawlira-faq-section scroll-mt-36"><div className="pawlira-faq-dark">
 <div className="pawlira-faq-main"><h2>Vanliga frågor</h2>{!compact&&<><div className="pawlira-faq-search"><FiSearch size={20} strokeWidth={1.5}/><input aria-label="Sök bland frågor" placeholder="Sök bland frågor" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="pawlira-faq-dark-tabs" aria-label="Ämnesområden">{groups.map(({title},i)=><button key={title} type="button" aria-pressed={!needle&&active===i} onClick={()=>{setQuery("");setActive(i)}}>{title}</button>)}</div></>}
 <div className="pawlira-faq-dark-rows" aria-live="polite" key={needle||String(active)}>{matches.map(q=><Accordion key={q.title} title={q.title} className="pawlira-faq-dark-item">{q.answer}</Accordion>)}{!matches.length&&<p>Inga matchande frågor.</p>}</div>{compact&&<Link href="/contact#faq" className="pawlira-white-link">Alla frågor och svar<FiArrowUpRight size={18} strokeWidth={1.5}/></Link>}</div></div></section>;
}
