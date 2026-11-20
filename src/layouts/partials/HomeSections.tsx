import Link from "next/link";
import Image from "next/image";
import EditorialPhoto from "@/components/EditorialPhoto";
import {editorialImages} from "@/config/editorialImages";
import {LuArrowUpRight as FiArrowUpRight,LuLayoutGrid as FiGrid} from "react-icons/lu";
import {getCollections,getCollectionProducts,getProducts,getProduct} from "@/lib/shopify";
import type {Collection,Product} from "@/lib/shopify/types";
import FeaturedProducts from "@/partials/FeaturedProducts";
import Spotlight from "@/components/product/Spotlight";
import FeatureHotspots from "@/components/FeatureHotspots";
import MerchandiseRail from "@/components/product/ProductRail";
import FaqSection from "@/partials/FaqSection";
import {Suspense} from "react";
import config from "@/config/config.json";

import {categoryName} from "@/lib/utils/modelName";
import {productFields} from "@/lib/utils/productFields";
import {hotspotSpecifications} from "@/lib/utils/productSpecifications";


type Category = Collection & {image?:{url:string;altText?:string}|null};
type Group = {category:Category;products:Product[]};
const path=(product:Product)=>"/products/"+encodeURIComponent(product.handle);
const collectionPath=(category:Category)=>"/products?c="+encodeURIComponent(category.handle);
const picture=(product:Product)=>product.featuredImage?.url?product.featuredImage:product.images?.find(i=>i.url);
const unique=(products:Product[])=>Array.from(new Map(products.map(p=>[p.id,p])).values());
function Photo({image,alt,cover=false,className=""}:{image:{url:string;altText?:string}|undefined|null;alt:string;cover?:boolean;className?:string}){
 return image?.url?<Image src={image.url} alt={image.altText||alt} fill sizes="(max-width: 767px) 90vw, (max-width: 1199px) 50vw, 600px" className={(cover?"object-cover":"object-contain")+" "+className}/>:null;
}
function Heading({eyebrow,title,description}:{eyebrow:string;title:string;description?:string}){
 return <div className="pawlira-section-heading"><div>{eyebrow&&<p className="pawlira-eyebrow">{eyebrow}</p>}<h2>{title}</h2>{description&&<p className="pawlira-section-description">{description}</p>}</div></div>;
}
function CategoryCard({group}:{group:Group}){
 const {category,products}=group;
 const img=category.image?.url?category.image:products.map(picture).find(Boolean);
 return <Link href={collectionPath(category)} className="pawlira-home-category pawlira-clean-category">
  <div className="pawlira-home-category-photo">{img?<Photo image={img} alt={category.title} cover={!!category.image?.url}/>:<div className="h-full flex items-center justify-center"><FiGrid size={60} className="text-black" strokeWidth={1.5}/></div>}</div>
  <div className="pawlira-home-category-caption"><div><h3>{category.title}</h3></div><span className="pawlira-category-arrow"><FiArrowUpRight size={23} strokeWidth={1.5}/></span></div>
 </Link>;
}
function ProductRail({group}:{group:Group}){
 return <section className="container pawlira-home-section pawlira-home-product-rail"><Heading eyebrow="" title={group.category.title}/>
  <MerchandiseRail products={group.products.slice(0,6)} label={group.category.title}/>
 </section>;
}
export default async function HomeSections(){
 const [allCollections,all,featured]=await Promise.all([getCollections().catch(()=>[]),getProducts({}).catch(()=>({products:[]})),getCollectionProducts({collection:config.shopify.collections.featured_products,first:8}).catch(()=>({products:[]}))]);
 const categories=(allCollections as Category[]).filter(c=>!["frontpage","home-page","homepage","featured-products","all"].includes(c.handle)&&!c.handle.startsWith("hidden")&&c.title.toLowerCase()!=="home page").map(c=>({...c,title:categoryName(c.title)})).slice(0,6);
 const groups:Group[]=await Promise.all(categories.map(async category=>{const result=await getCollectionProducts({collection:category.handle,first:6}).catch(()=>({products:[]}));return {category,products:result.products};}));
 const available=groups.filter(g=>g.products.length||g.category.image?.url);
 const catalog=unique([...featured.products,...all.products,...groups.flatMap(g=>g.products)]);
 const categoryPicks=available.flatMap(g=>[...g.products].sort((a,b)=>Number(b.availableForSale)-Number(a.availableForSale)).slice(0,2));
 const ranked=unique([...categoryPicks,...featured.products,...catalog]).filter(p=>picture(p));
 const featuredProducts=[...ranked.filter(p=>p.availableForSale),...ranked.filter(p=>!p.availableForSale)].slice(0,6);
 const used=new Set(featuredProducts.map(p=>p.id));
 const spotlightProducts=unique([...available.flatMap(g=>g.products.filter(p=>p.availableForSale&&picture(p)).slice(0,1)),...catalog.filter(p=>!used.has(p.id)&&p.availableForSale&&picture(p)),...catalog.filter(p=>p.availableForSale&&picture(p))]).slice(0,4);
 const litter=available.find(g=>/kattlå|kattla|litter|toalett/i.test(g.category.title+" "+g.category.handle));
 const featuredLitter=litter?.products.find(p=>p.availableForSale&&picture(p))||litter?.products.find(p=>picture(p));
 const engineeringModel=featuredLitter?await getProduct(featuredLitter.handle).catch(()=>undefined):undefined;
 const tech=engineeringModel?hotspotSpecifications(productFields(engineeringModel)):[];
 return <div className="pawlira-home-content pawlira-restored-home">
 {available.length>0&&<div className="pawlira-band pawlira-band-white"><section id="kategorier" className="container pawlira-home-section scroll-mt-36"><Heading eyebrow="" title="Kategorier"/><div className="pawlira-home-categories">{available.map(group=><CategoryCard key={group.category.handle} group={group}/>)}</div></section></div>}
 {featuredProducts.length>0&&<div className="pawlira-band pawlira-band-white"><section id="utvalda-produkter" className="container pawlira-home-section pawlira-home-featured scroll-mt-36"><Heading eyebrow="" title="Utvalda produkter"/><FeaturedProducts products={featuredProducts} showAllLink={false}/></section></div>}
 {spotlightProducts.length>0&&<div className="pawlira-band pawlira-band-white"><Spotlight products={spotlightProducts} showHeadingLink={false}/></div>}
 {litter&&<div className="pawlira-band pawlira-band-white"><FeatureHotspots showHeadingLink={false} image={engineeringModel?picture(engineeringModel):featuredLitter?picture(featuredLitter):litter.category.image} href={collectionPath(litter.category)} model={engineeringModel?{title:engineeringModel.title,href:path(engineeringModel),specs:tech}:undefined}/></div>}
 <section className="pawlira-home-brand"><div className="container pawlira-home-section"><div className="pawlira-home-brand-grid"><div className="pawlira-home-brand-photo"><EditorialPhoto src={editorialImages.home.url} alt={editorialImages.home.alt}/></div><div className="pawlira-home-brand-copy"><p className="pawlira-eyebrow">Om Pawlira</p><h2>Smart kattvård för ett enklare hem</h2><p>Mer tid tillsammans, mindre tid åt vardagens måsten. Upptäck smarta lösningar för kattens mat, vatten och toalett – med plats för både dig och din katt.</p><Link href="/about" className="btn btn-primary">Lär känna Pawlira<FiArrowUpRight size={18} strokeWidth={1.5}/></Link></div></div></div></section>
 {litter&&litter.products.length>0&&<ProductRail group={litter}/>}
 <div className="pawlira-band pawlira-band-warm"><Suspense fallback={<section id="faq" className="container pawlira-home-section"><h2 className="pawlira-large-heading">Vanliga frågor</h2></section>}><FaqSection/></Suspense></div>
 
 </div>;
}
