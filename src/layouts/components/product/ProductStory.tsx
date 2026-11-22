import Image from "next/image";
import Link from "next/link";
import type {ReactNode} from "react";
import type {Product} from "@/lib/shopify/types";
import type {ProductField} from "@/lib/utils/productFields";
import Accordion from "@/shortcodes/Accordion";
import FieldDetails from "./FieldDetails";

export type ProductFamily="litter"|"feeder"|"water"|"other";
type EditorialRow={title:string;paragraphs:ReactNode[]};
const familyInfo={
 litter:{
  label:"Självrengörande kattlådor",heading:"Mer tid tillsammans. Mindre tid åt rengöring.",
  introduction:"Utforska hur en automatisk kattlåda kan förenkla delar av den dagliga rengöringen. Storlek, strötyp och rengöringsfunktioner skiljer sig mellan modeller.",
  use:"Placera kattlådan stabilt och ge katten tid att vänja sig. Kontrollera kompatibel kattsand, fyllnadsnivå och rengöring av avfallsbehållaren i modellens instruktioner.",
  safety:"Följ modellens vikt- och åldersgränser och instruktioner för introduktion. Kontrollera hur sensorer och automatisk rengöring fungerar på just den här modellen. Använd inte automatisk drift när modellen inte är lämplig för katten.",
  chapter:"Ett enklare sätt att ta hand om kattlådan",
  chapterText:"Jämför modellens faktiska öppning, invändiga utrymme, avfallsbehållare och rekommenderade strötyp. En bra lösning ska fungera för både katten och hemmet."
 },
 feeder:{
  label:"Foderautomater",heading:"Måltider som passar kattens vardag.",
  introduction:"En automatisk foderautomat kan göra utfodringsrutiner mer förutsägbara. Behållarvolym, portionsinställningar och tillgängliga styralternativ varierar.",
  use:"Kontrollera vilken fodertyp och storlek automaten stöder. Rengör matbehållare och löstagbara delar enligt manualen och testa portionsstorleken innan ett schema används.",
  safety:"Följ produktens instruktioner för elanslutning, batterier och foderförvaring. Kontrollera regelbundet att automaten matar ut rätt mängd och att katten får sitt foder. Automaten ersätter inte tillsyn.",
  chapter:"Rätt portion vid rätt tillfälle",
  chapterText:"Utgå från kattens rutiner och jämför volym, antal schemalagda måltider, strömförsörjning och hur de delar som kommer i kontakt med fodret rengörs."
 },
 water:{
  label:"Vattenfontäner",heading:"Vatten i rörelse – för kattens vardag.",
  introduction:"En vattenfontän kan hålla vattnet i cirkulation. Jämför behållarvolym, material, filtrering och hur den rengörs.",
  use:"Fyll på och byt vatten regelbundet. Rengör pump, filterhållare och andra delar enligt manualen; kontrollera vilka filter och reservdelar som passar modellen.",
  safety:"Följ produktens instruktioner för pump, vattennivå och strömförsörjning. Koppla från strömmen vid rengöring enligt manualen, och låt inte pumpen köras med för låg vattennivå om modellen inte stöder det.",
  chapter:"Utformad för enklare vattenrutiner",
  chapterText:"Kontrollera volym, filterlösning, underhållsbehov och var fontänen får placeras. Låt katten vänja sig vid ljud och vattenflöde i egen takt."
 },
 other:{
  label:"Smarta kattprodukter",heading:"Smarta detaljer för livet med katt.",
  introduction:"Jämför produktens faktiska funktioner, mått och skötselråd för att hitta en lösning som passar i hemmet.",
  use:"Följ anvisningarna för montering, drift, skötsel och eventuella förbrukningsdelar som gäller för den aktuella produkten.",
  safety:"Använd produkten enligt dess instruktioner. Kontrollera eventuella begränsningar och säkerhetsanvisningar för just den här modellen.",
  chapter:"Utgå från kattens behov",
  chapterText:"Jämför tydliga produktuppgifter och välj den variant som fungerar bäst för ditt hem."
 }
} as const;

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

function ProductDetailsEditorial({family}:{family:ProductFamily}){
 const info=familyInfo[family];
 const otherCategories=[
  {title:"Självrengörande kattlådor",text:"Utforska automatiserade alternativ för kattens toalett. Titta på öppning, invändigt utrymme, avfallsbehållare och modellens gränser för användning.",href:"/products"},
  {title:"Automatiska foderautomater",text:"Jämför lösningar för regelbundna måltider. Behållarvolym, portionsinställningar och hur enkelt delarna kan rengöras är viktiga skillnader.",href:"/products"},
  {title:"Vattenfontäner och filtrering",text:"Se skillnader i kapacitet, filter, material och rengöring för att hitta en drickplats som passar kattens vanor.",href:"/products"}
 ];
 const rows:EditorialRow[]=[
  {title:"Genomtänkt teknik för livet med katt",paragraphs:["Pawlira samlar smarta produkter som kan förenkla vardagens rutiner. Vi lyfter fram produktuppgifter som hjälper dig att göra ett genomtänkt val.","Utgå från kattens behov och hemmets förutsättningar. Se den aktuella modellens specifikationer och användningsinstruktioner före köp."]},
  {title:info.label,paragraphs:[info.introduction,info.chapterText]},
  ...otherCategories.filter(row=>row.title!==info.label).map(row=>({title:row.title,paragraphs:[row.text,<>Vill du jämföra andra produktkategorier? <Link href={row.href}>Utforska sortimentet</Link> och välj den kategori som passar.</>]})),
  {title:"Säkerhet och rätt modellval",paragraphs:[info.safety,"Tekniska gränser och säkerhetsfunktioner kan skilja sig mellan modeller. Följ alltid de instruktioner som hör till den aktuella produkten."]},
  {title:"Köpguide och modelljämförelse",paragraphs:[<>Behöver du vägledning innan du bestämmer dig? I vår <Link href="/kopguide"><strong>köpguide</strong></Link> finns en praktisk genomgång av vad du bör kontrollera inför ett köp.</>,<>Använd vårt <Link href="/compare"><strong>jämförelseverktyg</strong></Link> för att jämföra produkter, varianter och tillgängliga specifikationer sida vid sida.</>]},
  {title:"Fri frakt, villkor och kundservice",paragraphs:[<>Pawlira erbjuder fri frakt inom Sverige. Läs mer under <Link href="/shipping-policy"><strong>Leverans</strong></Link> och <Link href="/refund-policy"><strong>Retur och ångerrätt</strong></Link>.</>,<>Har du frågor om en modell, underhåll eller din beställning kan du kontakta <Link href="/contact"><strong>kundservice</strong></Link>.</>]}
 ];
 return <section className="container pawlira-catalog-width pawlira-catalog-editorial-list pawlira-product-detail-editorial" aria-label="Produkt- och kategoriinformation">{rows.map(row=><article key={row.title} className="pawlira-catalog-editorial-row"><h2>{row.title}</h2><div className="pawlira-catalog-editorial-copy">{row.paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div></article>)}</section>;
}

function ProductShowcase({product,family}:{product:Product;family:ProductFamily}){
 const info=familyInfo[family];
 const photos=Array.from(new Map(product.images.filter(image=>image.url).map(image=>[image.url.split("?")[0],image])).values());
 if(photos.length<2)return null;
 const lead=photos[1]||photos[0];
 const secondary=photos.length>3?photos[3]:photos[2]||photos[0];
 return <div className="pawlira-pdp-showcase">
  <section className="pawlira-pdp-showcase-band" aria-labelledby="pawlira-showcase-title">
   <div className="container pawlira-pdp-showcase-inner">
    <div className="pawlira-pdp-showcase-copy"><p className="pawlira-eyebrow">{info.label}</p><h2 id="pawlira-showcase-title">{info.heading}</h2><p>{info.introduction}</p><Link href="#produktinformation" className="pawlira-pdp-showcase-link">Upptäck produktdetaljerna <span aria-hidden="true">↗</span></Link></div>
    <div className="pawlira-pdp-showcase-image"><Image src={lead.url} alt={lead.altText||product.title} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-contain"/></div>
   </div>
  </section>
  {secondary&&<section className="container pawlira-pdp-showcase-chapter"><div className="pawlira-pdp-showcase-image"><Image src={secondary.url} alt={secondary.altText||product.title} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-contain"/></div><div className="pawlira-pdp-showcase-copy"><p className="pawlira-eyebrow">För din vardag</p><h2>{info.chapter}</h2><p>{info.chapterText}</p></div></section>}
 </div>;
}

export default function ProductStory({product,fields,descriptionHtml,family="other"}:{product:Product;fields:ProductField[];descriptionHtml:string;family?:ProductFamily}){
 const {main,gallery}=productStoryImages(product);
 const visibleImages=[...(main?[main]:[]),...gallery];
 const byKey=(key:string)=>fields.filter(field=>field.key===key);
 const descriptionSpecs=separateTechnicalItems(descriptionHtml);
 const specs=byKey("spec");
 const accordionGroups=[
  {title:"Tekniska specifikationer",key:"spec",fallback:""},
  {title:"Funktioner och egenskaper",key:"features",fallback:""},
  {title:"Produktinformation",key:"details",fallback:""},
  {title:"Vad ingår i förpackningen?",key:"included",fallback:""},
  {title:"Kompatibilitet",key:"compatibility",fallback:""},
  {title:"Användning och underhåll",key:"usage",fallback:familyInfo[family].use},
  {title:"Säkerhetsinformation",key:"safety",fallback:familyInfo[family].safety}
 ].filter(group=>byKey(group.key).length>0||(group.key==="spec"&&!!descriptionSpecs)||!!group.fallback);
 return <>
  <ProductShowcase product={product} family={family}/>
  {visibleImages.length>0&&<section id="produktbilder" className="container pawlira-home-section scroll-mt-32"><div className="pawlira-section-heading"><div><h2>Produktbilder</h2></div></div><div className="pawlira-story-gallery">{visibleImages.map((image,index)=><div className={"pawlira-story-gallery-image "+(index===0&&visibleImages.length%2===1?"pawlira-story-gallery-wide":"")} key={image.url}><Image src={image.url} alt={image.altText||product.title} fill sizes="(max-width: 767px) 90vw, 50vw" className="object-contain"/></div>)}</div></section>}
  <section id="produktinformation" className="container pawlira-catalog-width pawlira-catalog-faq scroll-mt-32">
   <h2>Produktdetaljer</h2>
   <div className="pawlira-catalog-faq-list pawlira-product-detail-accordions">
    {accordionGroups.map(group=>{
     const matched=byKey(group.key);
     const content=group.key==="spec"&&!matched.length?descriptionSpecs:"";
     return <div id={group.key==="spec"?"specifikationer":undefined} key={group.key}><Accordion title={group.title}>{matched.length?<div className="space-y-4">{matched.map((field,index)=><div key={field.key+field.title+index}><FieldDetails value={field.value}/></div>)}</div>:content?<div className="content" dangerouslySetInnerHTML={{__html:content}}/>:<p>{group.fallback}</p>}</Accordion></div>;
    })}
   </div>
  </section>
  <ProductDetailsEditorial family={family}/>
 </>;
}
