import Link from "next/link";
import type {Product} from "@/lib/shopify/types";
import CatalogPrice from "./CatalogPrice";
import CardMedia from "./CardMedia";
import {customerTitle} from "@/lib/utils/customerTitle";
export default function MerchandiseCard({product,compact=false}:{product:Product;compact?:boolean}){
 const href="/products/"+encodeURIComponent(product.handle);
 const title=customerTitle(product.title);
 return <article className={"pawlira-merch-card pawlira-clean-product "+(compact?"pawlira-merch-compact":"")}>
  <CardMedia product={product} href={href}/>
  <div className="pawlira-clean-product-info">
   <h3><Link href={href}>{title}</Link></h3>
   <CatalogPrice product={product} showStock={false}/>
  </div>
 </article>;
}
