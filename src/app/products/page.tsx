import LoadingProducts from "@/components/loadings/skeleton/SkeletonProducts";
import ProductLayouts from "@/components/product/ProductLayouts";
import {getCollections} from "@/lib/shopify";
import {getCatalogPage} from "@/lib/shopify/catalog";
import ProductCardView from "@/partials/ProductCardView";
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
 const searchParams={c:rawParams.c,q:rawParams.q,sort:rawParams.sort,sale:rawParams.sale};
 const [initialData,allCategories]=await Promise.all([getCatalogPage(searchParams),getCollections().catch(()=>[])]);
 const categories=(allCategories as Category[]).filter(c=>!["frontpage","home-page","homepage","featured-products","all"].includes(c.handle)&&!c.handle.startsWith("hidden-")&&c.title.toLowerCase()!=="home page").map(c=>({...c,title:categoryName(c.title)}));
 const current=categories.find(c=>c.handle===one(searchParams.c));
 const query=one(searchParams.q);
 const sale=one(searchParams.sale)==="1";
 const key=JSON.stringify(searchParams);
 const categoryDescription=current?(/kattlå|kattla|litter/i.test(current.title+" "+current.handle)?"Automatiska kattlådor med olika kapacitet, rengöringsfunktioner och styralternativ.":/foder|feed/i.test(current.title+" "+current.handle)?"Foderautomater med olika behållarvolymer, portionsinställningar och styralternativ.":/vatten|fontän|fountain/i.test(current.title+" "+current.handle)?"Vattenfontäner med olika behållarvolymer, filterlösningar och material.":current.title):"Självrengörande kattlådor, foderautomater och vattenfontäner.";
 const categoryUrl=(handle?:string,saleMode=false)=>{const next=new URLSearchParams();if(handle)next.set("c",handle);if(saleMode)next.set("sale","1");if(query)next.set("q",query);const sort=one(searchParams.sort);if(sort)next.set("sort",sort);return "/products"+(next.size?"?"+next.toString():"");};
 const isLitter=!!current&&/kattlå|kattla|litter/i.test(current.title+" "+current.handle);
 const isFeeder=!!current&&/foder|feed/i.test(current.title+" "+current.handle);
 const isWater=!!current&&/vatten|fontän|fountain/i.test(current.title+" "+current.handle);
 const questions=isLitter?[
  ["Hur väljer jag rätt självrengörande kattlåda?","Utgå från kattens storlek, lådans öppning och innermått. Jämför kapacitet, rengöringsfunktioner och modellens angivna vikt- och åldersgränser på produktsidan."],
  ["Vilken kattsand kan jag använda?","Kompatibla strötyper varierar mellan modeller. Produktinformationen och manualen anger rekommenderad strötyp, kornstorlek och fyllnadsnivå."],
  ["Hur vänjer jag min katt vid en självrengörande kattlåda?","Placera den nya lådan på en lugn plats, gärna nära kattens tidigare låda i början. Låt katten utforska i sin egen takt och följ modellens instruktioner för introduktion."],
  ["Vad ingår när jag beställer och hur fungerar leveransen?","På respektive produktsida ser du vad som ingår i förpackningen. Alltid fri frakt vid leverans inom Sverige."]
 ]:isFeeder?[
  ["Vilken foderautomat passar min katt?","Jämför behållarens volym i liter, portionsinställningar, foderstorlek och antalet måltider som går att schemalägga per dygn."],
  ["Behöver en foderautomat Wi-Fi eller app?","Vissa modeller har appstyrning via Wi-Fi medan andra programmeras direkt på enheten med knappar och display. Se respektive produkts specifikationer."],
  ["Hur rengör jag foderautomaten?","Löstagbara matskålar och foderbehållare rengörs enligt modellens manual. Basenheten med elektronik och motor ska hållas torr."],
  ["Fungerar foderautomaten vid strömavbrott?","Många modeller har plats för reservbatterier som komplement till nätadaptern. Kontrollera strömförsörjningen i produktens tekniska specifikationer."]
 ]:isWater?[
  ["Hur väljer jag rätt vattenfontän?","Jämför vattenvolym, material (exempelvis rostfritt stål eller BPA-fri plast), ljudnivå och filterlösning utifrån kattens drickvanor."],
  ["Hur ofta behöver vatten och filter bytas?","Fyll på och byt vatten regelbundet samt rengör pump och skål enligt manualen. Byt filter enligt tillverkarens rekommenderade intervall."],
  ["Hur låter en vattenfontän i hemmet?","Vattenfontäner är konstruerade för tyst drift i hemmiljö. Om ljudnivån ökar beror det ofta på att vattennivån är låg eller att pumpen behöver sköljas ren."],
  ["Vad kostar frakten inom Sverige?","Frakten är alltid kostnadsfri vid beställning inom Sverige. Se våra leveransvillkor för mer information."]
 ]:[
  ["Hur väljer jag rätt produkt för min katt och mitt hem?","Utgå från kattens storlek, ålder och dagliga rutiner samt var i hemmet produkten ska placeras. På varje produktsida finns mått, kapacitet och tekniska specifikationer."],
  ["Kan produkterna styras via app eller direkt på enheten?","Beroende på modell sker styrningen via app, kontrollpanel på produkten eller automatiska sensorer. Kontrollera alltid specifikationen på produktsidan."],
  ["Hur fungerar leverans och fri frakt inom Sverige?","Vi erbjuder kostnadsfri frakt på beställningar inom Sverige. Leveransvillkor och spårningsinformation finns i kassan och på vår leveranssida."],
  ["Hur fungerar ångerrätt, retur och kundservice?","Läs våra fullständiga villkor under Retur och ångerrätt samt Köpvillkor. Vår kundservice hjälper dig gärna med både produktval och orderfrågor."]
 ];
 const editorialRows=[
  {
   title:"Genomtänkt teknik för livet med katt",
   paragraphs:[
    "På Pawlira samlar vi moderna, automatiserade produkter som förenklar kattägarens vardag och skapar en ren, trygg och trivsam miljö för katten. Varje produkt i sortimentet är utvald för att lösa verkliga vardagsbehov i hemmet.",
    "Oavsett om du bor i en mindre lägenhet eller i ett hem med flera katter kan du jämföra mått, kapacitet och funktioner för att hitta den lösning som passar bäst."
   ]
  },
  {
   title:"Självrengörande kattlådor",
   paragraphs:[
    "Att skopa kattlådan för hand varje dag tar tid. En självrengörande kattlåda separerar automatiskt klumpar och avfall från den rena kattsanden efter kattens besök och samlar det i en sluten avfallsbehållare.",
    "Resultatet är en fräsch sandbädd inför varje nytt besök, bättre luktkontroll i hemmet och mindre dagligt underhåll. Utforska våra modeller i kategorin eller jämför dem sida vid sida."
   ]
  },
  {
   title:"Automatiska foderautomater",
   paragraphs:[
    "Katter mår bra av regelbundna måltider och jämna portioner. Med en foderautomat kan du schemalägga dagens utfodringar så att katten får mat på fasta tider – både tidiga morgnar och när du inte är hemma.",
    "Jämför våra foderautomater utifrån behållarvolym, antal måltider per dygn, foderstorlek och om du föredrar appstyrning eller enkel programmering direkt på enheten."
   ]
  },
  {
   title:"Vattenfontäner och filtrering",
   paragraphs:[
    "Många katter föredrar rinnande vatten framför stillastående vatten i en skål. En vattenfontän håller vattnet i cirkulation och filtrerar bort partiklar för att uppmuntra katten att dricka mer under dagen.",
    "I vårt sortiment hittar du vattenfontäner med olika volymer, material och filterlösningar som är enkla att plocka isär och rengöra."
   ]
  },
  {
   title:"Säkerhet och rätt modellval",
   paragraphs:[
    "Kattens säkerhet och trivsel kommer alltid först. Självrengörande kattlådor är utrustade med sensorer som känner av när katten befinner sig i eller nära lådan och pausar rengöringscykeln.",
    "Kontrollera alltid tillverkarens angivna vikt- och åldersgränser på produktsidan, och följ manualens råd för en lugn introduktion i kattens egen takt."
   ]
  },
  {
   title:"Köpguide och modelljämförelse",
   paragraphs:[
    <>Behöver du vägledning innan du bestämmer dig? I vår interaktiva <Link href={current?"/kopguide?c="+encodeURIComponent(current.handle):"/kopguide"}>köpguide</Link> går vi igenom de viktigaste sakerna att kontrollera inför köpet av kattlåda, foderautomat eller vattenfontän.</>,
    <>Du kan även använda vårt <Link href={current?"/compare?c="+encodeURIComponent(current.handle):"/compare"}>jämförelseverktyg</Link> för att ställa upp till tre modeller bredvid varandra och jämföra pris, mått och specifikationer rad för rad.</>
   ]
  },
  {
   title:"Fri frakt, villkor och kundservice",
   paragraphs:[
    <>Alla beställningar hos Pawlira levereras med fri frakt inom Sverige. Information om leverans, spårning och aktuella villkor hittar du under <Link href="/shipping-policy">Leverans</Link> samt <Link href="/refund-policy">Retur och ångerrätt</Link>.</>,
    <>Har du frågor om en specifik modell, underhåll eller din beställning är du alltid välkommen att kontakta vår <Link href="/contact">kundservice</Link>.</>
   ]
  }
 ];
 return <div className="pawlira-catalog-page">
 <section className="pawlira-catalog-intro"><div className="container pawlira-catalog-width"><h1>{query?"Sökresultat":sale?(current?`Kampanjer – ${current.title}`:"Kampanjer"):current?.title||"Alla produkter"}</h1><p>{query?`Resultat för ”${query}”`:sale?"Upptäck aktuella erbjudanden i vårt sortiment.":categoryDescription}</p></div></section>
 <div className="container pawlira-catalog-width pawlira-catalog-whisker-section">
  <div className="pawlira-catalog-top-row">
   <h2>Kategorier</h2>
   <Suspense><ProductLayouts/></Suspense>
  </div>
  <div className="pawlira-catalog-whisker-layout">
   <aside className="pawlira-catalog-category-menu" aria-label="Produktkategorier">
    <nav>
     <details className="pawlira-catalog-group" open>
      <summary><span>Smarta kattprodukter</span><LuChevronDown size={18} strokeWidth={1.75}/></summary>
      <div className="pawlira-catalog-subcategories">
       <Link href={categoryUrl()} aria-current={!current&&!sale?"page":undefined}>Visa alla produkter</Link>
       {categories.map(c=><Link href={categoryUrl(c.handle)} key={c.handle} aria-current={current?.handle===c.handle&&!sale?"page":undefined}>{c.title}</Link>)}
      </div>
     </details>
     {categories.map(c=><Link key={"top-"+c.handle} className="pawlira-catalog-row-link" href={categoryUrl(c.handle)} aria-current={current?.handle===c.handle&&!sale?"page":undefined}><span>{c.title}</span><LuChevronRight size={18} strokeWidth={1.75}/></Link>)}
     <Link className="pawlira-catalog-row-link" href="/compare"><span>Jämför modeller</span><LuChevronRight size={18} strokeWidth={1.75}/></Link>
     <Link className="pawlira-catalog-row-link" href={current?"/kopguide?c="+encodeURIComponent(current.handle):"/kopguide"}><span>Köpguide</span><LuChevronRight size={18} strokeWidth={1.75}/></Link>
     <Link className="pawlira-catalog-row-link is-sale" href={sale?categoryUrl(current?.handle,false):categoryUrl(current?.handle,true)} aria-current={sale?"page":undefined}><span>Kampanjer</span><LuChevronRight size={18} strokeWidth={1.75}/></Link>
    </nav>
   </aside>
   <div className="pawlira-catalog-results min-w-0">
    <ProductCardView key={key} searchParams={searchParams} initialData={initialData}/>
   </div>
  </div>
 </div>
 <section className="container pawlira-catalog-width pawlira-catalog-faq"><h2>Vanliga frågor</h2><div className="pawlira-catalog-faq-list">{questions.map(([q,a])=><Accordion key={q} title={q}><p>{a}</p></Accordion>)}</div></section>
 <section className="container pawlira-catalog-width pawlira-catalog-editorial-list" aria-label="Produkt- och kategoriinformation">
  {editorialRows.map(row=><article key={row.title} className="pawlira-catalog-editorial-row">
   <h2>{row.title}</h2>
   <div className="pawlira-catalog-editorial-copy">
    {row.paragraphs.map((p,i)=><p key={i}>{p}</p>)}
   </div>
  </article>)}
 </section>
 </div>;
}
export default async function ProductsListPage({searchParams}:{searchParams:Promise<SearchParams>}){
 return <Suspense fallback={<LoadingProducts/>}><ShowProducts searchParams={await searchParams}/></Suspense>;
}
