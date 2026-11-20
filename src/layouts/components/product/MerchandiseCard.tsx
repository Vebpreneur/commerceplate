import Link from "next/link";
import type {Product} from "@/lib/shopify/types";
import CatalogPrice from "./CatalogPrice";
import CardMedia from "./CardMedia";
import {customerText} from "@/lib/utils/customerProduct";
import {customerTitle} from "@/lib/utils/customerTitle";
function shortTagline(text:string,title:string){
 const clean=customerText(text||"").replace(/\s+/g," ").trim();
 if(!clean||clean.toLowerCase()===title.toLowerCase())return "";
 const firstSentence=clean.split(/(?<=[.!?])\s+/)[0]||clean;
 if(firstSentence.length<=68)return firstSentence;
 const cut=firstSentence.slice(0,66);
 const space=cut.lastIndexOf(" ");
 return (space>36?cut.slice(0,space):cut).replace(/[,:;–—-\s]+$/,"")+"…";
}
export default function MerchandiseCard({product,compact=false,catalog=false}:{product:Product;compact?:boolean;catalog?:boolean}){
 const href="/products/"+encodeURIComponent(product.handle);
 const title=customerTitle(product.title);
 const tagline=catalog?shortTagline(product.description||"",title):"";
 return <article className={"pawlira-merch-card pawlira-clean-product "+(compact?"pawlira-merch-compact":"")+(catalog?" pawlira-catalog-product":"")}>
  <CardMedia product={product} href={href}/>
  <div className="pawlira-clean-product-info">
   <h3><Link href={href} className="pawlira-product-title"><span>{title}</span></Link></h3>
   {catalog&&tagline&&<p className="pawlira-catalog-product-description">{tagline}</p>}
   <CatalogPrice product={product} showStock={false}/>
  </div>
 </article>;
}
