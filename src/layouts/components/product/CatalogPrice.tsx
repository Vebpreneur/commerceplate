import type {Product} from "@/lib/shopify/types";

export default function CatalogPrice({product}:{product:Product}){
 const available=product.variants.filter(v=>v.availableForSale);
 const choices=available.length?available:product.variants;
 const sorted=[...choices].sort((a,b)=>Number(a.price.amount)-Number(b.price.amount));
 const price=sorted[0]?.price||product.priceRange.minVariantPrice;
 const variable=sorted.some(v=>Number(v.price.amount)!==Number(price.amount));
 const format=(value:{amount:string;currencyCode:string})=>new Intl.NumberFormat("sv-SE",{style:"currency",currency:value.currencyCode}).format(Number(value.amount));
 return <div className="pawlira-catalog-price space-y-1"><div className="flex flex-wrap gap-x-2 items-baseline"><span className="pawlira-catalog-price-value text-base md:text-xl font-semibold text-black">{variable&&<span className="text-xs font-normal mr-1">Från</span>}{format(price)}</span></div><p className="pawlira-catalog-stock"><span aria-hidden="true" className={product.availableForSale?"is-available":""}/>{product.availableForSale?"Tillgänglig att beställa":"Slut i lager"}</p></div>;
}
