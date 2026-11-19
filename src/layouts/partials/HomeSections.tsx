import Link from "next/link";
import Image from "next/image";
import {LuArrowUpRight,LuHeart,LuSlidersHorizontal,LuHouse,LuLayoutGrid} from "react-icons/lu";
import {getCollections,getCollectionProducts,getProducts,getProduct} from "@/lib/shopify";
import type {Collection,Product} from "@/lib/shopify/types";
import MerchandiseCard from "@/components/product/MerchandiseCard";
import FeatureHotspots from "@/components/FeatureHotspots";
import ComparisonSection from "@/components/ComparisonSection";
import CustomerStories from "@/components/CustomerStories";
import FaqSection from "@/partials/FaqSection";
import {Suspense} from "react";
import config from "@/config/config.json";
import {productFields} from "@/lib/utils/productFields";
import {hotspotSpecifications} from "@/lib/utils/productSpecifications";
type Category=Collection & {image?:{url:string;altText?:string}|null};
type Group={category:Category;products:Product[];label:string;description:string};
const definitions=[
 {match:/foder|feed/i,label:"Foderautomater",description:"Regelbundna måltider"},
 {match:/kattlå|kattla|litter|toalett/i,label:"Självrengörande kattlådor",description:"En renare kattlåda"},
 {match:/vatten|fontän|fontan|fountain/i,label:"Vattenfontäner",description:"Cirkulerande dricksvatten"}
];
const picture=(p:Product)=>p.featuredImage?.url?p.featuredImage:p.images?.find(i=>i.url);
const href=(c:Category)=>"/products?c="+encodeURIComponent(c.handle);
const unique=(products:Product[])=>Array.from(new Map(products.map(p=>[p.id,p])).values());
function Heading({eyebrow,title,description,link,label="Hela sortimentet"}:{eyebrow:string;title:string;description?:string;link?:string;label?:string}){
 return <div className="pawlira-section-heading"><div><p className="pawlira-eyebrow">{eyebrow}</p><h2>{title}</h2>{description&&<p className="pawlira-section-description">{description}</p>}</div>{link&&<Link href={link} className="pawlira-text-link">{label}<LuArrowUpRight size={20} strokeWidth={1.5}/></Link>}</div>;
}
export default async function HomeSections(){
 const [allCollections,all,featured]=await Promise.all([getCollections().catch(()=>[]),getProducts({}).catch(()=>({products:[]})),getCollectionProducts({collection:config.shopify.collections.featured_products,first:8}).catch(()=>({products:[]}))]);
 const collections=(allCollections as Category[]).filter(c=>!["frontpage","home-page","homepage","featured-products","all"].includes(c.handle)&&!c.handle.startsWith("hidden"));
 const groups:Group[]=(await Promise.all(definitions.map(async d=>{const category=collections.find(c=>d.match.test(c.title+" "+c.handle));if(!category)return null;const result=await getCollectionProducts({collection:category.handle,first:6}).catch(()=>({products:[]}));return {category,products:result.products,label:d.label,description:d.description};}))).filter((g):g is Group=>g!==null);
 const catalog=unique([...featured.products,...all.products,...groups.flatMap(g=>g.products)]).filter(p=>p.availableForSale&&picture(p));
 const picks=groups.flatMap(g=>g.products.filter(p=>p.availableForSale&&picture(p)).slice(0,1));
 const selected=unique([...picks,...catalog]).slice(0,4);
 const litter=groups.find(g=>g.label==="Självrengörande kattlådor")||null;
 const featuredLitter=litter?.products.find(p=>p.availableForSale&&picture(p));
 const engineeringModel=featuredLitter?await getProduct(featuredLitter.handle).catch(()=>undefined):undefined;
 const tech=engineeringModel?hotspotSpecifications(productFields(engineeringModel)):[];
 return <div className="pawlira-home-content">
 <section id="kategorier" className="container pawlira-home-section scroll-mt-36"><Heading eyebrow="Sortiment" title="Handla efter kategori" link="/products"/><div className="pawlira-home-categories">{groups.map(g=>{const main=g.category.image?.url?g.category.image:g.products.map(picture).find(Boolean);return <Link href={href(g.category)} key={g.category.handle} className="pawlira-home-category"><div className="pawlira-home-category-photo">{main?.url?<Image src={main.url} alt={g.label} fill sizes="(max-width:767px) 90vw, 420px" className={g.category.image?.url?"object-cover":"object-contain p-4"}/>:<LuLayoutGrid size={40} strokeWidth={1.5}/>}</div><div className="pawlira-home-category-caption"><div><h3>{g.label}</h3><p>{g.description}</p></div><span className="pawlira-category-arrow"><LuArrowUpRight size={23} strokeWidth={1.5}/></span></div></Link>})}</div></section>
 {selected.length>0&&<section className="container pawlira-home-section pawlira-home-featured"><Heading eyebrow="Utvalt hos Pawlira" title="Utvalda produkter" link="/products"/><div className="pawlira-merch-grid pawlira-home-four">{selected.map(p=><MerchandiseCard key={p.id} product={p}/>)}</div></section>}
 <section className="pawlira-home-black pawlira-home-feature-banner"><div className="container"><div className="pawlira-brand-statement"><p className="pawlira-eyebrow">Pawlira</p><h2>Mer tid för det som betyder något</h2><p>Smarta produkter för rengöring, måltider och dricksvatten.</p></div><div className="pawlira-brand-points">{[{Icon:LuHeart,title:"Kattens behov",text:"Välj funktioner och storlek efter din katt."},{Icon:LuSlidersHorizontal,title:"Automatiserade rutiner",text:"Mindre manuellt arbete med rätt utrustning."},{Icon:LuHouse,title:"En del av hemmet",text:"Genomtänkta former och praktisk placering."}].map(({Icon,title,text})=><article key={title}><Icon size={24} strokeWidth={1.5}/><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
 <div id="kopguide" className="scroll-mt-36"><FeatureHotspots image={engineeringModel?picture(engineeringModel):featuredLitter?picture(featuredLitter):litter?.category.image} href={litter?href(litter.category):"/products"} model={engineeringModel?{title:engineeringModel.title,href:"/products/"+encodeURIComponent(engineeringModel.handle),specs:tech}:undefined}/></div>
 <div className="pawlira-home-comparison"><ComparisonSection href={litter?"/compare?c="+encodeURIComponent(litter.category.handle):"/compare"}/><CustomerStories/></div>
 <Suspense fallback={<section id="faq" className="container pawlira-home-section"><h2>Vanliga frågor</h2></section>}><FaqSection/></Suspense>
 </div>;
}
