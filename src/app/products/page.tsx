import LoadingProducts from "@/components/loadings/skeleton/SkeletonProducts";
import ProductLayouts from "@/components/product/ProductLayouts";
import {getCollections} from "@/lib/shopify";
import {getCatalogPage} from "@/lib/shopify/catalog";
import ProductCardView from "@/partials/ProductCardView";
import ProductListView from "@/partials/ProductListView";
import {Suspense} from "react";
import Link from "next/link";
import {LuChevronDown,LuChevronRight} from "react-icons/lu";
import Accordion from "@/shortcodes/Accordion";
import type {Collection} from "@/lib/shopify/types";
import {categoryName} from "@/lib/utils/modelName";

type SearchParams=Record<string,string|string[]|undefined>;
type Category=Collection;
const one=(v:SearchParams[string])=>Array.isArray(v)?v[0]:v;
export const metadata={title:"Produkter | Pawlira",description:"Upptäck Pawliras sortiment av smarta kattprodukter."};

async function ShowProducts({searchParams:rawParams}:{searchParams:SearchParams}){
 const searchParams={c:rawParams.c,q:rawParams.q,sort:rawParams.sort,layout:rawParams.layout,sale:rawParams.sale};
 const [initialData,allCategories]=await Promise.all([getCatalogPage(searchParams),getCollections().catch(()=>[])]);
 const categories=(allCategories as Category[]).filter(c=>!["frontpage","home-page","homepage","featured-products","all"].includes(c.handle)&&!c.handle.startsWith("hidden-")&&c.title.toLowerCase()!=="home page").map(c=>({...c,title:categoryName(c.title)}));
 const current=categories.find(c=>c.handle===one(searchParams.c));
 const query=one(searchParams.q);
 const sale=one(searchParams.sale)==="1";
 const key=JSON.stringify(searchParams);
 const categoryDescription=current?(/kattlå|kattla|litter/i.test(current.title+" "+current.handle)?"Automatiska kattlådor med olika kapacitet, rengöringsfunktioner och styralternativ.":/foder|feed/i.test(current.title+" "+current.handle)?"Foderautomater med olika behållarvolymer, portionsinställningar och styralternativ.":/vatten|fontän|fountain/i.test(current.title+" "+current.handle)?"Vattenfontäner med olika behållarvolymer, filterlösningar och material.":current.title):"Självrengörande kattlådor, foderautomater och vattenfontäner." ;
 const categoryUrl=(handle?:string)=>{const next=new URLSearchParams();if(handle)next.set("c",handle);if(sale)next.set("sale","1");if(query)next.set("q",query);const sort=one(searchParams.sort);if(sort)next.set("sort",sort);const layout=one(searchParams.layout);if(layout)next.set("layout",layout);return "/products"+(next.size?"?"+next.toString():"");};
 const label=current?.title||"smarta kattprodukter";
 const isLitter=!!current&&/kattlå|kattla|litter/i.test(current.title+" "+current.handle);
 const isFeeder=!!current&&/foder|feed/i.test(current.title+" "+current.handle);
 const isWater=!!current&&/vatten|fontän|fountain/i.test(current.title+" "+current.handle);
 const questions=isLitter?[["Hur väljer jag rätt självrengörande kattlåda?","Utgå från kattens storlek, lådans öppning och innermått. Jämför kapacitet, rengöringsfunktioner och modellens användningsgränser."],["Vilken kattsand kan jag använda?","Kompatibla strötyper varierar mellan modeller. Produktinformationen och manualen anger rekommenderad typ och fyllnadsnivå."]]:isFeeder?[["Vilken foderautomat passar min katt?","Jämför behållarens volym, portionsinställningar och antalet måltider som går att schemalägga."],["Behöver en foderautomat Wi-Fi?","Vissa modeller har appstyrning, andra styrs med knappar eller timer. Se produktens specifikationer."]]:isWater?[["Hur väljer jag rätt vattenfontän?","Jämför volym, material, filter och hur lätt de löstagbara delarna är att rengöra."],["Hur rengör jag vattenfontänen?","Följ modellens instruktioner för rengöring och filterbyte. Byt vatten regelbundet."]]:[["Vilken produkt passar min katt?","Utgå från kattens storlek, vanor och utrymmet i ditt hem. Jämför mått, kapacitet och funktioner på respektive produktsida."],["Vad kostar frakten inom Sverige?","Frakten är kostnadsfri vid beställning till Sverige. Du hittar ytterligare information i våra leveransvillkor."]];
 return <div className="pawlira-catalog-page">
 <section className="pawlira-catalog-intro"><div className="container pawlira-catalog-width"><h1>{query?"Sökresultat":sale?(current?`Kampanjer – ${current.title}`:"Kampanjer"):current?.title||"Alla produkter"}</h1><p>{query?`Resultat för ”${query}”`:sale?"Upptäck aktuella erbjudanden i vårt sortiment.":categoryDescription}</p></div></section>
 <div className="container pawlira-catalog-width pawlira-catalog-whisker-layout">
 <aside className="pawlira-catalog-category-menu" aria-label="Produktkategorier"><h2>Kategorier</h2><nav><Link className="pawlira-catalog-all" href={categoryUrl()} aria-current={!current?"page":undefined}>Alla produkter<LuChevronRight size={17} strokeWidth={1.5}/></Link><details open><summary>Smarta kattprodukter<LuChevronDown size={17} strokeWidth={1.5}/></summary><div className="pawlira-catalog-subcategories">{categories.map(c=><Link href={categoryUrl(c.handle)} key={c.handle} aria-current={current?.handle===c.handle?"page":undefined}>{c.title}</Link>)}</div></details><Link className="pawlira-catalog-all" href={sale?"/products":"/products?sale=1"} aria-current={sale?"page":undefined}>{sale?"Visa ordinarie sortiment":"Kampanjer"}<LuChevronRight size={17} strokeWidth={1.5}/></Link></nav></aside>
 <div className="pawlira-catalog-results min-w-0"><Suspense><ProductLayouts/></Suspense>{one(searchParams.layout)==="list"?<ProductListView key={key} searchParams={searchParams} initialData={initialData}/>:<ProductCardView key={key} searchParams={searchParams} initialData={initialData}/>}</div>
 </div>
 <section className="container pawlira-catalog-width pawlira-catalog-faq"><h2>Vanliga frågor</h2>{questions.map(([q,a])=><Accordion key={q} title={q}><p>{a}</p></Accordion>)}</section>
 <section className="container pawlira-catalog-width pawlira-catalog-editorial"><h2>{current?`Hitta rätt bland våra ${label.toLocaleLowerCase("sv-SE")}`:"Smart kattvård för vardagen"}</h2><div><p>{categoryDescription}</p><h3>Välj efter din katts behov</h3><p>Jämför funktioner, mått och produktinformation för att hitta en modell som passar ditt hem. I vår <Link href={current?"/kopguide?c="+encodeURIComponent(current.handle):"/kopguide"}>köpguide</Link> hittar du mer information om vad som skiljer alternativen åt.</p><h3>En enklare vardag med Pawlira</h3><p>Utforska våra modeller och läs om rengöring, underhåll och tillgängliga varianter på respektive produktsida. Du kan också <Link href={current?"/compare?c="+encodeURIComponent(current.handle):"/compare"}>jämföra modeller</Link> eller kontakta vår <Link href="/contact">kundservice</Link>.</p></div></section>
 </div>;
}
export default async function ProductsListPage({searchParams}:{searchParams:Promise<SearchParams>}){
 return <Suspense fallback={<LoadingProducts/>}><ShowProducts searchParams={await searchParams}/></Suspense>;
}
