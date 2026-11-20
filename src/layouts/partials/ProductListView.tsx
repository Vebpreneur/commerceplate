"use client";
import Link from "next/link";
import CatalogPrice from "@/components/product/CatalogPrice";
import CardMedia from "@/components/product/CardMedia";
import {customerTitle} from "@/lib/utils/customerTitle";
import {LuSearch} from "react-icons/lu";
import {useCatalogProducts,type CatalogData} from "@/hooks/useCatalogProducts";
export default function ProductListView({searchParams,initialData}:{searchParams:Record<string,string|string[]|undefined>;initialData:CatalogData}){
 const {products,endCursor,hasNextPage,isLoadingMore,error,fetchDataWithNewCursor}=useCatalogProducts(searchParams,initialData);
 const query=Array.isArray(searchParams.q)?searchParams.q[0]:searchParams.q;
 return <div><p className="pawlira-catalog-count">Visar {products.length} {products.length===1?"produkt":"produkter"}{query?" · "+query:""}</p>
 {!products.length&&!hasNextPage?<div className="pawlira-empty-catalog"><LuSearch size={38} strokeWidth={1.5}/><h2>Inga produkter hittades</h2><p>Prova en annan sökning eller ändra dina filter.</p><Link href="/products" className="btn btn-primary rounded-full">Visa alla produkter</Link></div>:<div className="pawlira-list-grid">{products.map(product=>{const href="/products/"+encodeURIComponent(product.handle);return <article className="pawlira-list-card pawlira-clean-list" key={product.id}><CardMedia product={product} href={href} list/><div className="pawlira-clean-list-info"><h3><Link href={href} className="pawlira-product-title"><span>{customerTitle(product.title)}</span></Link></h3><CatalogPrice product={product} showStock={false}/></div></article>})}</div>}
 {error&&<p role="alert" className="text-sm text-center mt-4">Det gick inte att läsa in fler produkter. Försök igen.</p>}
 {hasNextPage&&<div className="flex justify-center py-9"><button type="button" className="btn btn-primary rounded-full" disabled={isLoadingMore} onClick={()=>fetchDataWithNewCursor(endCursor)}>{isLoadingMore?"Laddar…":"Visa fler produkter"}</button></div>}</div>;
}
