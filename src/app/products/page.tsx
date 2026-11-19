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
import {FiArrowUpRight,FiGrid,FiChevronRight} from "react-icons/fi";
import type {Collection} from "@/lib/shopify/types";
import {categoryName} from "@/lib/utils/modelName";
import {categoryEditorial} from "@/lib/utils/categoryEditorial";
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
 const heroImage=query?undefined:current?.image?.url||initialData.products.find(p=>p.featuredImage?.url)?.featuredImage?.url;
 const categoryUrl=(handle:string)=>"/products?c="+encodeURIComponent(handle);
 return <>
 <section className="container pt-7 lg:pt-10 pb-9 lg:pb-12">
  <nav aria-label="Brödsmulor" className="pawlira-catalog-breadcrumb"><Link href="/">Hem</Link><FiChevronRight/><Link href="/products">Produkter</Link>{current&&<><FiChevronRight/><span aria-current="page">{current.title}</span></>}</nav>
  <div className={`pawlira-catalog-hero ${heroImage?"has-image":""}`}><div className="pawlira-catalog-hero-copy"><p className="pawlira-eyebrow">Pawlira · Sortiment</p><h1>{query?"Sökresultat":current?.title||"Upptäck sortimentet."}</h1><p>{query?`Resultat för ”${query}”`:current?(current.description?.trim()||categoryEditorial(current.title,current.handle).description):"Smart teknik och genomtänkt design för din katts vardag."}</p>{current&&<Link href="/products" className="pawlira-text-link">Visa hela sortimentet<FiArrowUpRight size={19}/></Link>}</div>{heroImage&&<div className="pawlira-catalog-hero-image"><Image src={heroImage} alt={current?.title||"Pawlira produkt"} fill sizes="(max-width: 767px) 90vw, 50vw" className="object-contain"/></div>}</div>
 </section>
 {categories.length>0&&<section className="container pb-9"><div className="pawlira-category-tabs" aria-label="Produktkategorier"><Link href="/products" aria-current={!current?"page":undefined}><FiGrid size={18}/> Alla produkter</Link>{categories.map(c=><Link href={categoryUrl(c.handle)} key={c.handle} aria-current={current?.handle===c.handle?"page":undefined}>{c.title}<FiArrowUpRight size={16}/></Link>)}</div></section>}
 <Suspense><ProductLayouts {...filterProps}/></Suspense>
 <div className="container pb-14 lg:pb-24"><div className="pawlira-catalog-layout"><aside className="pawlira-catalog-sidebar"><Suspense><ProductFilters {...filterProps}/></Suspense></aside><div className="min-w-0">{one(searchParams.layout)==="list"?<ProductListView key={key} searchParams={searchParams} initialData={initialData}/>:<ProductCardView key={key} searchParams={searchParams} initialData={initialData}/>}</div></div></div>
 </>;
}
export default async function ProductsListPage({searchParams}:{searchParams:Promise<SearchParams>}){
 return <Suspense fallback={<LoadingProducts/>}><ShowProducts searchParams={await searchParams}/></Suspense>;
}
