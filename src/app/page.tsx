export const dynamic = "force-dynamic";
import Link from "next/link";
import SeoMeta from "@/partials/SeoMeta";
import HomeSections from "@/partials/HomeSections";
import SkeletonFeaturedProducts from "@/components/loadings/skeleton/SkeletonFeaturedProducts";
import {Suspense} from "react";

export default function Home(){
 return <>
  <SeoMeta/>
      <section className="relative bg-black text-white min-h-[420px] lg:min-h-[650px] flex items-center bg-cover bg-[position:65%_center] md:bg-center" style={{backgroundImage:"linear-gradient(90deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.28) 40%,transparent 72%),url('/images/hero.png')"}}>
        <div className="container py-20">
          <div className="max-w-xl">
            <p className="text-white uppercase tracking-[.24em] text-sm mb-5">Pawlira</p>
            <h1 className="!text-white text-5xl md:text-7xl tracking-tight leading-tight mb-6">En ny standard för livet med katt.</h1>
            <p className="text-white text-lg mb-8">Smart teknik. Genomtänkt design.</p>
            <Link href="/products" className="btn btn-inverse !rounded-full">Upptäck sortimentet</Link>
          </div>
        </div>
      </section>

      <section className="pawlira-marquee" aria-label="Smart teknik. Genomtänkt design. Ett enklare liv tillsammans.">
        <div className="pawlira-marquee-track" aria-hidden="true">
          {[0,1].map((copy) => <div key={copy} className="pawlira-marquee-group">{["Smart teknik","Genomtänkt design","Ett enklare liv tillsammans","Pawlira"].map(text => <span key={text}>{text}<span className="pawlira-marquee-dot">·</span></span>)}</div>)}
        </div>
      </section>

  <Suspense fallback={<section className="container py-16"><SkeletonFeaturedProducts/></section>}><HomeSections/></Suspense>
 </>;
}
