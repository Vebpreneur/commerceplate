import Link from "next/link";
import {getStoreNavigation} from "@/lib/shopify/navigation";
import {getProduct} from "@/lib/shopify";
import {productFields} from "@/lib/utils/productFields";
import {customerOptions,customerText,customerVariants} from "@/lib/utils/customerProduct";
import FullComparison from "@/components/product/FullComparison";
import {LuArrowUpRight as FiArrowUpRight,LuChevronRight as FiChevronRight} from "react-icons/lu";
import type {Product} from "@/lib/shopify/types";
export const dynamic="force-dynamic";

type Params={c?:string;product?:string|string[]};
export default async function Compare({searchParams}:{searchParams:Promise<Params>}){
 const params=await searchParams;
 const categories=(await getStoreNavigation()).filter(c=>c.products.length>=2);
 const requested=Array.isArray(params.product)?params.product:[params.product].filter((p):p is string=>typeof p==="string");
 const matching=categories.find(c=>requested.some(p=>c.products.some(item=>item.handle===p)));
 const explicit=categories.find(c=>c.handle===params.c);
 const unmatched=(requested.length>0&&!matching&&!explicit)|| (!!params.c&&!explicit&&!matching);
 const category=explicit||matching||categories[0];
 const clean=Array.from(new Set(requested.filter(p=>category?.products.some(item=>item.handle===p)))).slice(0,3);
 const handles=category?[...clean,...category.products.map(p=>p.handle).filter(p=>!clean.includes(p))].slice(0,Math.min(3,Math.max(2,clean.length),category.products.length)):[];
 const loaded=await Promise.all(handles.map(handle=>getProduct(handle).catch(()=>undefined)));
 const products=loaded.filter((p):p is Product=>!!p).map(p=>({id:p.id,handle:p.handle,title:p.title,description:customerText(p.description),featuredImage:p.featuredImage||null,availableForSale:p.availableForSale,options:customerOptions(p.options),priceRange:p.priceRange,variants:customerVariants(p.variants).map(v=>({availableForSale:v.availableForSale,price:v.price})),fields:productFields(p).filter(f=>f.key!=="faq")}));
 return <>
 <section className="container pt-8 lg:pt-12"><nav className="pawlira-catalog-breadcrumb" aria-label="Brödsmulor"><Link href="/">Hem</Link><FiChevronRight strokeWidth={1.5}/><span aria-current="page">Jämför produkter</span></nav><div className="pawlira-compare-page-intro pawlira-compare-art"><p className="pawlira-eyebrow">Pawlira · Modelljämförelse</p><h1>Jämför produkter</h1><p>Välj upp till tre modeller och jämför pris, funktioner och tekniska specifikationer sida vid sida.</p><Link href="/products" className="pawlira-white-link">Utforska hela sortimentet<FiArrowUpRight size={19} strokeWidth={1.5}/></Link></div></section>
 {unmatched&&<div className="container pt-6"><p className="pawlira-compare-unmatched">Den valda produkten eller kategorin har för närvarande inte tillräckligt med jämförbara modeller. Du kan välja en annan kategori nedan.</p></div>}
 {category?<FullComparison categories={categories.map(c=>({title:c.title,handle:c.handle,image:c.image||c.products[0]?.featuredImage,products:c.products.map(p=>({title:p.title,handle:p.handle,featuredImage:p.featuredImage}))}))} categoryHandle={category.handle} selectedHandles={handles} products={products} />:<section className="container pawlira-home-section"><h2>Inga modeller att jämföra just nu</h2><Link href="/products" className="btn btn-primary rounded-full mt-5">Visa sortimentet</Link></section>}
 </>;
}
