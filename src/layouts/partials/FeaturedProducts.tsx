import MerchandiseCard from "@/components/product/MerchandiseCard";
import type {Product} from "@/lib/shopify/types";
import Link from "next/link";
export default function FeaturedProducts({products,showAllLink=true}:{products:Product[];showAllLink?:boolean}){
 return <><div className="pawlira-merch-grid pawlira-featured-grid">{products.map(p=><MerchandiseCard key={p.id} product={p}/>)}</div>{showAllLink&&<div className="flex justify-center mt-9"><Link href="/products" className="btn btn-primary rounded-full">Visa alla produkter</Link></div>}</>;
}
