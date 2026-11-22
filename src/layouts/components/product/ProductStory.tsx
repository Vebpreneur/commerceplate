import Image from "next/image";
import Link from "next/link";
import type {Product} from "@/lib/shopify/types";
import type {ProductField} from "@/lib/utils/productFields";
import Accordion from "@/shortcodes/Accordion";
import FieldDetails from "./FieldDetails";

type DetailGroup={title:string;key:string;fallback:string};
const detailGroups:DetailGroup[]=[
 {title:"Tekniska specifikationer",key:"spec",fallback:"Tekniska värden för den här modellen saknas i den tillgängliga produktinformationen."},
 {title:"Kompatibilitet",key:"compatibility",fallback:"Kompatibilitet är inte specificerad. Kontrollera produktens mått, anslutningar och eventuella krav mot förutsättningarna i ditt hem."},
 {title:"Användning och underhåll",key:"usage",fallback:"Följ produktens bruksanvisning för montering, användning och rengöring. Koppla från strömmen när tillverkarens instruktioner kräver det."},
 {title:"Säkerhetsinformation",key:"safety",fallback:"Följ produktens säkerhetsanvisningar och angivna gränser för användning. Automatisk drift ersätter inte tillsyn."},
];

export function productStoryImages(product:Product){
 const images=Array.from(new Map(product.images.filter(image=>image.url).map(image=>[image.url.split("?")[0],image])).values());
 const main=images[1]||images[0]||product.featuredImage;
 const gallery=images.filter(image=>image.url!==main?.url&&image.url!==images[0]?.url).slice(0,6);
 return {main,gallery};
}

function separateTechnicalItems(html:string){
 const items=[...html.matchAll(/<li\b[^>]*>[\s\S]*?<\/li\s*>/gi)].map(match=>match[0]);
 const technical=items.filter(item=>/(?:\d[\d.,]*\s?(?:kg|g|l|ml|liter|litre|db|ghz|hz|w|v|cm|mm)\b|wi[ -]?fi|\bsensor(?:er)?\b)/i.test(item.replace(/<[^>]*>/g," ")));
 return technical.length?"<ul>"+technical.join("")+"</ul>":"";
}

function ProductDetailsEditorial(){
 const rows=[
  {title:"Genomtänkt teknik för livet med katt",paragraphs:["På Pawlira samlar vi moderna, automatiserade produkter som förenklar kattägarens vardag och skapar en ren, trygg och trivsam miljö för katten. Varje produkt i sortimentet är utvald för att lösa verkliga vardagsbehov i hemmet.","Oavsett om du bor i en mindre lägenhet eller i ett hem med flera katter kan du jämföra mått, kapacitet och funktioner för att hitta den lösning som passar bäst."]},
  {title:"Självrengörande kattlådor",paragraphs:["Att skopa kattlådan för hand varje dag tar tid. En självrengörande kattlåda separerar automatiskt klumpar och avfall från den rena kattsanden efter kattens besök och samlar det i en sluten avfallsbehållare.","Resultatet är en fräsch sandbädd inför varje nytt besök, bättre luktkontroll i hemmet och mindre dagligt underhåll. Utforska våra modeller i kategorin eller jämför dem sida vid sida."]},
  {title:"Automatiska foderautomater",paragraphs:["Katter mår bra av regelbundna måltider och jämna portioner. Med en foderautomat kan du schemalägga dagens utfodringar så att katten får mat på fasta tider – både tidiga morgnar och när du inte är hemma.","Jämför våra foderautomater utifrån behållarvolym, antal måltider per dygn, foderstorlek och om du föredrar appstyrning eller enkel programmering direkt på enheten."]},
  {title:"Vattenfontäner och filtrering",paragraphs:["Många katter föredrar rinnande vatten framför stillastående vatten i en skål. En vattenfontän håller vattnet i cirkulation och filtrerar bort partiklar för att uppmuntra katten att dricka mer under dagen.","I vårt sortiment hittar du vattenfontäner med olika volymer, material och filterlösningar som är enkla att plocka isär och rengöra."]},
  {title:"Säkerhet och rätt modellval",paragraphs:["Kattens säkerhet och trivsel kommer alltid först. Självrengörande kattlådor är utrustade med sensorer som känner av när katten befinner sig i eller nära lådan och pausar rengöringscykeln.","Kontrollera alltid tillverkarens angivna vikt- och åldersgränser på produktsidan, och följ manualens råd för en lugn introduktion i kattens egen takt."]},
  {title:"Köpguide och modelljämförelse",paragraphs:[<>Behöver du vägledning innan du bestämmer dig? I vår interaktiva <Link href="/kopguide"><strong>köpguide</strong></Link> går vi igenom de viktigaste sakerna att kontrollera inför köpet av kattlåda, foderautomat eller vattenfontän.</>,<>Du kan även använda vårt <Link href="/compare"><strong>jämförelseverktyg</strong></Link> för att ställa upp till tre modeller bredvid varandra och jämföra pris, mått och specifikationer rad för rad.</>]},
  {title:"Fri frakt, villkor och kundservice",paragraphs:[<>Alla beställningar hos Pawlira levereras med fri frakt inom Sverige. Information om leverans, spårning och aktuella villkor hittar du under <Link href="/shipping-policy"><strong>Leverans</strong></Link> samt <Link href="/refund-policy"><strong>Retur och ångerrätt</strong></Link>.</>,<>Har du frågor om en specifik modell, underhåll eller din beställning är du alltid välkommen att kontakta vår <Link href="/contact"><strong>kundservice</strong></Link>.</>]}
 ];
 return <section className="container pawlira-catalog-width pawlira-catalog-editorial-list pawlira-product-detail-editorial" aria-label="Produkt- och kategoriinformation">{rows.map(row=><article key={row.title} className="pawlira-catalog-editorial-row"><h2>{row.title}</h2><div className="pawlira-catalog-editorial-copy">{row.paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div></article>)}</section>;
}

export default function ProductStory({product,fields,descriptionHtml}:{product:Product;fields:ProductField[];descriptionHtml:string}){
 const {main,gallery}=productStoryImages(product);
 const visibleImages=[...(main?[main]:[]),...gallery];
 const specs=fields.filter(field=>field.key==="spec");
 const descriptionSpecs=separateTechnicalItems(descriptionHtml);
 const fieldContent=(key:string)=>fields.filter(field=>field.key===key);

 return <>
  {visibleImages.length>0&&<section id="produktbilder" className="container pawlira-home-section scroll-mt-32"><div className="pawlira-section-heading"><div><h2>Produktbilder</h2></div></div><div className="pawlira-story-gallery">{visibleImages.map((image,index)=><div className={"pawlira-story-gallery-image "+(index===0&&visibleImages.length%2===1?"pawlira-story-gallery-wide":"")} key={image.url}><Image src={image.url} alt={image.altText||product.title} fill sizes="(max-width: 767px) 90vw, 50vw" className="object-contain"/></div>)}</div></section>}
  <section id="produktinformation" className="container pawlira-catalog-width pawlira-catalog-faq scroll-mt-32">
   <h2>Produktdetaljer</h2>
   <div className="pawlira-catalog-faq-list pawlira-product-detail-accordions">
    {detailGroups.map(group=>{
     const matched=group.key==="spec"?specs:fieldContent(group.key);
     const value=matched.map(field=>field.value).join("\n\n");
     const content=group.key==="spec"&&!value?descriptionSpecs:"";
     const contentId=group.key==="spec"?"specifikationer":undefined;
     return <div id={contentId} key={group.key}><Accordion title={group.title}>{value?<div className="space-y-4">{matched.map((field,index)=><div key={field.key+field.title+index}><FieldDetails value={field.value}/></div>)}</div>:content?<div className="content" dangerouslySetInnerHTML={{__html:content}}/>:<p>{group.fallback}</p>}</Accordion></div>;
    })}
   </div>
  </section>
  <ProductDetailsEditorial/>
 </>;
}
