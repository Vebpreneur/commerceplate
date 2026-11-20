import Link from "next/link";
import GettingStarted from "@/components/GettingStarted";
import FaqSection from "@/partials/FaqSection";
import {Suspense} from "react";
import {LuPackage as FiPackage,LuMail as FiMail,LuRefreshCcw as FiRefreshCcw,LuArrowUpRight as FiArrowUpRight,LuBox as FiBox,LuClipboard as FiClipboard,LuSearch as FiSearch} from "react-icons/lu";

export const dynamic="force-dynamic";
export default function Contact(){
 const configured=process.env.PAWLIRA_SUPPORT_EMAIL?.trim()||"";
 const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configured)?configured:null;
 const topics=[
 {Icon:FiBox,title:"Garanti och reklamation",detail:"Om en vara är skadad eller inte fungerar, se köpvillkoren och kontakta oss med ordernummer.",href:"/terms-services",label:"Köpvillkor"},
 {Icon:FiPackage,title:"Leverans",detail:"Läs om leveransvillkor och hur du följer din beställning.",href:"/shipping-policy",label:"Leveransvillkor"},
 {Icon:FiRefreshCcw,title:"Retur och ångerrätt",detail:"Se vad som gäller om du vill returnera en vara eller behöver reklamera den.",href:"/refund-policy",label:"Returinformation"}
 ];
 return <>
 <section className="container pawlira-support-intro"><div className="pawlira-support-hero pawlira-support-art"><div><h1>Hur kan vi hjälpa dig?</h1><p>Information om leverans, returer, produktfrågor och skötsel.</p><a href="#faq" className="btn btn-inverse rounded-full inline-flex items-center gap-2"><FiSearch size={20} strokeWidth={1.5}/> Hitta svar på din fråga</a></div></div></section>
 <section className="container pawlira-home-section"><div className="pawlira-section-heading"><div><h2>Leverans, returer och garanti</h2></div></div><div className="pawlira-support-grid">{topics.map(({Icon,title,detail,href,label})=><Link key={href} href={href} className="pawlira-guide-card"><Icon size={20} strokeWidth={1.5}/><h3>{title}</h3><p>{detail}</p><span className="pawlira-text-link">{label}<FiArrowUpRight size={20} strokeWidth={1.5}/></span></Link>)}</div></section>
 <GettingStarted/>
 <Suspense fallback={<section id="faq" className="container py-12"><h2>Vanliga frågor</h2></section>}><FaqSection/></Suspense>
 <section id="kontakt" className="container pawlira-home-section scroll-mt-36"><div className="pawlira-about-manifesto"><div><h2 className="pawlira-large-heading">Kontakta oss</h2><p className="pawlira-section-description">Ha gärna ordernummer eller modellnamn till hands.</p><div className="pawlira-support-contact"><FiMail size={20} strokeWidth={1.5}/><div><h3>Kontakta kundservice</h3>{email?<><p>{email}</p><a href={"mailto:"+email} className="btn btn-primary rounded-full mt-4">Skicka e-post <FiArrowUpRight className="inline ml-1" strokeWidth={1.5}/></a></>:<p>Har du redan beställt? Använd kontaktuppgifterna i din orderbekräftelse. Se även uppgifterna i våra <Link href="/terms-services" className="underline">köpvillkor</Link>.</p>}</div></div></div><div className="pawlira-support-checklist">{[{Icon:FiBox,title:"Om du har en produktfråga",text:"Ange modellnamn och vilken funktion, variant eller specifikation du undrar över."},{Icon:FiClipboard,title:"Om du har en beställningsfråga",text:"Ha ordernumret, din orderbekräftelse och en tydlig beskrivning av ärendet till hands."},{Icon:FiPackage,title:"Om något inte fungerar",text:"Beskriv vad som händer och dokumentera vid behov problemet med bilder. Följ tillverkarens säkerhetsinstruktioner."}].map(({Icon,title,text})=><article key={title}><Icon size={20} strokeWidth={1.5}/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>
 </>;
}
