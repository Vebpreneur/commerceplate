import Link from "next/link";
import Image from "next/image";
import EditorialPhoto from "@/components/EditorialPhoto";
import {editorialImages} from "@/config/editorialImages";
import {LuArrowUpRight as FiArrowUpRight,LuArrowUpRight as FiArrowRight,LuPackage as FiPackage,LuRefreshCcw as FiRefreshCcw,LuMessageCircle as FiMessageCircle,LuSlidersHorizontal as FiSliders,LuLayoutGrid as FiGrid,LuCircleCheck as FiCheckCircle,LuHeart as FiHeart} from "react-icons/lu";
import {getCollections,getCollectionProducts,getProducts} from "@/lib/shopify";
import type {Collection,Product} from "@/lib/shopify/types";
import FeaturedProducts from "@/partials/FeaturedProducts";
import Spotlight from "@/components/product/Spotlight";
import MerchandiseRail from "@/components/product/ProductRail";
import FaqSection from "@/partials/FaqSection";
import CompareModels from "@/components/product/CompareModels";
import ProductGuide from "@/components/ProductGuide";
import {Suspense} from "react";
import config from "@/config/config.json";
import {categoryEditorial} from "@/lib/utils/categoryEditorial";
import {categoryName} from "@/lib/utils/modelName";

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
 return <div className="pawlira-section-heading"><div><p className="pawlira-eyebrow">{eyebrow}</p><h2>{title}</h2>{description&&<p className="pawlira-section-description">{description}</p>}</div>{href&&<Link href={href} className="pawlira-text-link">{label}<FiArrowUpRight size={20} strokeWidth={1.5}/></Link>}</div>;
}
function CategoryCard({group}:{group:Group}){
 const {category,products}=group;
 const img=category.image?.url?category.image:products.map(picture).find(Boolean);
 return <Link href={collectionPath(category)} className="pawlira-home-category">
  <div className="pawlira-home-category-photo">{img?<Photo image={img} alt={category.title} cover={!!category.image?.url}/>:<div className="h-full flex items-center justify-center"><FiGrid size={60} className="text-black" strokeWidth={1.5}/></div>}</div>
  <div className="pawlira-home-category-caption"><div><h3>{category.title}</h3><p>{categoryEditorial(category.title,category.handle).label}</p></div><span className="pawlira-category-arrow"><FiArrowUpRight size={23} strokeWidth={1.5}/></span></div>
 </Link>;
}
function ProductRail({group}:{group:Group}){
 return <section className="container pawlira-home-section"><Heading eyebrow="Utforska sortimentet" title={group.category.title} description={group.category.description?short(group.category.description,160):categoryEditorial(group.category.title,group.category.handle).description} href={collectionPath(group.category)} label="Se hela kategorin"/>
  <MerchandiseRail products={group.products.slice(0,6)} label={group.category.title}/>
 </section>;
}
function DailyLife({groups}:{groups:Group[]}){
 const picks=groups.filter(g=>g.products.length||g.category.image?.url).slice(0,3);
 if(!picks.length)return null;
 return <section id="vardagsinspiration" className="container pawlira-home-section scroll-mt-36"><Heading eyebrow="Vardagen med katt" title="Mat, vatten och en ren kattlåda" description="Tre sätt att ordna kattens vardagsrutiner hemma."/>
 <div className="pawlira-editorial-grid">{picks.map(g=>{
 const editorial=categoryEditorial(g.category.title,g.category.handle);
 const photo=g.category.image?.url?g.category.image:g.products.map(picture).find(Boolean);
 return <Link key={g.category.handle} href={collectionPath(g.category)} className="pawlira-editorial-tile"><div className="pawlira-editorial-tile-photo">{photo?.url?<Photo image={photo} alt={g.category.title} cover={!!g.category.image?.url}/>:<EditorialPhoto src={editorialImages.home.url} alt={editorialImages.home.alt}/> }</div><div className="pawlira-editorial-tile-caption"><p className="pawlira-eyebrow">{editorial.label}</p><h3>{editorial.heading}</h3><p>{editorial.description}</p><span className="pawlira-text-link">Utforska<FiArrowUpRight size={20} strokeWidth={1.5}/></span></div></Link>;
 })}</div></section>;
}

export default async function HomeSections(){
 const [allCollections,all,featured]=await Promise.all([getCollections().catch(()=>[]),getProducts({}).catch(()=>({products:[]})),getCollectionProducts({collection:config.shopify.collections.featured_products,first:8}).catch(()=>({products:[]}))]);
 const categories=(allCollections as Category[]).filter(c=>!["frontpage","home-page","homepage","featured-products","all"].includes(c.handle)&&!c.handle.startsWith("hidden")&&c.title.toLowerCase()!=="home page").map(c=>({...c,title:categoryName(c.title)})).slice(0,6);
 const groups:Group[]=await Promise.all(categories.map(async category=>{const result=await getCollectionProducts({collection:category.handle,first:6}).catch(()=>({products:[]}));return {category,products:result.products};}));
 const available=groups.filter(g=>g.products.length||g.category.image?.url);
 const catalog=unique([...featured.products,...all.products,...groups.flatMap(g=>g.products)]);
 const categoryPicks=available.flatMap(g=>[...g.products].sort((a,b)=>Number(b.availableForSale)-Number(a.availableForSale)).slice(0,2));
 const featuredProducts=unique([...featured.products,...categoryPicks,...catalog]).slice(0,6);
 const used=new Set(featuredProducts.map(p=>p.id));
 const spotlightProducts=unique([...available.flatMap(g=>g.products.filter(p=>p.availableForSale&&picture(p)).slice(0,1)),...catalog.filter(p=>!used.has(p.id)&&p.availableForSale&&picture(p)),...catalog.filter(p=>p.availableForSale&&picture(p))]).slice(0,4);
 const shelves=available.filter(g=>g.products.length>=2).slice(0,3);
 const compareGroups=available.filter(g=>g.products.length>=2).map(g=>({title:g.category.title,handle:g.category.handle,products:g.products}));
 return <>
 {available.length>0&&<section id="kategorier" className="container pawlira-home-section scroll-mt-36"><Heading eyebrow="Handla efter kategori" title="Handla efter kategori" description="Välj bland kattlådor, foderautomater och vattenfontäner." href="/products" label="Hela sortimentet"/><div className="pawlira-home-categories">{available.map(group=><CategoryCard key={group.category.handle} group={group}/>)}</div></section>}
 {featuredProducts.length>0&&<section className="container pawlira-home-section"><Heading eyebrow="Utvalt för dig" title="Utvalda produkter" description="Modeller med olika funktioner, kapacitet och utföranden." href="/products"/><FeaturedProducts products={featuredProducts} showAllLink={false}/></section>}
 {spotlightProducts.length>0&&<Spotlight products={spotlightProducts}/>}
 <section className="pawlira-home-black"><div className="container"><div className="pawlira-brand-statement"><p className="pawlira-eyebrow">Pawlira · Livet med katt</p><h2>Mindre arbete med vardagsrutinerna</h2><p>En automatisk kattlåda kan minska den dagliga städningen. En foderautomat hjälper dig hålla måltiderna regelbundna. En vattenfontän ger tillgång till cirkulerande vatten.</p><Link href="/about" className="pawlira-white-link">Lär känna Pawlira<FiArrowUpRight size={20} strokeWidth={1.5}/></Link></div><div className="pawlira-brand-points">{[{Icon:FiHeart,title:"Anpassat efter din katt",text:"Välj storlek och funktion efter kattens vanor och behov."},{Icon:FiSliders,title:"Automatiserade rutiner",text:"Jämför timer, appstyrning och övriga funktioner för varje modell."},{Icon:FiGrid,title:"Praktiskt i hemmet",text:"Se mått, material och krav på placering innan du beställer."}].map(({Icon,title,text})=><div key={title}><Icon size={29} strokeWidth={1.5}/><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
 {shelves[0]&&<ProductRail group={shelves[0]}/>}
 <DailyLife groups={available}/>
 {shelves[1]&&<ProductRail group={shelves[1]}/>}
 {compareGroups.length>0&&<CompareModels groups={compareGroups}/>}
 {shelves[2]&&<ProductRail group={shelves[2]}/>}
 {available.length>0?<ProductGuide categories={available.map(g=>({title:g.category.title,handle:g.category.handle,image:g.category.image?.url?g.category.image:g.products.map(picture).find(Boolean)}))}/>:<section id="kopguide" className="container pawlira-home-section"><Heading eyebrow="Pawlira köpguide" title="Hitta rätt för din katt"/><Link href="/products" className="btn btn-primary rounded-full">Utforska sortimentet</Link></section>}
 <section className="pawlira-help-section"><div className="container"><Heading eyebrow="Kundinformation" title="Kundservice och köpvillkor"/><div className="grid sm:grid-cols-3 gap-4">{[{Icon:FiPackage,title:"Leverans",text:"Se leveransvillkor och spårning.",href:"/shipping-policy"},{Icon:FiRefreshCcw,title:"Retur och ångerrätt",text:"Läs om ångerrätt och reklamation.",href:"/refund-policy"},{Icon:FiMessageCircle,title:"Kundservice",text:"Få svar på produkt- och orderfrågor.",href:"/contact"}].map(({Icon,title,text,href})=><Link key={title} href={href} className="pawlira-help-card"><Icon size={28} strokeWidth={1.5}/><div><h3>{title}</h3><p>{text}</p></div><FiArrowUpRight size={20} strokeWidth={1.5}/></Link>)}</div></div></section>
 <Suspense fallback={<section id="faq" className="container pawlira-home-section"><h2 className="pawlira-large-heading">Vanliga frågor</h2></section>}><FaqSection/></Suspense>
 <section className="pawlira-home-final"><div className="container"><p className="pawlira-eyebrow">Pawlira</p><h2>Hitta rätt utrustning för din katt</h2><Link href="/products" className="btn btn-inverse rounded-full">Upptäck sortimentet<FiArrowRight className="inline ml-2" strokeWidth={1.5}/></Link></div></section>
 </>;
}
