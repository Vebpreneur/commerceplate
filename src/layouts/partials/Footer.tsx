import Logo from "@/components/Logo";
import type {NavigationCategory} from "@/lib/shopify/navigation";
import Link from "next/link";
import {LuArrowUpRight as FiArrowUpRight} from "react-icons/lu";
const information=[{title:"Leverans",url:"/shipping-policy"},{title:"Retur och ångerrätt",url:"/refund-policy"},{title:"Köpvillkor",url:"/terms-services"},{title:"Integritetspolicy",url:"/privacy-policy"}];
const discover=[{title:"Köpguide",url:"/kopguide"},{title:"Jämför modeller",url:"/compare"},{title:"Så fungerar det",url:"/about#smart-kattvard"}];
function FooterLinks({title,items}:{title:string;items:{title:string;url:string}[]}){
 return <div><h3>{title}</h3><ul>{items.map(item=><li key={item.url}><Link href={item.url}>{item.title}<FiArrowUpRight size={16} strokeWidth={1.5}/></Link></li>)}</ul></div>;
}
export default function Footer({categories=[]}:{categories?:NavigationCategory[]}){
 return <footer className="pawlira-footer"><div className="container">
 <div className="pawlira-footer-intro"><div><Logo variant="white" width={224}/><p>Självrengörande kattlådor, foderautomater och vattenfontäner.</p></div></div>
 <div className="pawlira-footer-grid">
 <FooterLinks title="Handla" items={[{title:"Alla produkter",url:"/products"},...categories.map(c=>({title:c.title,url:"/products?c="+encodeURIComponent(c.handle)})),{title:"Kampanjer",url:"/products?sale=1"}]}/>
 <FooterLinks title="Upptäck" items={discover}/>
 <FooterLinks title="Kundservice" items={[{title:"Kontakta oss",url:"/contact"},{title:"Vanliga frågor",url:"/contact#faq"},...information.slice(0,2),{title:"Om Pawlira",url:"/about"}]}/>
 <FooterLinks title="Information" items={information.slice(2)}/>
 </div>
 <div className="pawlira-footer-bottom"><span>© {new Date().getFullYear()} Pawlira</span><div><Link href="/privacy-policy">Integritetspolicy</Link><Link href="/terms-services">Köpvillkor</Link></div><span>Sverige · Svenska · SEK</span></div>
 </div></footer>;
}
