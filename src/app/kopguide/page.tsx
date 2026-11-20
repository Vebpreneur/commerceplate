import ProductGuide from "@/components/ProductGuide";
import {getCollections,getCollectionProducts} from "@/lib/shopify";
import {categoryName} from "@/lib/utils/modelName";
import Link from "next/link";
export const metadata={title:"Köpguide | Pawlira",description:"Hitta rätt kattlåda, foderautomat eller vattenfontän."};
export default async function BuyingGuide({searchParams}:{searchParams:Promise<{c?:string|string[]}>}){
 const requested=(await searchParams).c;
 const initialHandle=Array.isArray(requested)?requested[0]:requested;
 const collections=await getCollections().catch(()=>[]);
 const selected=collections.filter(c=>!["frontpage","home-page","homepage","featured-products","all"].includes(c.handle)&&!c.handle.startsWith("hidden")&&c.title.toLowerCase()!=="home page").slice(0,6);
 const categories=await Promise.all(selected.map(async c=>{const result=await getCollectionProducts({collection:c.handle,first:1}).catch(()=>({products:[]}));return {title:categoryName(c.title),handle:c.handle,image:result.products[0]?.featuredImage};}));
 return <><div className="container pt-10"><nav aria-label="Brödsmulor" className="pawlira-catalog-breadcrumb"><Link href="/">Hem</Link><span>/</span><span aria-current="page">Köpguide</span></nav></div>{categories.length?<ProductGuide categories={categories} initialHandle={initialHandle}/>:<section className="container pawlira-home-section"><h1>Köpguide</h1><p>Utforska vårt sortiment och hitta rätt modell för din katt.</p><Link href="/products" className="btn btn-primary">Alla produkter</Link></section>}</>;
}
