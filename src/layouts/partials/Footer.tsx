import Logo from "@/components/Logo";
import type {NavigationCategory} from "@/lib/shopify/navigation";
import Link from "next/link";
import {FiArrowUpRight,FiPackage,FiRefreshCcw,FiMessageCircle} from "react-icons/fi";
const information=[{title:"Leverans",url:"/shipping-policy"},{title:"Retur och ångerrätt",url:"/refund-policy"},{title:"Köpvillkor",url:"/terms-services"},{title:"Integritetspolicy",url:"/privacy-policy"}];
const discover=[{title:"Alla produkter",url:"/products"},{title:"Om Pawlira",url:"/about"},{title:"Köpguide",url:"/#kopguide"},{title:"Jämför produkter",url:"/compare"},{title:"Vanliga frågor",url:"/#faq"}];
function FooterLinks({title,items}:{title:string;items:{title:string;url:string}[]}){
 return <div><h3>{title}</h3><ul>{items.map(item=><li key={item.url}><Link href={item.url}>{item.title}<FiArrowUpRight size={14}/></Link></li>)}</ul></div>;
}
export default function Footer({categories=[]}:{categories?:NavigationCategory[]}){
 return <footer className="pawlira-footer"><div className="container">
 <div className="pawlira-footer-intro"><div><Logo variant="white" width={224}/><p>Smart teknik. Genomtänkt design.<br/>Ett enklare liv tillsammans.</p></div><Link href="/products" className="pawlira-footer-cta">Hitta din nästa favorit<FiArrowUpRight size={24}/></Link></div>
 <div className="pawlira-footer-grid">
 <FooterLinks title="Sortiment" items={[...categories.map(c=>({title:c.title,url:"/products?c="+encodeURIComponent(c.handle)})),{title:"Visa alla produkter",url:"/products"}]}/>
 <FooterLinks title="Upptäck" items={[...discover,...(categories.length?[{title:"Handla efter kategori",url:"/#kategorier"}]:[])]}/>
 <FooterLinks title="Kundservice" items={[{title:"Kontakta oss",url:"/contact"},...information.slice(0,2),{title:"Produktfrågor",url:"/contact#faq"}]}/>
 <FooterLinks title="Information" items={information.slice(2)}/>
 </div>
 <div className="pawlira-footer-assurance">{[{Icon:FiPackage,title:"Leverans",url:"/shipping-policy"},{Icon:FiRefreshCcw,title:"Returer",url:"/refund-policy"},{Icon:FiMessageCircle,title:"Kundservice",url:"/contact"}].map(({Icon,title,url})=><Link key={url} href={url}><Icon size={22}/><span>{title}</span><FiArrowUpRight size={16}/></Link>)}</div>
 <div className="pawlira-footer-bottom"><span>© {new Date().getFullYear()} Pawlira</span><div><Link href="/privacy-policy">Integritetspolicy</Link><Link href="/terms-services">Köpvillkor</Link></div><span>Smart Pet Care</span></div>
 </div></footer>;
}
