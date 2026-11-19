import Link from "next/link";
import {LuArrowUpRight} from "react-icons/lu";
import FadeInSection from "./FadeInSection";
const rows=[
 ["Daglig skopning","Automatisk separering av avfall; behållaren töms regelbundet","Manuell skopning"],
 ["Luktkontroll","Sluten avfallsbehållare eller filter om modellen har det","Beror på låda, strö och rengöring"],
 ["Sandförbrukning","Rengöringsmekanism och kompatibelt strö varierar","Beror på strötyp och skötsel"],
 ["Ljudnivå","Motordrift; se angiven ljudnivå för modellen","Ingen motor"],
 ["App och besök","Vissa modeller har app eller besöksregistrering","Ingen inbyggd appregistrering"]
];
export default function ComparisonSection({href}:{href:string}){return <section className="container pawlira-home-section"><FadeInSection><div className="pawlira-section-heading"><div><p className="pawlira-eyebrow">Automatisk eller manuell</p><h2>Skillnaden i vardagen</h2><p className="pawlira-section-description">Jämför hur en självrengörande kattlåda fungerar mot en traditionell låda.</p></div><Link href={href} className="pawlira-text-link">Jämför modeller<LuArrowUpRight size={20} strokeWidth={1.5}/></Link></div><div className="pawlira-system-compare"><table><thead><tr><th scope="col">Kriterium</th><th scope="col">Pawlira<br/>Självrengörande</th><th scope="col">Traditionell kattlåda</th></tr></thead><tbody>{rows.map(([label,a,b])=><tr key={label}><th scope="row">{label}</th><td>{a}</td><td>{b}</td></tr>)}</tbody></table></div><p className="pawlira-comparison-note">Funktioner och prestanda varierar mellan modeller. Se den enskilda produktsidan för specifikationer.</p></FadeInSection></section>}
