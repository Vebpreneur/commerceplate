import Link from "next/link";
import type {Product} from "@/lib/shopify/types";
import CatalogPrice from "./CatalogPrice";
import CardMedia from "./CardMedia";
import {customerText} from "@/lib/utils/customerProduct";
import {customerTitle} from "@/lib/utils/customerTitle";
export default function MerchandiseCard({product,compact=false,catalog=false}:{product:Product;compact?:boolean;catalog?:boolean}){
 const href="/products/"+encodeURIComponent(product.handle);
 const title=customerTitle(product.title);
 const description=customerText(product.description||"").replace(/\s+/g," ").trim();
 return <article className={"pawlira-merch-card pawlira-clean-product "+(compact?"pawlira-merch-compact":"")+(catalog?" pawlira-catalog-product":"")}>
  <CardMedia product={product} href={href}/>
  <div className="pawlira-clean-product-info">
   <h3><Link href={href} className="pawlira-product-title"><span>{title}</span></Link></h3>
   {catalog&&description&&<p className="pawlira-catalog-product-description">{description.slice(0,150)}{description.length>150?"…":""}</p>}
   <CatalogPrice product={product} showStock={false}/>
  </div>
 </article>;
}
