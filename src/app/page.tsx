export const dynamic = "force-dynamic";
import Link from "next/link";
import {LuArrowUpRight} from "react-icons/lu";
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


  <section className="pawlira-marquee" aria-label="Självrengörande kattlådor, foderautomater, vattenfontäner och fri frakt inom Sverige">
        <div className="pawlira-marquee-track" aria-hidden="true">
          {[0,1].map((copy) => <div key={copy} className="pawlira-marquee-group">{["Självrengörande kattlådor","Foderautomater","Vattenfontäner","Fri frakt inom Sverige"].map(text => <span key={text}>{text}<span className="pawlira-marquee-dot">·</span></span>)}</div>)}
        </div>
      </section>

  <Suspense fallback={<section className="container py-16"><SkeletonFeaturedProducts/></section>}><HomeSections/></Suspense>
 </>;
}
