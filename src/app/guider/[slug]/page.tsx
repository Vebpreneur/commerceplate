import Link from "next/link";
import {notFound} from "next/navigation";
import {LuArrowUpRight,LuClock3} from "react-icons/lu";
import PawliraPageHero from "@/partials/PawliraPageHero";
import {getGuide,guideArticles} from "@/lib/content/guides";

export function generateStaticParams(){return guideArticles.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
 const article=getGuide((await params).slug);if(!article)return {};
 return {title:article.title+" | Pawlira",description:article.description,alternates:{canonical:"/guider/"+article.slug},openGraph:{title:article.title+" | Pawlira",description:article.description,type:"article" as const}};
}
export default async function GuideArticlePage({params}:{params:Promise<{slug:string}>}){
 const article=getGuide((await params).slug);if(!article)return notFound();
 return <article className="pawlira-editorial-page pawlira-guide-article"><PawliraPageHero title={article.title} breadcrumbs={[{label:"Guider",href:"/guider"}]}/><div className="container pawlira-guide-article-content"><div className="pawlira-guide-article-lead"><p>{article.introduction}</p><span><LuClock3 size={16} strokeWidth={1.5}/>{article.readTime} läsning</span></div>{article.sections.map((section)=><section key={section.title} className="pawlira-guide-article-section"><h2>{section.title}</h2>{section.paragraphs.map((paragraph,j)=><p key={j}>{paragraph}</p>)}{section.bullets&&<ul>{section.bullets.map(b=><li key={b}>{b}</li>)}</ul>}</section>)}<div className="pawlira-guide-article-cta"><div><h2>Vill du jämföra produkter?</h2><p>Se vilka modeller som passar dina behov och kontrollera detaljerna på respektive produktsida.</p></div><div className="flex flex-wrap gap-3"><Link href="/compare" className="btn btn-primary rounded-full">Jämför modeller <LuArrowUpRight size={18}/></Link><Link href="/products" className="btn btn-outline-primary rounded-full">Se sortimentet</Link></div></div><nav aria-label="Fler guider" className="pawlira-guide-related"><Link href="/guider" className="pawlira-text-link">Till alla guider <LuArrowUpRight size={18}/></Link><Link href="/kopguide" className="pawlira-text-link">Öppna köpguiden <LuArrowUpRight size={18}/></Link></nav></div></article>;
}
