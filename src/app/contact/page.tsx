import Link from "next/link";
import {LuPackage,LuMail,LuRefreshCcw,LuArrowUpRight,LuShieldCheck,LuMapPin,LuClock3} from "react-icons/lu";
import PawliraPageHero from "@/partials/PawliraPageHero";
import ContactForm from "@/components/ContactForm";

export const dynamic="force-dynamic";
export const metadata={title:"Kontakta oss | Pawlira",description:"Kontakta Pawliras kundservice med ett meddelande om produkter, beställningar eller andra ärenden."};

export default function Contact(){
 const email="info@pawlira.se";
 const topics=[
  {Icon:LuPackage,title:"Leverans",detail:"Leveransinformation, uppskattade leveranstider och villkor.",href:"/shipping-policy",label:"Läs om leverans"},
  {Icon:LuRefreshCcw,title:"Retur och ångerrätt",detail:"Information om returer, ångerrätt och hur ett ärende hanteras.",href:"/refund-policy",label:"Se returvillkor"},
  {Icon:LuShieldCheck,title:"Garanti och reklamation",detail:"Information om fel på varor och vilka uppgifter som behövs för ett ärende.",href:"/terms-services",label:"Läs köpvillkor"}
 ];
 return <div className="pawlira-customer-support-page">
  <PawliraPageHero title="Kontakta oss"/>
  <section id="kontakt" className="container pawlira-home-section scroll-mt-36">
   <div className="pawlira-contact-layout">
    <div className="pawlira-contact-introduction">
     <h2 className="pawlira-large-heading">Kontakta kundservice</h2>
     <p>Frågor om produkter, en beställning eller en retur? Kontakta oss direkt via e-post eller skicka ett meddelande med formuläret.</p>
     <div className="pawlira-contact-methods"><div className="pawlira-contact-email"><LuMail size={23} strokeWidth={1.5} aria-hidden="true"/><div><h3>Skriv till oss</h3><a href={"mailto:"+email}>{email}</a><p>Skicka ett mejl direkt till vår kundservice.</p></div></div><div className="pawlira-contact-email"><LuMapPin size={23} strokeWidth={1.5} aria-hidden="true"/><div><h3>Postadress</h3><address>Studievägen 58<br/>784 54 Borlänge<br/>Sverige</address><p>Postadress, inte automatiskt returadress. Kontakta oss före retur.</p></div></div></div>
     <div className="pawlira-contact-tips"><h3>Snabbare hjälp med rätt uppgifter</h3><p>Vid produktfrågor är det bra om du anger modellnamnet. Om frågan gäller en beställning kan du lägga till ordernummer. Beskriv gärna ärendet så tydligt som möjligt.</p></div>
    </div>
    <div className="pawlira-contact-form-panel"><div className="pawlira-contact-form-panel-heading"><h2>Skicka ett meddelande</h2><p>Fyll i uppgifterna nedan, så når din fråga vår kundservice.</p></div><ContactForm supportEmail={email}/></div>
   </div>
  </section>
  <section className="container pawlira-home-section pawlira-contact-more"><div className="pawlira-section-heading"><div><h2>Leverans, returer och garanti</h2><p className="pawlira-section-description">Mer information om vanliga kundserviceärenden.</p></div></div><div className="pawlira-support-grid">{topics.map(({Icon,title,detail,href,label})=><Link key={href} href={href} className="pawlira-guide-card"><Icon size={20} strokeWidth={1.5}/><h3>{title}</h3><p>{detail}</p><span className="pawlira-text-link">{label}<LuArrowUpRight size={20} strokeWidth={1.5}/></span></Link>)}</div></section>
 </div>;
}
