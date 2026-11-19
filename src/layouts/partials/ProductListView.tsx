"use client";
import Image from "next/image";
import Link from "next/link";
import CatalogPrice from "@/components/product/CatalogPrice";
import {FiArrowUpRight,FiImage,FiSearch} from "react-icons/fi";
import {useCatalogProducts,type CatalogData} from "@/hooks/useCatalogProducts";
export default function ProductListView({searchParams,initialData}:{searchParams:Record<string,string|string[]|undefined>;initialData:CatalogData}){
 const {products,endCursor,hasNextPage,isLoadingMore,error,fetchDataWithNewCursor}=useCatalogProducts(searchParams,initialData);
 const query=Array.isArray(searchParams.q)?searchParams.q[0]:searchParams.q;
 return <div><p className="pawlira-catalog-count">Visar {products.length} {products.length===1?"produkt":"produkter"}{query?" · "+query:""}</p>
 {!products.length&&!hasNextPage?<div className="pawlira-empty-catalog"><FiSearch size={38}/><h2>Inga produkter hittades</h2><p>Prova en annan sökning eller ändra dina filter.</p><Link href="/products" className="btn btn-outline-primary rounded-full">Visa alla produkter</Link></div>:<div className="pawlira-list-grid">{products.map(product=>{const href="/products/"+encodeURIComponent(product.handle);const image=product.featuredImage||product.images[0];return <article className="pawlira-list-card" key={product.id}><Link href={href} aria-label={product.title} className="pawlira-list-photo">{image?.url?<Image src={image.url} alt={image.altText||product.title} fill sizes="(max-width: 640px) 40vw, 250px" className="object-contain"/>:<FiImage size={32}/>}</Link><div className="pawlira-list-copy"><h3><Link href={href}>{product.title}</Link></h3>{product.description&&<p className="line-clamp-3">{product.description}</p>}<CatalogPrice product={product}/><Link href={href} className="pawlira-merch-cta">Visa produkt<FiArrowUpRight size={19}/></Link></div></article>})}</div>}
 {error&&<p role="alert" className="text-sm text-center mt-4">Det gick inte att läsa in fler produkter. Försök igen.</p>}
 {hasNextPage&&<div className="flex justify-center py-9"><button type="button" className="btn btn-outline-primary rounded-full" disabled={isLoadingMore} onClick={()=>fetchDataWithNewCursor(endCursor)}>{isLoadingMore?"Laddar…":"Visa fler produkter"}</button></div>}</div>;
}
