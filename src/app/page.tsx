export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import {LuArrowUpRight,LuChevronRight,LuTruck,LuLayoutGrid,LuSlidersHorizontal} from "react-icons/lu";
import SeoMeta from "@/partials/SeoMeta";
import HomeSections from "@/partials/HomeSections";
import SkeletonFeaturedProducts from "@/components/loadings/skeleton/SkeletonFeaturedProducts";
import {getCollections,getCollectionProducts,getProducts} from "@/lib/shopify";
import {Suspense} from "react";
import config from "@/config/config.json";

export default async function Home(){
 const [allCollections,all,featured]=await Promise.all([getCollections().catch(()=>[]),getProducts({}).catch(()=>({products:[]})),getCollectionProducts({collection:config.shopify.collections.featured_products,first:8}).catch(()=>({products:[]}))]);
 const categories=allCollections.filter(c=>!["frontpage","home-page","homepage","featured-products","all"].includes(c.handle)&&!c.handle.startsWith("hidden")&&c.title.toLowerCase()!=="home page");
 const litterCat=categories.find(c=>/kattlå|kattla|litter|toalett/i.test(c.title+" "+c.handle))||categories[0];
 const feederCat=categories.find(c=>/foder|mat|feed/i.test(c.title+" "+c.handle))||categories[1];
 const [litterProducts,feederProducts]=await Promise.all([
  litterCat?getCollectionProducts({collection:litterCat.handle,first:4}).catch(()=>({products:[]})):Promise.resolve({products:[]}),
  feederCat?getCollectionProducts({collection:feederCat.handle,first:4}).catch(()=>({products:[]})):Promise.resolve({products:[]}),
 ]);
 const pickImg=(list:typeof all.products)=>list.find(p=>p.featuredImage?.url)?.featuredImage||list.flatMap(p=>p.images).find(i=>i?.url);
 const primaryThumb=pickImg(featured.products)||pickImg(litterProducts.products)||pickImg(all.products);
 const compareThumb=pickImg(litterProducts.products)||pickImg(feederProducts.products)||primaryThumb;
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
        {Icon:LuTruck,thumb:undefined,kicker:"Alltid",title:"Fri frakt inom Sverige",href:"/shipping-policy"},
        {Icon:LuLayoutGrid,thumb:primaryThumb,kicker:"Upptäck",title:"Våra utvalda produkter",href:"/#utvalda-produkter"},
        {Icon:LuSlidersHorizontal,thumb:compareThumb,kicker:"Hitta rätt för din katt",title:"Jämför modeller",href:"/compare"},
      ].map(({Icon,thumb,kicker,title,href})=><Link key={href} href={href} className="pawlira-hero-shortcut"><span className="pawlira-shortcut-visual">{thumb?.url?<Image src={thumb.url} alt="" width={72} height={72} sizes="72px" className="pawlira-shortcut-thumb"/>:<Icon size={40} strokeWidth={1.35} aria-hidden="true"/>}</span><span className="pawlira-shortcut-copy"><span>{kicker}</span><strong>{title}</strong></span><span className="pawlira-shortcut-arrow"><LuChevronRight size={13} strokeWidth={2.5} aria-hidden="true"/></span></Link>)}
    </div>
  </section>
  
  <Suspense fallback={<section className="container py-16"><SkeletonFeaturedProducts/></section>}><HomeSections/></Suspense>
 </>;
}
