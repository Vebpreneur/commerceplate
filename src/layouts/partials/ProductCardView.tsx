"use client";
import MerchandiseCard from "@/components/product/MerchandiseCard";
import Link from "next/link";
import {FiSearch,FiArrowRight} from "react-icons/fi";
import {useCatalogProducts,type CatalogData} from "@/hooks/useCatalogProducts";
export default function ProductCardView({searchParams,initialData}:{searchParams:Record<string,string|string[]|undefined>;initialData:CatalogData}){
 const {products,endCursor,hasNextPage,isLoadingMore,error,fetchDataWithNewCursor}=useCatalogProducts(searchParams,initialData);
 const sale=searchParams.sale==="1";
 return <div>
 {products.length===0&&!hasNextPage?<div className="pawlira-empty-catalog"><FiSearch size={38}/><h2>{sale?"Inga aktuella kampanjprodukter":"Inga produkter hittades"}</h2><p>{sale?"Utforska hela sortimentet under tiden.":"Prova en annan sökning eller ändra kategori."}</p><Link href="/products" className="btn btn-primary rounded-full">Visa alla produkter <FiArrowRight className="inline ml-2"/></Link></div>:<div className="pawlira-merch-grid pawlira-catalog-grid">{products.map(p=><MerchandiseCard key={p.id} product={p} catalog/>)}</div>}
 {error&&<p role="alert" className="text-sm text-center mt-4">Det gick inte att läsa in fler produkter. Försök igen.</p>}
 {hasNextPage&&<div className="flex justify-center py-9"><button type="button" className="btn btn-primary rounded-full" disabled={isLoadingMore} onClick={()=>fetchDataWithNewCursor(endCursor)}>{isLoadingMore?"Laddar…":"Visa fler produkter"}</button></div>}
 </div>;
}
