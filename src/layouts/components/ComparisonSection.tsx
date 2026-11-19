import Link from "next/link";
import {LuArrowUpRight} from "react-icons/lu";

const rows=[
 ["Daglig skopning","Automatisk separering av avfall","Manuell skopning"],
 ["Luktkontroll","Sluten behållare eller filter, beroende på modell","Beror på låda, strö och rengöring"],
 ["Sandförbrukning","Beror på modell och strötyp","Beror på strötyp och skötsel"],
 ["Ljudnivå","Motor; se modellens ljudnivå","Ingen motor"],
 ["App och besök","Vissa modeller har app eller besöksregistrering","Ingen inbyggd appregistrering"]
];
export default function ComparisonSection({href}:{href:string}){return <section className="container pawlira-home-section"><div className="pawlira-section-heading"><div><h2>Automatisk eller traditionell kattlåda</h2></div><Link href={href} className="pawlira-text-link">Jämför modeller<LuArrowUpRight size={20} strokeWidth={1.5}/></Link></div><div className="pawlira-system-compare"><table><thead><tr><th scope="col">Kriterium</th><th scope="col">Pawlira<br/>Självrengörande</th><th scope="col">Traditionell kattlåda</th></tr></thead><tbody>{rows.map(([label,a,b])=><tr key={label}><th scope="row">{label}</th><td>{a}</td><td>{b}</td></tr>)}</tbody></table></div><p className="pawlira-comparison-note">Funktioner och prestanda varierar mellan modeller. Se den enskilda produktsidan för specifikationer.</p></section>}
