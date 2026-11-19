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
  const featured = products.length ? products : (await getProducts({})).products.slice(0, 8);
  return <FeaturedProducts products={featured} />;
};

const Home = () => {

  return (
    <>
      <SeoMeta />
      <section className="relative bg-black text-white min-h-[420px] lg:min-h-[650px] flex items-center bg-cover bg-center" style={{backgroundImage:"linear-gradient(90deg,rgba(0,0,0,.65),transparent),url('/images/hero.webp')"}}>
        <div className="container py-20">
          <div className="max-w-xl">
            <p className="text-white uppercase tracking-[.24em] text-sm mb-5">Pawlira</p>
            <h1 className="!text-white text-5xl md:text-7xl tracking-tight leading-tight mb-6">En ny standard för livet med katt.</h1>
            <p className="text-white text-lg mb-8">Smart teknik. Genomtänkt design.</p>
            <Link href="/products" className="btn !bg-white !text-black !rounded-full">Upptäck sortimentet</Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-8">
        <div className="container flex flex-wrap justify-center gap-6 md:gap-16 text-sm font-medium">
          <Link href="/products">Upptäck våra produkter</Link>
          <Link href="/about">Om Pawlira</Link>
          <Link href="/contact">Kontakta oss</Link>
        </div>
      </section>
      {/* category section  */}
      <section className="py-12 lg:py-20">
        <div className="container">
          <div className="text-center mb-6 md:mb-14">
            <h2>Upptäck sortimentet</h2>
          </div>
          <Suspense fallback={<SkeletonCategory />}>
            <ShowCollections />
          </Suspense>
        </div>
      </section>

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
            {[["Leverans","Läs om leverans och köpvillkor.","/terms-services"],["Kundservice","Vi hjälper dig med frågor om ditt köp.","/contact"],["Integritet","Läs hur dina uppgifter hanteras.","/privacy-policy"]].map(([title,description,href])=><Link key={title} href={href} className="border border-neutral-700 rounded-lg p-8 text-white"><h3 className="!text-white mb-3">{title}</h3><p className="text-neutral-300">{description}</p></Link>)}
          </div>
        </div>
      </section>
      <section className="py-12 lg:py-20"><div className="container text-center max-w-3xl"><h2 className="mb-5">Ett enklare liv tillsammans.</h2><p className="text-lg mb-8">Pawlira fokuserar på smarta produkter för livet med katt. Teknik och design som hör hemma i vardagen.</p><Link href="/about" className="btn btn-outline-primary rounded-full">Om Pawlira</Link></div></section>
      <section className="py-12 lg:py-20 border-t border-border"><div className="container"><h2 className="text-center mb-8">Vanliga frågor</h2><div className="max-w-3xl mx-auto"><Accordion title="Var hittar jag produktens funktioner?"><p>På respektive produktsida hittar du tillgänglig produktinformation.</p></Accordion><Accordion title="Hur kontaktar jag Pawlira?"><Link href="/contact" className="underline">Kontakta oss</Link></Accordion><Accordion title="Var hittar jag köpvillkoren?"><Link href="/terms-services" className="underline">Läs köpvillkoren</Link></Accordion></div></div></section>
    </>
  );
};

export default Home;
