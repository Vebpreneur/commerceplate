import LoadingProducts from "@/components/loadings/skeleton/SkeletonProducts";
import ProductLayouts from "@/components/product/ProductLayouts";
import {getCollections} from "@/lib/shopify";
import {getCatalogPage} from "@/lib/shopify/catalog";
import ProductCardView from "@/partials/ProductCardView";
import ProductListView from "@/partials/ProductListView";
import {Suspense} from "react";
import Link from "next/link";
import {LuArrowUpRight as FiArrowUpRight,LuLayoutGrid as FiGrid,LuChevronRight as FiChevronRight} from "react-icons/lu";
import type {Collection} from "@/lib/shopify/types";
import {categoryName} from "@/lib/utils/modelName";

type SearchParams=Record<string,string|string[]|undefined>;
type Category=Collection;
const one=(v:SearchParams[string])=>Array.isArray(v)?v[0]:v;
export const metadata={title:"Produkter | Pawlira",description:"Upptäck Pawliras sortiment av smarta kattprodukter."};

async function ShowProducts({searchParams:rawParams}:{searchParams:SearchParams}){
 const searchParams={c:rawParams.c,q:rawParams.q,sort:rawParams.sort,layout:rawParams.layout};
 const [initialData,allCategories]=await Promise.all([getCatalogPage(searchParams),getCollections().catch(()=>[])]);
 const categories=(allCategories as Category[]).filter(c=>!["frontpage","home-page","homepage","featured-products","all"].includes(c.handle)&&!c.handle.startsWith("hidden-")&&c.title.toLowerCase()!=="home page").map(c=>({...c,title:categoryName(c.title)}));
 const current=categories.find(c=>c.handle===one(searchParams.c));
 const query=one(searchParams.q);
 const key=JSON.stringify(searchParams);
 const categoryDescription=current?(/kattlå|kattla|litter/i.test(current.title+" "+current.handle)?"Automatiska kattlådor med olika kapacitet, rengöringsfunktioner och styralternativ.":/foder|feed/i.test(current.title+" "+current.handle)?"Foderautomater med olika behållarvolymer, portionsinställningar och styralternativ.":/vatten|fontän|fountain/i.test(current.title+" "+current.handle)?"Vattenfontäner med olika behållarvolymer, filterlösningar och material.":current.title):"Självrengörande kattlådor, foderautomater och vattenfontäner." ;
 const categoryUrl=(handle:string)=>"/products?c="+encodeURIComponent(handle);
 return <>
 <section className="container pt-7 lg:pt-10 pb-9 lg:pb-12">
  <nav aria-label="Brödsmulor" className="pawlira-catalog-breadcrumb"><Link href="/">Hem</Link><FiChevronRight strokeWidth={1.5}/><Link href="/products">Produkter</Link>{current&&<><FiChevronRight strokeWidth={1.5}/><span aria-current="page">{current.title}</span></>}</nav>
  <div className="pawlira-catalog-hero"><div className="pawlira-catalog-hero-copy"><h1>{query?"Sökresultat":current?.title||"Alla produkter"}</h1><p>{query?`Resultat för ”${query}”`:categoryDescription}</p></div></div>
 </section>
 {categories.length>0&&<section className="container pb-9"><div className="pawlira-category-tabs" aria-label="Produktkategorier"><Link href="/products" aria-current={!current?"page":undefined}><FiGrid size={18} strokeWidth={1.5}/> Alla produkter</Link>{categories.map(c=><Link href={categoryUrl(c.handle)} key={c.handle} aria-current={current?.handle===c.handle?"page":undefined}>{c.title}<FiArrowUpRight size={16} strokeWidth={1.5}/></Link>)}</div></section>}
 <Suspense><ProductLayouts/></Suspense>
 <div className="container pb-14 lg:pb-24"><div className="pawlira-catalog-layout pawlira-catalog-full"><div className="min-w-0">{one(searchParams.layout)==="list"?<ProductListView key={key} searchParams={searchParams} initialData={initialData}/>:<ProductCardView key={key} searchParams={searchParams} initialData={initialData}/>}</div></div></div>
 </>;
}
export default async function ProductsListPage({searchParams}:{searchParams:Promise<SearchParams>}){
 return <Suspense fallback={<LoadingProducts/>}><ShowProducts searchParams={await searchParams}/></Suspense>;
}
