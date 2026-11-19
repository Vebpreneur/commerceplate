import Link from "next/link";
import SeoMeta from "@/partials/SeoMeta";
import FaqSection from "@/partials/FaqSection";
import {Suspense} from "react";
import {FiPackage,FiMail,FiRefreshCcw} from "react-icons/fi";

export const dynamic="force-dynamic";
export default function Contact(){
 const configured=process.env.PAWLIRA_SUPPORT_EMAIL?.trim()||"";
 const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configured)?configured:null;
 return <><SeoMeta title="Kundservice | Pawlira" description="Hjälp med produkter, beställningar, leveranser och returer."/>
 <section className="container py-14 lg:py-24"><p className="uppercase tracking-[.2em] text-xs mb-4">Kundservice</p><h1 className="text-5xl lg:text-7xl tracking-tight mb-6">Hur kan vi hjälpa dig?</h1><p className="text-lg max-w-2xl">Här hittar du information inför och efter ditt köp. Läs våra villkor eller utforska sortimentet.</p></section>
 <section className="container pb-16"><div className="grid md:grid-cols-3 gap-4">{[
 {Icon:FiPackage,title:"Leverans",detail:"Läs om leverans och frakt.",href:"/shipping-policy"},
 {Icon:FiRefreshCcw,title:"Retur och ångerrätt",detail:"Information om returer och dina rättigheter.",href:"/refund-policy"},
 {Icon:FiMail,title:"Kontakt",detail:email||"Har du redan beställt? Se kontaktuppgifterna i din orderbekräftelse.",href:email?"mailto:"+email:"/terms-services"}
 ].map(({Icon,title,detail,href})=><a key={title} href={href} className="pawlira-card p-8"><Icon size={30}/><h2 className="text-xl mt-5 mb-3">{title}</h2><p className="break-words">{detail}</p><span className="underline underline-offset-4 mt-5">{href.startsWith("mailto:")?"Skicka e-post":"Läs mer"}</span></a>)}</div></section>
 <Suspense fallback={<div className="container py-12"><h2>Vanliga frågor</h2></div>}><FaqSection/></Suspense></>;
}
