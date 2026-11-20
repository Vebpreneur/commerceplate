import LoadingProducts from "@/components/loadings/skeleton/SkeletonProducts";
import ProductLayouts from "@/components/product/ProductLayouts";
import {getCollections,getHighestProductPrice,getVendors} from "@/lib/shopify";
import {getCatalogPage} from "@/lib/shopify/catalog";
import ProductCardView from "@/partials/ProductCardView";
import ProductFilters from "@/partials/ProductFilters";
import ProductListView from "@/partials/ProductListView";
import {Suspense} from "react";
import Link from "next/link";
import Image from "next/image";
import {LuArrowUpRight as FiArrowUpRight,LuLayoutGrid as FiGrid,LuChevronRight as FiChevronRight} from "react-icons/lu";
import type {Collection} from "@/lib/shopify/types";
import {categoryName} from "@/lib/utils/modelName";

type SearchParams=Record<string,string|string[]|undefined>;
type Category=Collection&{image?:{url:string;altText?:string}|null};
const one=(v:SearchParams[string])=>Array.isArray(v)?v[0]:v;
export const metadata={title:"Produkter | Pawlira",description:"Upptäck Pawliras sortiment av smarta kattprodukter."};

async function ShowProducts({searchParams}:{searchParams:SearchParams}){
 const [initialData,allCategories,vendors,maxPriceData]=await Promise.all([getCatalogPage(searchParams),getCollections().catch(()=>[]),getVendors({}).catch(()=>[]),getHighestProductPrice().catch(()=>null)]);
 const categories=(allCategories as Category[]).filter(c=>!["frontpage","home-page","homepage","featured-products","all"].includes(c.handle)&&!c.handle.startsWith("hidden-")&&c.title.toLowerCase()!=="home page").map(c=>({...c,title:categoryName(c.title)}));
 const tags=[...new Set(initialData.products.flatMap(p=>p.tags))].filter(t=>!t.startsWith("hidden-")&&!t.startsWith("nextjs-"));
 const filterProps={categories,vendors,tags,maxPriceData:maxPriceData||{amount:"0",currencyCode:"SEK"},vendorsWithCounts:[],categoriesWithCounts:[]};
 const current=categories.find(c=>c.handle===one(searchParams.c));
 const query=one(searchParams.q);
 const key=JSON.stringify(searchParams);
 const heroImages=query?[]:current?(current.image?.url?[current]:[]):categories.filter(c=>c.image?.url).slice(0,3);
 const categoryDescription=current?(/kattlå|kattla|litter/i.test(current.title+" "+current.handle)?"Automatiska kattlådor med olika kapacitet, rengöringsfunktioner och styralternativ.":/foder|feed/i.test(current.title+" "+current.handle)?"Foderautomater med olika behållarvolymer, portionsinställningar och styralternativ.":/vatten|fontän|fountain/i.test(current.title+" "+current.handle)?"Vattenfontäner med olika behållarvolymer, filterlösningar och material.":current.title):"Självrengörande kattlådor, foderautomater och vattenfontäner." ;
 const categoryUrl=(handle:string)=>"/products?c="+encodeURIComponent(handle);
 return <>
 <section className="container pt-7 lg:pt-10 pb-9 lg:pb-12">
  <nav aria-label="Brödsmulor" className="pawlira-catalog-breadcrumb"><Link href="/">Hem</Link><FiChevronRight strokeWidth={1.5}/><Link href="/products">Produkter</Link>{current&&<><FiChevronRight strokeWidth={1.5}/><span aria-current="page">{current.title}</span></>}</nav>
  <div className={`pawlira-catalog-hero ${heroImages.length?"has-image":""}`}><div className="pawlira-catalog-hero-copy"><h1>{query?"Sökresultat":current?.title||"Alla produkter"}</h1><p>{query?`Resultat för ”${query}”`:categoryDescription}</p>{current&&<Link href="/products" className="pawlira-text-link">Visa hela sortimentet<FiArrowUpRight size={19} strokeWidth={1.5}/></Link>}</div>{heroImages.length>0&&<div className={"pawlira-catalog-art "+(current?"is-category":"is-collection")}>{heroImages.map(c=><div key={c.handle}><Image src={c.image!.url} alt={c.title} fill sizes="(max-width:767px) 90vw, 50vw" className="object-contain"/></div>)}</div>}</div>
 </section>
 {categories.length>0&&<section className="container pb-9"><div className="pawlira-category-tabs" aria-label="Produktkategorier"><Link href="/products" aria-current={!current?"page":undefined}><FiGrid size={18} strokeWidth={1.5}/> Alla produkter</Link>{categories.map(c=><Link href={categoryUrl(c.handle)} key={c.handle} aria-current={current?.handle===c.handle?"page":undefined}>{c.title}<FiArrowUpRight size={16} strokeWidth={1.5}/></Link>)}</div></section>}
 <Suspense><ProductLayouts {...filterProps}/></Suspense>
 <div className="container pb-14 lg:pb-24"><div className="pawlira-catalog-layout"><aside className="pawlira-catalog-sidebar"><Suspense><ProductFilters {...filterProps}/></Suspense></aside><div className="min-w-0">{one(searchParams.layout)==="list"?<ProductListView key={key} searchParams={searchParams} initialData={initialData}/>:<ProductCardView key={key} searchParams={searchParams} initialData={initialData}/>}</div></div></div>
 </>;
}
export default async function ProductsListPage({searchParams}:{searchParams:Promise<SearchParams>}){
 return <Suspense fallback={<LoadingProducts/>}><ShowProducts searchParams={await searchParams}/></Suspense>;
}
