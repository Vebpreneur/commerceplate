export const dynamic = "force-dynamic";
import Link from "next/link";
import {LuArrowUpRight,LuChevronRight,LuTruck,LuLayoutGrid,LuSlidersHorizontal} from "react-icons/lu";
import SeoMeta from "@/partials/SeoMeta";
import HomeSections from "@/partials/HomeSections";
import SkeletonFeaturedProducts from "@/components/loadings/skeleton/SkeletonFeaturedProducts";
import {Suspense} from "react";

export default function Home(){
 return <>
  <SeoMeta/>
      <section className="pawlira-home-hero relative bg-black text-white min-h-[420px] lg:min-h-[650px] flex items-center bg-cover bg-[position:65%_center] md:bg-center" style={{backgroundImage:"linear-gradient(90deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.28) 40%,transparent 72%),url('/images/hero.png')"}}>
        <div className="container py-20">
          <div className="max-w-xl">
            
            <h1 className="pawlira-h1 !text-white mb-6">Mindre städning. Mer tid med din katt</h1>
            <p className="text-white text-lg mb-8">Självrengörande kattlådor, foderautomater och vattenfontäner.</p>
            <Link href="/products" className="btn btn-inverse !rounded-full">Utforska sortimentet<LuArrowUpRight size={18} strokeWidth={1.5}/></Link>
          </div>
        </div>
      </section>


  <section className="pawlira-hero-shortcuts" aria-label="Genvägar till sortiment och information">
    <div className="container pawlira-hero-shortcut-grid">
      {[
        {Icon:LuTruck,kicker:"Alltid",title:"Fri frakt inom Sverige",href:"/shipping-policy"},
        {Icon:LuLayoutGrid,kicker:"Upptäck",title:"Våra utvalda produkter",href:"/#utvalda-produkter"},
        {Icon:LuSlidersHorizontal,kicker:"Hitta rätt för din katt",title:"Jämför modeller",href:"/compare"},
      ].map(({Icon,kicker,title,href})=><Link key={href} href={href} className="pawlira-hero-shortcut"><span className="pawlira-shortcut-visual"><Icon size={44} strokeWidth={1.25} aria-hidden="true"/></span><span className="pawlira-shortcut-copy"><span>{kicker}</span><strong>{title}</strong></span><span className="pawlira-shortcut-arrow"><LuChevronRight size={13} strokeWidth={2.5} aria-hidden="true"/></span></Link>)}
    </div>
  </section>
  
  <Suspense fallback={<section className="container py-16"><SkeletonFeaturedProducts/></section>}><HomeSections/></Suspense>
 </>;
}
