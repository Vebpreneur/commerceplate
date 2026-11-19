import LoadingProducts from "@/components/loadings/skeleton/SkeletonProducts";
import ProductLayouts from "@/components/product/ProductLayouts";
import {getCollections,getHighestProductPrice,getVendors} from "@/lib/shopify";
import {getCatalogPage} from "@/lib/shopify/catalog";
import ProductCardView from "@/partials/ProductCardView";
import ProductFilters from "@/partials/ProductFilters";
import ProductListView from "@/partials/ProductListView";
import {Suspense} from "react";
import Link from "next/link";
type SearchParams=Record<string,string|string[]|undefined>;
const one=(v:SearchParams[string])=>Array.isArray(v)?v[0]:v;
export const metadata={title:"Produkter | Pawlira",description:"Upptäck Pawliras sortiment av smarta kattprodukter."};

async function ShowProducts({searchParams}:{searchParams:SearchParams}){
 const [initialData,allCategories,vendors,maxPriceData]=await Promise.all([getCatalogPage(searchParams),getCollections().catch(()=>[]),getVendors({}).catch(()=>[]),getHighestProductPrice().catch(()=>null)]);
 const categories=allCategories.filter(c=>!["frontpage","home-page","homepage","featured-products"].includes(c.handle)&&!c.handle.startsWith("hidden-")&&c.title.toLowerCase()!=="home page");
 const tags=[...new Set(initialData.products.flatMap(p=>p.tags))].filter(t=>!t.startsWith("hidden-")&&!t.startsWith("nextjs-"));
 const filterProps={categories,vendors,tags,maxPriceData:maxPriceData||{amount:"0",currencyCode:"SEK"},vendorsWithCounts:[],categoriesWithCounts:[]};
 const current=categories.find(c=>c.handle===one(searchParams.c));
 const key=JSON.stringify(searchParams);
 return <>
  {current&&<div className="container pb-6"><div className="border border-border rounded-xl p-6 lg:p-8"><p className="text-xs uppercase tracking-widest mb-2">Kategori</p><h2 className="text-3xl mb-2">{current.title}</h2>{current.description&&<p className="max-w-3xl">{current.description}</p>}<Link href="/products" className="inline-block mt-4 underline underline-offset-4">Visa hela sortimentet</Link></div></div>}
  <Suspense><ProductLayouts {...filterProps}/></Suspense>
  <div className="container"><div className="row"><aside className="col-3 hidden lg:block"><div className="border border-border rounded-xl p-5"><Suspense><ProductFilters {...filterProps}/></Suspense></div></aside><div className="col-12 lg:col-9">{one(searchParams.layout)==="list"?<ProductListView key={key} searchParams={searchParams} initialData={initialData}/>:<ProductCardView key={key} searchParams={searchParams} initialData={initialData}/>}</div></div></div>
 </>;
}
export default async function ProductsListPage({searchParams}:{searchParams:Promise<SearchParams>}){
 const params=await searchParams;
 return <><section className="container pt-10 pb-8 lg:pt-16"><p className="uppercase tracking-[.18em] text-xs mb-3">Pawlira</p><h1 className="text-4xl lg:text-6xl tracking-tight mb-4">Upptäck sortimentet</h1><p className="text-base lg:text-lg max-w-2xl">Smarta produkter för livet med katt.</p></section><Suspense fallback={<LoadingProducts/>}><ShowProducts searchParams={params}/></Suspense><div className="pb-16"/></>;
}
