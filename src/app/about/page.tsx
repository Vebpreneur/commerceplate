import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import SeoMeta from "@/partials/SeoMeta";
import Accordion from "@/shortcodes/Accordion";
import { RegularPage } from "@/types";
import Link from "next/link";
import { FaBoxOpen, FaHeadset, FaCheckCircle } from "react-icons/fa";

export default function About() {
 const {frontmatter}=getListPage("about/_index.md") as RegularPage;
 return <><SeoMeta {...frontmatter}/>
 <section className="container py-14 lg:py-24"><div className="grid lg:grid-cols-2 gap-12 items-center"><div><p className="uppercase tracking-[.2em] text-xs mb-4">Om Pawlira</p><h1 className="text-5xl lg:text-7xl tracking-tight mb-6">Ett enklare liv tillsammans.</h1><p className="text-lg max-w-lg mb-8">Smart teknik för livet med katt. Vi samlar produkter för vardagens rutiner, med fokus på tydlig information och genomtänkt design.</p><Link href="/products" className="btn btn-primary rounded-full">Upptäck sortimentet</Link></div><img src="/images/hero.png" alt="Pawliras produktvärld" className="rounded-xl w-full aspect-[4/3] object-cover"/></div></section>
 <section className="border-y border-border py-14"><div className="container grid md:grid-cols-3 gap-6">{[{icon:FaBoxOpen,title:"Leverans",text:"Information om leveransvillkor.",href:"/shipping-policy"},{icon:FaCheckCircle,title:"Kundens rättigheter",text:"Läs våra retur- och köpvillkor.",href:"/refund-policy"},{icon:FaHeadset,title:"Kundinformation",text:"Information inför och efter ditt köp.",href:"/contact"}].map(({icon:Icon,title,text,href})=><Link key={title} href={href} className="pawlira-card p-8"><Icon size={28}/><h2 className="text-xl mt-5 mb-3">{title}</h2><p>{text}</p><span className="underline mt-5">Läs mer</span></Link>)}</div></section>
 <section className="container py-16 lg:py-24"><div className="grid lg:grid-cols-2 gap-12"><div><h2 className="mb-5">Vår idé</h2>{frontmatter.about_us?.map(section=><div key={section.title} className="mb-6"><h3 className="text-xl mb-2">{section.title}</h3><div className="content" dangerouslySetInnerHTML={markdownify(section.content)}/></div>)}</div><div><h2 className="mb-5">Vanliga frågor</h2>{frontmatter.faqs?.map(faq=><Accordion key={faq.title} title={faq.title}><div dangerouslySetInnerHTML={markdownify(faq.content)}/></Accordion>)}</div></div></section></>;
}
