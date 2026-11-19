import {customerStories} from "@/config/customerStories";
import {LuBadgeCheck,LuQuote} from "react-icons/lu";
import FadeInSection from "./FadeInSection";
export default function CustomerStories(){
 const stories=customerStories.filter(s=>s.verified&&s.consent&&s.quote.trim()&&s.model.trim()).slice(0,3);
 if(!stories.length)return null;
 return <section className="container pawlira-home-section"><FadeInSection><div className="pawlira-section-heading"><div><p className="pawlira-eyebrow">Hemma hos våra kunder</p><h2>Erfarenheter från kattägare</h2></div></div><div className="pawlira-stories-grid">{stories.map(s=><article key={s.id}><LuQuote size={24} strokeWidth={1.5}/><blockquote>{s.quote}</blockquote><div><p className="font-semibold">{s.name}</p><p>{s.cats} {s.cats===1?"katt":"katter"} · {s.model}</p><p className="inline-flex items-center gap-2"><LuBadgeCheck size={16} strokeWidth={1.5}/> Verifierat köp</p></div></article>)}</div></FadeInSection></section>
}
