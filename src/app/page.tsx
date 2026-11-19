export const dynamic = "force-dynamic";

import CollectionsSlider from "@/components/CollectionsSlider";
import Link from "next/link";
import Accordion from "@/shortcodes/Accordion";
import SkeletonCategory from "@/components/loadings/skeleton/SkeletonCategory";
import SkeletonFeaturedProducts from "@/components/loadings/skeleton/SkeletonFeaturedProducts";
import config from "@/config/config.json";
import { getCollectionProducts, getCollections, getProducts } from "@/lib/shopify";
import FeaturedProducts from "@/partials/FeaturedProducts";
import SeoMeta from "@/partials/SeoMeta";
import { Suspense } from "react";

const { collections } = config.shopify;


const ShowCollections = async () => {
  const collections = await getCollections();
  return <CollectionsSlider collections={collections} />;
};

const ShowFeaturedProducts = async () => {
  const { products } = await getCollectionProducts({
    collection: collections.featured_products,
    reverse: false,
  });
  const featured = (products.length ? products : (await getProducts({})).products).slice(0,6);
  return <FeaturedProducts products={featured} />;
};

const Home = () => {

  return (
    <>
      <SeoMeta />
      <section className="relative bg-black text-white min-h-[420px] lg:min-h-[650px] flex items-center bg-cover bg-[position:65%_center] md:bg-center" style={{backgroundImage:"linear-gradient(90deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.28) 40%,transparent 72%),url('/images/hero.png')"}}>
        <div className="container py-20">
          <div className="max-w-xl">
            <p className="text-white uppercase tracking-[.24em] text-sm mb-5">Pawlira</p>
            <h1 className="!text-white text-5xl md:text-7xl tracking-tight leading-tight mb-6">En ny standard för livet med katt.</h1>
            <p className="text-white text-lg mb-8">Smart teknik. Genomtänkt design.</p>
            <Link href="/products" className="btn !bg-white !text-black !rounded-full">Upptäck sortimentet</Link>
          </div>
        </div>
      </section>

      <section className="pawlira-marquee" aria-label="Smart teknik. Genomtänkt design. Ett enklare liv tillsammans.">
        <div className="pawlira-marquee-track" aria-hidden="true">
          {[0,1].map((copy) => <div key={copy} className="pawlira-marquee-group">{["Smart teknik","Genomtänkt design","Ett enklare liv tillsammans","Pawlira"].map(text => <span key={text}>{text}<span className="pawlira-marquee-dot">·</span></span>)}</div>)}
        </div>
      </section>
      {/* category section  */}
      <section className="py-12 lg:py-20">
        <div className="container">
          <div className="text-center mb-6 md:mb-14">
            <p className="uppercase tracking-[.18em] text-xs mb-3">För varje vardagsrutin</p><h2>Utforska våra kategorier</h2>
          </div>
          <Suspense fallback={<SkeletonCategory />}>
            <ShowCollections />
          </Suspense>
        </div>
      </section>

      <section className="container py-8 lg:py-12"><div className="grid md:grid-cols-2 gap-4"><Link href="/products" className="pawlira-editorial relative min-h-[340px] overflow-hidden rounded-xl bg-black text-white flex items-end p-8 lg:p-12"><div className="relative z-10"><p className="uppercase text-xs tracking-[.18em] mb-4">Pawlira</p><h2 className="!text-white mb-4">Teknik för livet med katt.</h2><span className="underline underline-offset-4">Utforska sortimentet</span></div><div className="pawlira-editorial-image" style={{backgroundImage:"linear-gradient(0deg,rgba(0,0,0,.8),transparent),url('/images/hero.png')"}}/></Link><Link href="/about" className="pawlira-card rounded-xl border border-border bg-white p-8 lg:p-12 flex flex-col justify-center"><p className="uppercase tracking-[.18em] text-xs mb-6">Vår idé</p><h2 className="text-4xl lg:text-5xl mb-4">Mer tid tillsammans.</h2><p className="mb-5 text-lg">Upptäck Pawliras syn på en enklare vardag med katt.</p><span className="underline underline-offset-4 font-medium">Om Pawlira</span></Link></div></section>
      {/* Featured Products section  */}
      <section className="py-12 lg:py-20">
        <div className="container">
          <div className="text-center mb-6 md:mb-14">
            <h2 className="mb-2">Utvalda produkter</h2>
            <p className="md:h5">Smartare vardag för dig och din katt.</p>
          </div>
          <Suspense fallback={<SkeletonFeaturedProducts />}>
            <ShowFeaturedProducts />
          </Suspense>
        </div>
      </section>

      <section className="bg-black text-white py-16 lg:py-24">
        <div className="container">
          <h2 className="!text-white text-center mb-10">Handla med trygghet.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[["Leverans","Läs om leveransvillkoren.","/shipping-policy"],["Kundservice","Vi hjälper dig med frågor om ditt köp.","/contact"],["Integritet","Läs hur dina uppgifter hanteras.","/privacy-policy"]].map(([title,description,href])=><Link key={title} href={href} className="pawlira-dark-link border border-neutral-700 rounded-lg p-8 text-white"><h3 className="!text-white mb-3">{title}</h3><p className="text-neutral-300">{description}</p></Link>)}
          </div>
        </div>
      </section>
      <section className="py-12 lg:py-20"><div className="container text-center max-w-3xl"><h2 className="mb-5">Ett enklare liv tillsammans.</h2><p className="text-lg mb-8">Pawlira fokuserar på smarta produkter för livet med katt. Teknik och design som hör hemma i vardagen.</p><Link href="/about" className="btn btn-outline-primary rounded-full">Om Pawlira</Link></div></section>
      <section className="py-12 lg:py-20 border-t border-border"><div className="container"><h2 className="text-center mb-8">Vanliga frågor</h2><div className="max-w-3xl mx-auto"><Accordion title="Var hittar jag produktens funktioner?"><p>På respektive produktsida hittar du tillgänglig produktinformation.</p></Accordion><Accordion title="Hur kontaktar jag Pawlira?"><Link href="/contact" className="underline">Kontakta oss</Link></Accordion><Accordion title="Var hittar jag köpvillkoren?"><Link href="/terms-services" className="underline">Läs köpvillkoren</Link></Accordion></div></div></section>
    </>
  );
};

export default Home;
