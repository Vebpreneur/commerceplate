import Link from "next/link";
import {LuArrowUpRight,LuBox,LuCheck,LuCreditCard,LuHeadset,LuPackage,LuRotateCcw,LuShieldCheck,LuTruck} from "react-icons/lu";
import {SiKlarna,SiVisa,SiMastercard,SiPaypal,SiShopify} from "react-icons/si";

export type PolicyKind="privacyPolicy"|"termsOfService"|"refundPolicy"|"shippingPolicy";
type Section={title:string;html:string};
function cleanText(html:string){
 return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,"")
  .replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;|&#xA0;/gi," ").replace(/&amp;/gi,"&")
  .replace(/&(?:#\d+|#x[\da-f]+);/gi," ").replace(/\s+/g," ").trim();
}
function hasVisibleContent(html:string){
 return cleanText(html).length>0||/<(?:img|video|table|iframe)\b/i.test(html);
}
function sectionsFromShopify(body:string):Section[]{
 // Shopify policy HTML may begin with empty paragraphs, whitespace, or a cover heading.
 // Split at h2 headings, keeping h3 subsections inside their parent instead of
 // turning every small subheading into another numbered section.
 const h2=[...body.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2\s*>/gi)];
 const headingLevel=h2.some(match=>cleanText(match[1]))?2:3;
 const headingPattern=headingLevel===2?/<h2\b[^>]*>([\s\S]*?)<\/h2\s*>/gi:/<h3\b[^>]*>([\s\S]*?)<\/h3\s*>/gi;
 const headings=[...body.matchAll(headingPattern)];
 if(!headings.length)return hasVisibleContent(body)?[{title:"Villkor och information",html:body}]:[];
 const sections:Section[]=[];
 const introduction=body.slice(0,headings[0].index||0);
 if(hasVisibleContent(introduction))sections.push({title:"Inledning",html:introduction});
 headings.forEach((match,i)=>{
  const start=(match.index||0)+match[0].length;
  const end=i+1<headings.length?headings[i+1].index||body.length:body.length;
  const title=cleanText(match[1]);
  const content=body.slice(start,end);
  if(!title){
   if(sections.length&&hasVisibleContent(content))sections[sections.length-1].html+=content;
   return;
  }
  if(!hasVisibleContent(content)){
   // Empty Shopify headings do not create phantom numbered chapters.
   return;
  }
  sections.push({title,html:content});
 });
 return sections;
}
const paymentMethods=[
 {name:"Klarna",Icon:SiKlarna,className:"klarna"},
 {name:"Visa",Icon:SiVisa,className:"visa"},
 {name:"Mastercard",Icon:SiMastercard,className:"mastercard"},
 {name:"Shop Pay",Icon:SiShopify,className:"shoppay"},
 {name:"PayPal",Icon:SiPaypal,className:"paypal"}
];
function PaymentMethods(){
 return <section className="pawlira-policy-payments" aria-labelledby="pawlira-policy-payments-heading"><div><h2 id="pawlira-policy-payments-heading">Betalning</h2><p>Betalningsalternativen visas i kassan innan du slutför köpet. Vilka alternativ som erbjuds kan variera beroende på kund, land och beställning.</p></div><div className="pawlira-policy-payments-cards" aria-label="Exempel på betalningsalternativ">{paymentMethods.map(({name,Icon,className})=><div key={name} className={"pawlira-policy-payment "+className}><Icon size={24} aria-hidden="true"/><strong>{name}</strong></div>)}</div><p className="pawlira-policy-payments-footnote">Illustrerade betalningsalternativ – kassan visar vilka som är tillgängliga vid ditt köp.</p></section>;
}

function TermsHighlights({kind}:{kind:PolicyKind}){
 const highlights=kind==="termsOfService"?[
  {Icon:LuTruck,title:"Fri frakt",description:"Vi erbjuder fri frakt på beställningar till Sverige."},
  {Icon:LuRotateCcw,title:"14 dagars ångerrätt",description:"Vid distansköp gäller som huvudregel 14 dagars ångerrätt från mottagandet."},
  {Icon:LuShieldCheck,title:"Reklamationsrätt",description:"I Sverige kan konsumenter normalt reklamera ursprungliga fel i upp till tre år."}
 ]:kind==="refundPolicy"?[
  {Icon:LuRotateCcw,title:"14 dagars ångerrätt",description:"Ångerfristen är normalt 14 dagar från att du fått varan."},
  {Icon:LuPackage,title:"Returfrakt vid ånger",description:"Du som kund betalar de direkta kostnaderna för returfrakten när du ångrar köpet."},
  {Icon:LuShieldCheck,title:"Felaktig vara",description:"Vid godkänd reklamation ska du inte stå för nödvändiga returkostnader."}
 ]:kind==="shippingPolicy"?[
  {Icon:LuTruck,title:"Fri frakt inom Sverige",description:"Vi tar inte ut någon leveransavgift för beställningar till Sverige."},
  {Icon:LuPackage,title:"Leveransinformation",description:"Beräknad leveranstid och aktuella alternativ framgår i anslutning till beställningen."},
  {Icon:LuHeadset,title:"Hjälp med en order",description:"Kontakta kundservice och ange gärna ditt ordernummer."}
 ]:kind==="privacyPolicy"?[
  {Icon:LuShieldCheck,title:"Personuppgifter",description:"Här beskrivs hur uppgifter behandlas i anslutning till köp och kundservice."},
  {Icon:LuCreditCard,title:"Säkra betalningar",description:"Betalningsuppgifter hanteras av betalningsleverantörer vid köpet."},
  {Icon:LuHeadset,title:"Frågor",description:"Kontakta oss på info@pawlira.se om frågor om dina uppgifter."}
 ]:[];
 return <div className="pawlira-policy-highlights">{highlights.map(({Icon,title,description})=><div className="pawlira-policy-highlight" key={title}><Icon size={24} strokeWidth={1.5} aria-hidden="true"/><h2>{title}</h2><p>{description}</p></div>)}</div>;
}
function PolicySummary({kind}:{kind:PolicyKind}){
 if(kind==="termsOfService")return <section className="pawlira-policy-summary"><h2>Det viktigaste om ditt köp</h2><div className="pawlira-policy-summary-grid">
 <div><h3>Priser och beställning</h3><p>Priser och eventuella rabatter visas i kassan innan beställningen slutförs. Bekräftelsen skickas till den e-postadress du anger.</p></div>
 <div><h3>Leverans</h3><p>Vi erbjuder alltid fri frakt inom Sverige. Läs mer om leveransalternativ och orderinformation på <Link href="/shipping-policy">leveranssidan</Link>.</p></div>
 <div><h3>Ångerrätt och retur</h3><p>Som konsument har du normalt 14 dagars ångerrätt vid distansköp. Vid vanlig ånger står du för den direkta returfrakten. <Link href="/refund-policy">Läs returvillkoren</Link>.</p></div>
 <div><h3>Reklamation</h3><p>Du kan normalt reklamera fel på varan i tre år enligt svensk konsumentköplag. Vid godkänd reklamation står du inte för nödvändiga returkostnader.</p></div>
 </div></section>;
 if(kind==="refundPolicy")return <section className="pawlira-policy-summary"><h2>Så fungerar en retur</h2><div className="pawlira-policy-steps">
 <div><span>01</span><div><h3>Meddela oss</h3><p>Kontakta <Link href="/contact">kundservice</Link> på info@pawlira.se inom ångerfristen och ange ditt ordernummer och vilka varor det gäller.</p></div></div>
 <div><span>02</span><div><h3>Skicka tillbaka varan</h3><p>Följ returinstruktionerna och skicka tillbaka varan senast 14 dagar efter att du meddelat oss om ånger. Du betalar den direkta returfrakten när du ångrar köpet.</p></div></div>
 <div><span>03</span><div><h3>Återbetalning</h3><p>Återbetalning sker enligt ångerrättsreglerna, normalt senast 14 dagar efter ångermeddelandet. Vi får avvakta tills varan kommit tillbaka eller du visat att den skickats.</p></div></div>
 </div><p className="pawlira-policy-summary-note"><LuShieldCheck size={18} aria-hidden="true"/> Om varan är felaktig gäller reglerna för reklamation i stället. Vid godkänd reklamation ska du inte betala nödvändig returfrakt.</p></section>;
 if(kind==="shippingPolicy")return <section className="pawlira-policy-summary"><h2>Leverans och frakt</h2><div className="pawlira-policy-summary-grid"><div><h3>Fri frakt</h3><p>Leverans till Sverige är alltid kostnadsfri.</p></div><div><h3>Din beställning</h3><p>Du får orderinformation via den e-postadress du anger i kassan.</p></div><div><h3>Leveransbesked</h3><p>Leveransalternativ och uppskattade tider kan bero på produkt och leveransadress.</p></div><div><h3>Problem med leveransen?</h3><p>Kontakta oss på <a href="mailto:info@pawlira.se">info@pawlira.se</a> och ange ditt ordernummer.</p></div></div></section>;
 return null;
}
export default function PolicyDocument({kind,body}:{kind:PolicyKind;body:string|null|undefined}){
 const sections=sectionsFromShopify(body||"");
 const hasOriginal=!!body?.trim();
 return <div className="pawlira-policy-page-content">
  <TermsHighlights kind={kind}/>
  <PolicySummary kind={kind}/>
  {kind==="termsOfService"&&<PaymentMethods/>}
  {kind==="privacyPolicy"&&<div className="pawlira-policy-privacy-contact"><strong>Kontakt för frågor om personuppgifter</strong><a href="mailto:info@pawlira.se">info@pawlira.se</a></div>}
  <div className="pawlira-policy-original">
   <div className="pawlira-policy-original-heading"><div><p className="pawlira-policy-kicker">Villkorsinformation</p><h2>{kind==="termsOfService"?"Fullständiga köpvillkor":kind==="refundPolicy"?"Fullständiga returvillkor":kind==="shippingPolicy"?"Leveransvillkor":"Integritetspolicy"}</h2><p>Informationen nedan hämtas från butikens villkor och visas med tydligare avsnitt och avgränsningar.</p></div></div>
   {hasOriginal?<div className="pawlira-policy-document-layout">
    {sections.length>1&&<nav className="pawlira-policy-toc" aria-label="På den här sidan"><h3>Innehåll</h3>{sections.map((item,i)=><a key={i} href={"#villkor-"+i}>{item.title}</a>)}</nav>}
    <div className="pawlira-policy-sections">{sections.map((item,i)=><section className="pawlira-policy-section" id={"villkor-"+i} key={i}><div className="pawlira-policy-section-number">{String(i+1).padStart(2,"0")}</div><div className="pawlira-policy-section-text"><h3>{item.title}</h3><div className="content pawlira-policy-shopify-html" dangerouslySetInnerHTML={{__html:item.html}}/></div></section>)}</div>
   </div>:<div className="pawlira-policy-missing"><p>Den fullständiga texten från butikens policy är för närvarande inte tillgänglig i denna vy.</p><Link href="/contact">Kontakta oss för information <LuArrowUpRight size={17}/></Link></div>}
  </div>
  <section className="pawlira-policy-contact-footer"><div><h2>Behöver du hjälp?</h2><p>Frågor om betalning, beställning, leverans eller retur? Vår kundservice hjälper dig vidare.</p><a href="mailto:info@pawlira.se">info@pawlira.se</a></div><Link href="/contact" className="btn btn-primary rounded-full">Kontakta oss <LuArrowUpRight size={18}/></Link></section>
 </div>;
}
