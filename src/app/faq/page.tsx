import Link from "next/link";
import {Suspense} from "react";
import {LuArrowUpRight as FiArrowUpRight} from "react-icons/lu";
import GettingStarted from "@/components/GettingStarted";
import FaqSection from "@/partials/FaqSection";
import PawliraPageHero from "@/partials/PawliraPageHero";

export const metadata={title:"Vanliga frågor | Pawlira",description:"Svar om Pawliras produkter, beställningar, leveranser, returer och kundservice."};

export default function FrequentlyAskedQuestions(){
 return <div className="pawlira-customer-faq-page">
  <PawliraPageHero title="Vanliga frågor"/>
  <Suspense fallback={<section className="container pawlira-catalog-faq"><div className="pawlira-catalog-faq-list">Laddar frågor…</div></section>}><FaqSection/></Suspense>
  <GettingStarted/>
  <section className="container pawlira-home-section"><div className="pawlira-about-manifesto"><div><p className="pawlira-eyebrow">Fler frågor?</p><h2 className="pawlira-large-heading">Vi hjälper dig vidare</h2><p className="pawlira-section-description">För personlig hjälp med en produkt eller beställning, besök vår kundservicesida.</p></div><div className="flex items-center"><Link href="/contact" className="btn btn-primary rounded-full">Kontakta oss <FiArrowUpRight size={18} strokeWidth={1.5}/></Link></div></div></section>
 </div>;
}
