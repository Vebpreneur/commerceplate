import Link from "next/link";
import Image from "next/image";
import {FiArrowUpRight,FiArrowRight,FiPackage,FiRefreshCcw,FiMessageCircle,FiSliders,FiGrid,FiCheckCircle,FiHeart} from "react-icons/fi";
import {getCollections,getCollectionProducts,getProducts} from "@/lib/shopify";
import type {Collection,Product} from "@/lib/shopify/types";
import FeaturedProducts from "@/partials/FeaturedProducts";
import CatalogPrice from "@/components/product/CatalogPrice";
import FaqSection from "@/partials/FaqSection";
import {Suspense} from "react";
import config from "@/config/config.json";

type Category = Collection & {image?:{url:string;altText?:string}|null};
type Group = {category:Category;products:Product[]};
const path=(product:Product)=>"/products/"+encodeURIComponent(product.handle);
const collectionPath=(category:Category)=>"/products?c="+encodeURIComponent(category.handle);
const clean=(text:string)=>text.replace(/\s+/g," ").trim();
const short=(text:string,max=180)=>{const value=clean(text);if(value.length<=max)return value;const cut=value.slice(0,max);return cut.slice(0,cut.lastIndexOf(" ")>max/2?cut.lastIndexOf(" "):max)+"…";};
const picture=(product:Product)=>product.featuredImage?.url?product.featuredImage:product.images?.find(i=>i.url);
const unique=(products:Product[])=>Array.from(new Map(products.map(p=>[p.id,p])).values());
function Photo({image,alt,cover=false,className=""}:{image:{url:string;altText?:string}|undefined|null;alt:string;cover?:boolean;className?:string}){
 return image?.url?<Image src={image.url} alt={image.altText||alt} fill sizes="(max-width: 767px) 90vw, (max-width: 1199px) 50vw, 600px" className={(cover?"object-cover":"object-contain")+" "+className}/>:null;
}
function Heading({eyebrow,title,description,href,label="Visa alla produkter"}:{eyebrow:string;title:string;description?:string;href?:string;label?:string}){
 return <div className="pawlira-section-heading"><div><p className="pawlira-eyebrow">{eyebrow}</p><h2>{title}</h2>{description&&<p className="pawlira-section-description">{description}</p>}</div>{href&&<Link href={href} className="pawlira-text-link">{label}<FiArrowUpRight size={20}/></Link>}</div>;
}
function CategoryCard({group}:{group:Group}){
 const {category,products}=group;
 const img=category.image?.url?category.image:products.map(picture).find(Boolean);
 return <Link href={collectionPath(category)} className="pawlira-home-category">
  <div className="pawlira-home-category-photo">{img?<Photo image={img} alt={category.title} cover={!!category.image?.url}/>:<div className="h-full flex items-center justify-center"><FiGrid size={60} className="text-black"/></div>}</div>
  <div className="pawlira-home-category-caption"><div><h3>{category.title}</h3><p>Upptäck sortimentet</p></div><span className="pawlira-category-arrow"><FiArrowUpRight size={23}/></span></div>
 </Link>;
}
function ProductSpotlight({product}:{product:Product}){
 const photo=product.images?.filter(i=>i.url&&i.url!==product.featuredImage?.url)[0]||picture(product);
 return <section className="container pawlira-home-section"><Heading eyebrow="I fokus" title="Upptäck en produkt närmare"/>
 <div className="pawlira-spotlight"><div className="pawlira-spotlight-photo"><Photo image={photo} alt={product.title}/></div>
 <div className="pawlira-spotlight-content"><p className="pawlira-eyebrow">Utvalt hos Pawlira</p><h3>{product.title}</h3>{product.description&&<p className="leading-relaxed">{short(product.description,320)}</p>}<CatalogPrice product={product}/><Link href={path(product)} className="btn btn-primary rounded-full inline-flex gap-3 items-center justify-center">Upptäck produkten<FiArrowRight/></Link></div></div></section>;
}
function ProductRail({group}:{group:Group}){
 return <section className="container pawlira-home-section"><Heading eyebrow="Utforska sortimentet" title={group.category.title} description={group.category.description?short(group.category.description,160):undefined} href={collectionPath(group.category)} label="Se hela kategorin"/>
  <div className="pawlira-product-rail" aria-label={group.category.title}>{group.products.slice(0,4).map(product=><Link key={product.id} href={path(product)} className="pawlira-rail-card">
    <div className="pawlira-rail-photo"><Photo image={picture(product)} alt={product.title}/></div><div className="pawlira-rail-body"><h3>{product.title}</h3><CatalogPrice product={product}/><span className="pawlira-text-link">Visa produkt<FiArrowUpRight size={18}/></span></div></Link>)}</div>
 </section>;
}
function ProductComparison({group}:{group:Group}){
 const products=group.products.slice(0,3);
 const options=(p:Product)=>p.options.filter(o=>o.values.length>1).map(o=>o.name+": "+o.values.join(", ")).join(" · ")||"Inga valbara alternativ";
 return <section className="container pawlira-home-section"><Heading eyebrow="Hitta din favorit" title="Vilken modell passar dig?" description={"Jämför modeller i "+group.category.title.toLowerCase()+" och läs mer om respektive produkt."} href={collectionPath(group.category)} label="Visa kategorin"/>
 <div className="pawlira-compare-scroll"><div className="pawlira-compare-grid" style={{gridTemplateColumns:"repeat("+products.length+", minmax(0, 1fr))"}}>{products.map(p=><article key={p.id} className="pawlira-compare-card"><Link href={path(p)} className="pawlira-compare-photo"><Photo image={picture(p)} alt={p.title}/></Link><div className="pawlira-compare-body"><h3>{p.title}</h3><CatalogPrice product={p}/><dl><dt>Alternativ</dt><dd>{options(p)}</dd><dt>Produktinformation</dt><dd>{p.description?short(p.description,105):"Läs mer på produktsidan."}</dd></dl><Link href={path(p)} className="btn btn-outline-primary rounded-full w-full">Se modellen</Link></div></article>)}</div></div>
 </section>;
}
function DailyLife({groups}:{groups:Group[]}){
 const picks=groups.filter(g=>g.products.length||g.category.image?.url).slice(0,3);
 if(!picks.length)return null;
 return <section id="vardagsinspiration" className="container pawlira-home-section scroll-mt-36"><Heading eyebrow="Vardagen med katt" title="Små rutiner. Stor betydelse." description="Utgå från din katts behov och hitta produkter för de dagliga rutinerna."/>
 <div className="pawlira-editorial-grid">{picks.map(g=>{
 const detailPhoto=g.products.flatMap(p=>p.images.filter(i=>i.url&&i.url!==p.featuredImage?.url))[0];
 const photo=detailPhoto||g.category.image||g.products.map(picture).find(Boolean);
 return <Link key={g.category.handle} href={collectionPath(g.category)} className="pawlira-editorial-tile"><div className="pawlira-editorial-tile-photo"><Photo image={photo} alt={g.category.title} cover={!detailPhoto&&!!g.category.image?.url}/></div><div className="pawlira-editorial-tile-caption"><p className="pawlira-eyebrow">Vardagen med katt</p><h3>{g.category.title}</h3><p>{g.category.description?short(g.category.description,135):"Hitta produkter för din katts vardag."}</p><span className="pawlira-text-link">Utforska<FiArrowUpRight size={20}/></span></div></Link>;
 })}</div></section>;
}

export default async function HomeSections(){
 const [allCollections,all,featured]=await Promise.all([getCollections().catch(()=>[]),getProducts({}).catch(()=>({products:[]})),getCollectionProducts({collection:config.shopify.collections.featured_products,first:8}).catch(()=>({products:[]}))]);
 const categories=(allCollections as Category[]).filter(c=>!["frontpage","home-page","homepage","featured-products","all"].includes(c.handle)&&!c.handle.startsWith("hidden")&&c.title.toLowerCase()!=="home page").slice(0,6);
 const groups:Group[]=await Promise.all(categories.map(async category=>{const result=await getCollectionProducts({collection:category.handle,first:4}).catch(()=>({products:[]}));return {category,products:result.products};}));
 const available=groups.filter(g=>g.products.length||g.category.image?.url);
 const catalog=unique([...featured.products,...all.products,...groups.flatMap(g=>g.products)]);
 const featuredProducts=unique([...featured.products,...catalog]).slice(0,6);
 const used=new Set(featuredProducts.map(p=>p.id));
 const spotlight=catalog.find(p=>!used.has(p.id)&&p.availableForSale&&picture(p))||catalog.find(p=>p.availableForSale&&picture(p));
 const shelves=available.filter(g=>g.products.length>=2).slice(0,3);
 const compareGroup=shelves.find(g=>g.products.length>=3)||shelves[0];
 return <>
 {available.length>0&&<section id="kategorier" className="container pawlira-home-section scroll-mt-36"><Heading eyebrow="Handla efter kategori" title="Allt börjar med en vardagsrutin." description="Hitta rätt produkter för ditt hem och din katt." href="/products" label="Hela sortimentet"/><div className="pawlira-home-categories">{available.map(group=><CategoryCard key={group.category.handle} group={group}/>)}</div></section>}
 {featuredProducts.length>0&&<section className="container pawlira-home-section"><Heading eyebrow="Utvalt för dig" title="Upptäck Pawlira" description="Smarta lösningar för livet med katt." href="/products"/><FeaturedProducts products={featuredProducts} showAllLink={false}/></section>}
 {spotlight&&<ProductSpotlight product={spotlight}/>}
 <section className="pawlira-home-black"><div className="container"><div className="pawlira-brand-statement"><p className="pawlira-eyebrow">Pawlira · Livet med katt</p><h2>Mer tid för det<br className="hidden md:block"/> som betyder något.</h2><p>De små stunderna tillsammans. Vardagens rutiner. Ett hem som passar både dig och din katt.</p><Link href="/about" className="pawlira-white-link">Lär känna Pawlira<FiArrowUpRight size={20}/></Link></div><div className="pawlira-brand-points">{[{Icon:FiHeart,title:"Katten i centrum",text:"Utgå från din katts vardag och behov."},{Icon:FiSliders,title:"Teknik i vardagen",text:"Hitta produkter med funktioner som passar dina rutiner."},{Icon:FiGrid,title:"Ett genomtänkt hem",text:"Utforska olika modeller och utföranden."}].map(({Icon,title,text})=><div key={title}><Icon size={29}/><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
 {shelves[0]&&<ProductRail group={shelves[0]}/>}
 <DailyLife groups={available}/>
 {shelves[1]&&<ProductRail group={shelves[1]}/>}
 {compareGroup&&<ProductComparison group={compareGroup}/>}
 {shelves[2]&&<ProductRail group={shelves[2]}/>}
 <section id="kopguide" className="container pawlira-home-section scroll-mt-36"><Heading eyebrow="Inför ditt köp" title="Hitta rätt på dina villkor." description="Bra val börjar med bra information."/><div className="pawlira-guide-grid">{[{Icon:FiSliders,title:"Jämför funktioner",text:"Läs respektive produkts specifikationer och alternativ. Välj utifrån vad du faktiskt behöver.",href:"/products"},{Icon:FiCheckCircle,title:"Kontrollera detaljerna",text:"Titta på mått, innehåll och användningsinformation innan du väljer modell.",href:"/products"},{Icon:FiMessageCircle,title:"Frågor inför köpet?",text:"Läs vår kundinformation för hjälp med produkter och beställningar.",href:"/contact"}].map(({Icon,title,text,href})=><Link className="pawlira-guide-card" key={title} href={href}><Icon size={30}/><h3>{title}</h3><p>{text}</p><span className="pawlira-text-link">Läs mer<FiArrowUpRight size={18}/></span></Link>)}</div></section>
 <section className="pawlira-help-section"><div className="container"><Heading eyebrow="Kundinformation" title="Här när du behöver oss."/><div className="grid sm:grid-cols-3 gap-4">{[{Icon:FiPackage,title:"Leverans",text:"Information om leverans och frakt.",href:"/shipping-policy"},{Icon:FiRefreshCcw,title:"Retur och ångerrätt",text:"Information om dina rättigheter.",href:"/refund-policy"},{Icon:FiMessageCircle,title:"Kundservice",text:"Hjälp inför och efter ditt köp.",href:"/contact"}].map(({Icon,title,text,href})=><Link key={title} href={href} className="pawlira-help-card"><Icon size={28}/><div><h3>{title}</h3><p>{text}</p></div><FiArrowUpRight size={20}/></Link>)}</div></div></section>
 <Suspense fallback={<section id="faq" className="container pawlira-home-section"><h2 className="pawlira-large-heading">Vanliga frågor.</h2></section>}><FaqSection/></Suspense>
 <section className="pawlira-home-final"><div className="container"><p className="pawlira-eyebrow">Pawlira</p><h2>Ett enklare liv tillsammans.</h2><Link href="/products" className="btn !bg-white !text-black rounded-full">Upptäck sortimentet<FiArrowRight className="inline ml-2"/></Link></div></section>
 </>;
}
