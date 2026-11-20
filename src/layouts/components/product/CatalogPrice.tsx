import type {Product} from "@/lib/shopify/types";
import {customerVariants} from "@/lib/utils/customerProduct";

export default function CatalogPrice({product,showStock=true}:{product:Product;showStock?:boolean}){
 const variants=customerVariants(product.variants);
 const available=variants.filter(v=>v.availableForSale);
 const choices=available.length?available:variants;
 const sorted=[...choices].sort((a,b)=>Number(a.price.amount)-Number(b.price.amount));
 const price=sorted[0]?.price||product.priceRange.minVariantPrice;
 const compare=sorted[0]?.compareAtPrice;
 const discounted=!!compare&&compare.currencyCode===price.currencyCode&&Number(compare.amount)>Number(price.amount)&&!!sorted[0]?.availableForSale;
 const variable=sorted.some(v=>Number(v.price.amount)!==Number(price.amount));
 const format=(value:{amount:string;currencyCode:string})=>new Intl.NumberFormat("sv-SE",{style:"currency",currency:value.currencyCode}).format(Number(value.amount));
 return <div className="pawlira-catalog-price space-y-1"><div className="flex flex-wrap gap-x-2 items-baseline"><span className="pawlira-catalog-price-value text-base md:text-xl font-semibold text-black">{variable&&<span className="text-xs font-normal mr-1">Från</span>}{format(price)}</span>{discounted&&compare&&<span className="pawlira-old-price text-sm text-neutral-500 line-through">{format(compare)}</span>}</div>{showStock&&!product.availableForSale&&<p className="pawlira-catalog-stock"><span aria-hidden="true"/>Slut i lager</p>}</div>;
}
