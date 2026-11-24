import Image from "next/image";
import Link from "next/link";
import type {ReactNode} from "react";
import type {Product} from "@/lib/shopify/types";
import type {ProductField} from "@/lib/utils/productFields";
import Accordion from "@/shortcodes/Accordion";
import FieldDetails from "./FieldDetails";
import ProductSectionNav from "./ProductSectionNav";
import {LuShieldCheck,LuWandSparkles,LuPackageOpen,LuRuler,LuSmartphone,LuDroplets,LuUtensils,LuClipboardCheck} from "react-icons/lu";
import {specifications,findSpecification} from "@/lib/utils/productSpecifications";

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

const familyQuestions:Record<ProductFamily,{title:string;answer:string}[]>={
 litter:[
  {title:"Hur vet jag om en självrengörande kattlåda passar min katt?",answer:"Kontrollera modellens öppning, invändiga mått samt kattens vikt och ålder mot produktens användningsgränser. Låt katten bekanta sig med lådan i lugn takt."},
  {title:"Vilken kattsand kan jag använda?",answer:"Strötyp och rekommenderad fyllnadsnivå skiljer sig mellan modeller. Läs produktens specifikationer och manual innan du fyller på."},
  {title:"Hur ofta behöver avfallsbehållaren tömmas?",answer:"Det beror på behållarens kapacitet, hur många katter som använder lådan och hur ofta den används. Kontrollera avfallet regelbundet och följ modellens skötselråd."},
  {title:"Vilka säkerhetsfunktioner finns?",answer:"Sensorer och stoppfunktioner varierar mellan modeller. Produktens säkerhetsinformation och användningsgränser beskriver vad som gäller för den aktuella modellen."}
 ],
 feeder:[
  {title:"Vilket foder fungerar i automaten?",answer:"Kontrollera vilka fodertyper och storlekar som anges för den aktuella modellen. Använd inte andra typer om de inte stöds i manualen."},
  {title:"Hur ställer jag in portioner och måltider?",answer:"Antal måltider, portionsstorlek och inställningsmetod varierar. Följ den aktuella modellens instruktioner och kontrollera den mängd foder som faktiskt serveras."},
  {title:"Fungerar automaten utan Wi-Fi?",answer:"Det beror på modellen. Vissa kan styras med knappar eller timer och andra har appfunktioner. Läs anslutningskraven i produktspecifikationen."},
  {title:"Hur rengör jag en foderautomat?",answer:"Följ modellens skötselanvisningar för matbehållare och löstagbara delar. Håll elektroniska delar torra enligt manualen."}
 ],
 water:[
  {title:"Hur ofta behöver jag byta vattnet?",answer:"Byt och fyll på färskt vatten regelbundet. Följ modellens anvisningar för rengöring, särskilt i pump och vattenbehållare."},
  {title:"Vilka filter passar vattenfontänen?",answer:"Kontrollera vilken filtertyp som anges för modellen. Filter och bytesintervall kan skilja sig åt mellan olika vattenfontäner."},
  {title:"Hur rengör jag pumpen?",answer:"Koppla från strömmen enligt manualen och följ instruktionerna för demontering och rengöring av pump och andra delar."},
  {title:"Hur hjälper jag katten att vänja sig?",answer:"Placera gärna fontänen bredvid den vanliga vattenskålen och låt katten undersöka den i egen takt. Behåll tillgången till färskt vatten under introduktionen."}
 ],
 other:[
  {title:"Hur vet jag om produkten passar min katt?",answer:"Jämför produktens mått, användningsgränser och funktioner med kattens storlek, vanor och behoven hemma."},
  {title:"Vad ingår när jag beställer?",answer:"Vad som ingår varierar mellan modeller och varianter. Läs produktens specifikationer och förpackningsinnehåll."},
  {title:"Hur sköter jag produkten?",answer:"Följ den medföljande manualens instruktioner för användning, rengöring och eventuella förbrukningsdelar."},
  {title:"Var hittar jag fler uppgifter?",answer:"Se produktens tekniska specifikationer ovan eller kontakta kundservice om en viktig uppgift saknas."}
 ]
};

function ProductFaq({family,fields}:{family:ProductFamily;fields:ProductField[]}){
 const submitted=fields.filter(field=>field.key==="faq");
 return <section id="kundinformation" className="container pawlira-catalog-width pawlira-catalog-faq pawlira-product-faq scroll-mt-32" aria-labelledby="pawlira-product-faq-title"><h2 id="pawlira-product-faq-title">Vanliga frågor</h2><div className="pawlira-catalog-faq-list">
  {submitted.map((field,index)=><Accordion key={"custom-"+index} title={field.title==="Vanliga frågor"?"Frågor och svar för modellen":field.title}><FieldDetails value={field.value}/></Accordion>)}
  {familyQuestions[family].map(item=><Accordion key={item.title} title={item.title}><p>{item.answer}</p></Accordion>)}
 </div></section>;
}


type Feature={title:string;description:string;match:RegExp;Icon:typeof LuShieldCheck};
const featureCatalog:Record<ProductFamily,Feature[]>={
 litter:[
  {title:"Automatisk rengöring",description:"Läs hur just den här modellens rengöringscykel fungerar och hur avfallet tas om hand.",match:/^(rengöringsfunktion|rengöringssystem|rengöringscykel|cleaning system|cleaning cycle)$/i,Icon:LuWandSparkles},
  {title:"Sensorer och säkerhet",description:"Se modellens sensorer, användningsgränser och instruktioner för trygg introduktion.",match:/^(sensorer|säkerhetssensorer|säkerhetsfunktioner|viktsensorer|sensors|safety sensors)$/i,Icon:LuShieldCheck},
  {title:"Storlek och passform",description:"Jämför öppning, innermått och rekommenderad kattvikt med din katts behov.",match:/^(rekommenderad kattvikt|kattvikt|ingångshöjd|öppning|ingång|cat weight)$/i,Icon:LuRuler},
  {title:"Avfallsbehållare och skötsel",description:"Undersök behållarens kapacitet och vilka delar som behöver rengöras.",match:/^(avfallsbehållare|avfallsbehållarens kapacitet|kapacitet avfallsbehållare|waste capacity)$/i,Icon:LuPackageOpen},
  {title:"App och anslutning",description:"Läs modellens uppgifter om eventuell appstyrning, Wi-Fi och tillgängliga funktioner.",match:/^(uppkoppling|anslutning|wifi|wi-fi|app|appstyrning|connectivity)$/i,Icon:LuSmartphone}
 ],
 feeder:[
  {title:"Måltider och scheman",description:"Se hur portioner och tider ställs in på den aktuella automaten.",match:/^(måltider|schemaläggning|antal måltider|feeding schedule|portions)$/i,Icon:LuUtensils},
  {title:"Foderkapacitet",description:"Jämför behållarvolym och vilken typ av foder modellen stöder.",match:/^(foderkapacitet|kapacitet|behållarvolym|capacity)$/i,Icon:LuPackageOpen},
  {title:"Ström och anslutning",description:"Kontrollera vilka anslutnings- och strömförsörjningsalternativ som gäller för modellen.",match:/^(strömförsörjning|batteri|uppkoppling|anslutning|power supply)$/i,Icon:LuSmartphone},
  {title:"Rengöring och skötsel",description:"Läs vilka delar som kan tas loss och hur de rengörs.",match:/^(rengöring|underhåll|maintenance|cleaning)$/i,Icon:LuWandSparkles}
 ],
 water:[
  {title:"Kapacitet",description:"Jämför hur mycket vatten fontänen rymmer och hur den passar i hemmet.",match:/^(vattenkapacitet|kapacitet|volym|water capacity)$/i,Icon:LuDroplets},
  {title:"Filter och underhåll",description:"Kontrollera vilken filtertyp som används och hur den byts.",match:/^(filtertyp|filter|filtrering|filtration)$/i,Icon:LuClipboardCheck},
  {title:"Pump och drift",description:"Se information om pump, vattenflöde och eventuell ljudnivå.",match:/^(pump|vattenflöde|ljudnivå|noise level|water flow)$/i,Icon:LuWandSparkles},
  {title:"Säker användning",description:"Följ modellens uppgifter om vattennivå, placering och rengöring.",match:/^(säkerhetsfunktioner|safety|strömförsörjning|power supply)$/i,Icon:LuShieldCheck}
 ],
 other:[
  {title:"Funktioner",description:"Jämför funktionerna i den aktuella produktens beskrivning.",match:/^(funktioner|features)$/i,Icon:LuWandSparkles},
  {title:"Storlek och kapacitet",description:"Kontrollera modellens mått och kapacitet.",match:/^(mått|dimensioner|kapacitet|dimensions|capacity)$/i,Icon:LuRuler},
  {title:"Användning och skötsel",description:"Läs produktens anvisningar för vardaglig användning och underhåll.",match:/^(underhåll|rengöring|maintenance|cleaning)$/i,Icon:LuClipboardCheck}
 ]
};
function productEditorialImages(product:Product){
 const unique=Array.from(new Map(product.images.filter(i=>!!i.url).map(i=>[i.url.split("?")[0],i])).values());
 const match=(pattern:RegExp)=>unique.find(i=>pattern.test(i.altText||""));
 const large=match(/(detalj|feature|funktion|front|framsida|produkt)/i)||unique.find(i=>i.url!==product.featuredImage?.url)||product.featuredImage||unique[0];
 const lifestyle=match(/(lifestyle|vardagsrum|interiör|hemma|in home|room)/i)||unique.find(i=>i.url!==large?.url&&i.url!==product.featuredImage?.url)||large;
 return {large,lifestyle};
}
function ProductFeatureStage({product,family,fields}:{product:Product;family:ProductFamily;fields:ProductField[]}){
 const found=specifications(fields);
 const details=featureCatalog[family].map(item=>({...item,actual:findSpecification(found,item.match)}));
 const large=product.featuredImage?.url?product.featuredImage:productEditorialImages(product).large;
 return <section id="pdp-fordelar" className="pawlira-pdp-benefits" aria-labelledby="pawlira-pdp-benefits-heading">
  <div className="container pawlira-pdp-benefits-inner">
   <div className="pawlira-pdp-benefits-copy">
    <h2 id="pawlira-pdp-benefits-heading">{family==="litter"?"Enklare rutiner för dig och din katt.":family==="feeder"?"Måltider på kattens villkor.":family==="water"?"En bättre vattenrutin.":"Genomtänkt för vardagen."}</h2>
    <div className="pawlira-pdp-benefits-list">{details.map(({Icon,title,description,actual})=><article key={title} className="pawlira-pdp-benefit-row">
      <span className="pawlira-pdp-benefit-icon"><Icon size={29} strokeWidth={2.6} aria-hidden="true"/></span>
      <div><h3>{title}</h3><p>{actual||description}</p></div>
    </article>)}</div>
   </div>
   {large?.url&&<div className="pawlira-pdp-benefits-media"><Image src={large.url} alt={large.altText||product.title} fill sizes="(max-width: 767px) 90vw, 46vw" className="object-contain"/></div>}
  </div>
 </section>;
}

function ProductShowcase({product,family,hasRelated}:{product:Product;family:ProductFamily;hasRelated:boolean}){
 const info=familyInfo[family];
 const {lifestyle:image}=productEditorialImages(product);
 return <>
  <div className="pawlira-pdp-feature-top">
   <ProductSectionNav title={product.title} hasFaq={true} hasRelated={hasRelated}/>
   <section id="pdp-oversikt" className={"pawlira-pdp-category-hero pawlira-pdp-category-hero-"+family} aria-labelledby="pawlira-pdp-category-heading">
    {family!=="litter"&&image?.url&&<div className="pawlira-pdp-category-product"><Image src={image.url} alt={image.altText||product.title} fill sizes="(max-width:767px) 85vw, 50vw" className="object-contain"/></div>}
    <div className="pawlira-pdp-category-hero-content">
     <h2 id="pawlira-pdp-category-heading">{info.heading}</h2>
     <p>{info.introduction}</p>
    </div>
   </section>
  </div>
 </>;
}

function ProductEditorialChapter({product,family}:{product:Product;family:ProductFamily}){
 const info=familyInfo[family];
 const {lifestyle:image}=productEditorialImages(product);
 return <>
  <section id="pdp-livsstil" className="container pawlira-pdp-editorial-chapter">
   <div className="pawlira-pdp-editorial-photo">
    {image?.url&&<Image src={image.url} alt={image.altText||product.title} fill sizes="(max-width:767px) 100vw, 50vw" className="object-contain"/>}
   </div>
   <div className="pawlira-pdp-editorial-copy"><h2>{info.chapter}</h2><p>{info.chapterText}</p></div>
  </section>
 </>;
}

export default function ProductStory({product,fields,descriptionHtml,family="other",hasRelated=false}:{product:Product;fields:ProductField[];descriptionHtml:string;family?:ProductFamily;hasRelated?:boolean}){
 const byKey=(key:string)=>fields.filter(field=>field.key===key);
 const descriptionSpecs=separateTechnicalItems(descriptionHtml);
 const accordionGroups=[
  ...(specifications(fields,descriptionHtml).length===0?[{title:"Tekniska specifikationer",key:"spec",fallback:""}]:[]),
  {title:"Funktioner och egenskaper",key:"features",fallback:""},
  {title:"Produktinformation",key:"details",fallback:!byKey("details").length?product.description?.trim()||"":""},
  {title:"Vad ingår i förpackningen?",key:"included",fallback:""},
  {title:"Kompatibilitet",key:"compatibility",fallback:""},
  {title:"Användning och underhåll",key:"usage",fallback:familyInfo[family].use},
  {title:"Säkerhetsinformation",key:"safety",fallback:familyInfo[family].safety}
 ].filter(group=>byKey(group.key).length>0||(group.key==="spec"&&!!descriptionSpecs)||!!group.fallback);
 return <>
  <ProductShowcase product={product} family={family} hasRelated={hasRelated}/>
  <ProductFeatureStage product={product} family={family} fields={fields}/>
  <ProductEditorialChapter product={product} family={family}/>
  <section id="produktinformation" className="pawlira-pdp-details-area scroll-mt-32" aria-labelledby="pawlira-pdp-details-title">
   <div className="container">
    <div className="pawlira-pdp-details-heading"><h2 id="pawlira-pdp-details-title">Tekniska specifikationer</h2><p>Uppgifter för den aktuella modellen.</p></div>
    <div className="pawlira-pdp-spec-card">
     <div className="pawlira-pdp-spec-values">
      {specifications(fields,descriptionHtml).length>0?
       <dl className="pawlira-pdp-spec-table">{specifications(fields,descriptionHtml).map((item,index)=><div key={item.label+index}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
       :<p className="pawlira-pdp-spec-empty">Produktspecifika mått och tekniska värden visas här när de finns angivna i produktinformationen.</p>}
     </div>
     <div className="pawlira-pdp-spec-visual">{product.featuredImage?.url&&<Image src={product.featuredImage.url} alt={product.featuredImage.altText||product.title} fill sizes="(max-width: 767px) 90vw, 55vw" className="object-contain"/>}</div>
    </div>
    <div className="pawlira-pdp-detail-content">
     <div className="pawlira-pdp-spec-intro"><h2>Produktdetaljer</h2><p>Information om användning, kompatibilitet och säkerhet för den här produkten.</p></div>
     <div className="pawlira-product-detail-accordions">
    {accordionGroups.map(group=>{
     const matched=byKey(group.key);
     const content=group.key==="spec"&&!matched.length?descriptionSpecs:"";
     return <div id={group.key==="spec"?"specifikationer":undefined} key={group.key}><Accordion title={group.title}>{matched.length?<div className="space-y-4">{matched.map((field,index)=><div key={field.key+field.title+index}><FieldDetails value={field.value}/></div>)}</div>:content?<div className="content" dangerouslySetInnerHTML={{__html:content}}/>:<p>{group.fallback}</p>}</Accordion></div>;
    })}
     </div>
    </div>
   </div>
  </section>
  <ProductFaq family={family} fields={fields}/>
  <ProductDetailsEditorial family={family}/>
 </>;
}
