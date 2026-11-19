"use client";
import Image from "next/image";
import Link from "next/link";
import CatalogPrice from "@/components/product/CatalogPrice";
import {customerTitle} from "@/lib/utils/customerTitle";
import {catalogDescription} from "@/lib/utils/catalogPresentation";
import {customerText} from "@/lib/utils/customerProduct";
import {LuArrowUpRight as FiArrowUpRight,LuChartNoAxesColumn as FiBarChart2,LuImage as FiImage,LuSearch as FiSearch} from "react-icons/lu";
import {useCatalogProducts,type CatalogData} from "@/hooks/useCatalogProducts";
export default function ProductListView({searchParams,initialData}:{searchParams:Record<string,string|string[]|undefined>;initialData:CatalogData}){
 const {products,endCursor,hasNextPage,isLoadingMore,error,fetchDataWithNewCursor}=useCatalogProducts(searchParams,initialData);
 const query=Array.isArray(searchParams.q)?searchParams.q[0]:searchParams.q;
 return <div><p className="pawlira-catalog-count">Visar {products.length} {products.length===1?"produkt":"produkter"}{query?" · "+query:""}</p>
 {!products.length&&!hasNextPage?<div className="pawlira-empty-catalog"><FiSearch size={38} strokeWidth={1.5}/><h2>Inga produkter hittades</h2><p>Prova en annan sökning eller ändra dina filter.</p><Link href="/products" className="btn btn-primary rounded-full">Visa alla produkter</Link></div>:<div className="pawlira-list-grid">{products.map(product=>{const href="/products/"+encodeURIComponent(product.handle);const image=product.featuredImage||product.images[0];return <article className="pawlira-list-card" key={product.id}><Link href={href} aria-label={product.title} className="pawlira-list-photo">{image?.url?<Image src={image.url} alt={image.altText||product.title} fill sizes="(max-width: 640px) 40vw, 250px" className="object-contain"/>:<FiImage size={32} strokeWidth={1.5}/>}</Link><div className="pawlira-list-copy"><p className="pawlira-eyebrow pawlira-card-brand">Pawlira</p><h3><Link href={href}>{customerTitle(product.title)}</Link></h3><p className="pawlira-merch-description">{catalogDescription({...product,description:customerText(product.description)})}</p><CatalogPrice product={product}/><div className="pawlira-list-actions"><Link href={href} className="pawlira-merch-cta" aria-label={"Visa produkt: "+product.title}>Visa produkt<FiArrowUpRight size={21} strokeWidth={1.5}/></Link><Link href={"/compare?product="+encodeURIComponent(product.handle)} className="pawlira-card-compare-link"><FiBarChart2 size={15} strokeWidth={1.5}/> Jämför modell</Link></div></div></article>})}</div>}
 {error&&<p role="alert" className="text-sm text-center mt-4">Det gick inte att läsa in fler produkter. Försök igen.</p>}
 {hasNextPage&&<div className="flex justify-center py-9"><button type="button" className="btn btn-primary rounded-full" disabled={isLoadingMore} onClick={()=>fetchDataWithNewCursor(endCursor)}>{isLoadingMore?"Laddar…":"Visa fler produkter"}</button></div>}</div>;
}
