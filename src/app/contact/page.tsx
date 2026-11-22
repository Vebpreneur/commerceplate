import Link from "next/link";
import {LuPackage as FiPackage,LuMail as FiMail,LuRefreshCcw as FiRefreshCcw,LuArrowUpRight as FiArrowUpRight,LuBox as FiBox,LuClipboard as FiClipboard} from "react-icons/lu";
import PawliraPageHero from "@/partials/PawliraPageHero";

export const dynamic="force-dynamic";
export const metadata={title:"Kontakta oss | Pawlira",description:"Kontakta Pawliras kundservice om produkter, beställningar, leveranser och returer."};

export default function Contact(){
 const configured=process.env.PAWLIRA_SUPPORT_EMAIL?.trim()||"";
 const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configured)?configured:null;
 const topics=[
  {Icon:FiBox,title:"Garanti och reklamation",detail:"Om en vara är skadad eller inte fungerar, se köpvillkoren och kontakta oss med ordernummer.",href:"/terms-services",label:"Köpvillkor"},
  {Icon:FiPackage,title:"Leverans",detail:"Läs om leveransvillkor och hur du följer din beställning.",href:"/shipping-policy",label:"Leveransvillkor"},
  {Icon:FiRefreshCcw,title:"Retur och ångerrätt",detail:"Se vad som gäller om du vill returnera en vara eller behöver reklamera den.",href:"/refund-policy",label:"Returinformation"}
 ];
 const checklist=[
  {Icon:FiBox,title:"Produktfråga",text:"Ange modellnamn och vilken funktion, variant eller specifikation du undrar över."},
  {Icon:FiClipboard,title:"Beställningsfråga",text:"Ha ordernumret, din orderbekräftelse och en tydlig beskrivning av ärendet till hands."},
  {Icon:FiPackage,title:"En produkt fungerar inte",text:"Beskriv vad som händer och dokumentera vid behov problemet med bilder. Följ tillverkarens säkerhetsinstruktioner."}
 ];
 return <div className="pawlira-customer-support-page">
  <PawliraPageHero title="Kontakta oss" description="Vi hjälper dig med produktfrågor, beställningar, leveranser och returer.">
   <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start"><Link href="/faq" className="btn btn-primary rounded-full">Vanliga frågor <FiArrowUpRight size={18} strokeWidth={1.5}/></Link><Link href="/products" className="btn btn-outline-primary rounded-full">Utforska sortimentet</Link></div>
  </PawliraPageHero>
  <section className="container pawlira-home-section">
   <div className="pawlira-section-heading"><div><h2>Leverans, returer och garanti</h2><p className="pawlira-section-description">Välj ämnet som bäst motsvarar det du behöver hjälp med.</p></div></div>
   <div className="pawlira-support-grid">{topics.map(({Icon,title,detail,href,label})=><Link key={href} href={href} className="pawlira-guide-card"><Icon size={20} strokeWidth={1.5}/><h3>{title}</h3><p>{detail}</p><span className="pawlira-text-link">{label}<FiArrowUpRight size={20} strokeWidth={1.5}/></span></Link>)}</div>
  </section>
  <section id="kontakt" className="container pawlira-home-section scroll-mt-36">
   <div className="pawlira-about-manifesto"><div><p className="pawlira-eyebrow">Personlig hjälp</p><h2 className="pawlira-large-heading">Kontakta kundservice</h2><p className="pawlira-section-description">Ha gärna ordernummer eller modellnamn till hands så blir det enklare att hjälpa dig.</p>
    <div className="pawlira-support-contact"><FiMail size={20} strokeWidth={1.5}/><div><h3>{email?"Skicka e-post till kundservice":"Hitta kontaktuppgifterna"}</h3>{email?<><p>{email}</p><a href={"mailto:"+email} className="btn btn-primary rounded-full mt-4">Skicka e-post <FiArrowUpRight className="inline ml-1" strokeWidth={1.5}/></a></>:<p>Har du redan beställt? Använd kontaktuppgifterna i din orderbekräftelse. Du hittar även företagets kontaktuppgifter i våra <Link href="/terms-services" className="underline">köpvillkor</Link>.</p>}</div></div>
   </div><div className="pawlira-support-checklist">{checklist.map(({Icon,title,text})=><article key={title}><Icon size={20} strokeWidth={1.5}/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div>
  </section>
 </div>;
}
