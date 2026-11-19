"use client";
import CatalogPrice from "@/components/product/CatalogPrice";
import ImageFallback from "@/helpers/ImageFallback";
import type {Product} from "@/lib/shopify/types";
import Link from "next/link";
import {useCatalogProducts, type CatalogData} from "@/hooks/useCatalogProducts";
const ProductListView=({searchParams,initialData}:{searchParams:Record<string,string|string[]|undefined>;initialData:CatalogData})=>{
 const {products,endCursor,hasNextPage,isLoadingMore,error,fetchDataWithNewCursor}=useCatalogProducts(searchParams,initialData);
 const searchValue=Array.isArray(searchParams.q)?searchParams.q[0]:searchParams.q;
  const resultsText = "resultat";

  return (
    <section>
      <div className="row">
        {searchValue ? (
          <p className="mb-4">
            {products.length === 0 && !hasNextPage
              ? "Inga produkter matchar "
              : `Visar ${products.length} ${resultsText} för `}
            <span className="font-bold">&quot;{searchValue}&quot;</span>
          </p>
        ) : null}

        {products.length === 0 && !hasNextPage && (
          <div className="mx-auto pt-5 text-center">
            <ImageFallback
              className="mx-auto mb-6"
              src="/images/no-search-found.png"
              alt="no-search-found"
              width={211}
              height={184}
            />
            <h2 className="h3 mb-4">Inga produkter hittades</h2>
            <p>
              Prova en annan sökning eller ändra filtren.
            </p>
          </div>
        )}

        <div className="row space-y-10">
          {products?.map((product: Product) => {
            const {
              id,
              title,
              handle,
              featuredImage,
              description,
            } = product;


            return (
              <div className="col-12" key={id}>
                <div className="row border-b border-border pb-6">
                  <div className="col-4">
                    <ImageFallback
                      src={featuredImage?.url || "/images/product_image404.jpg"}
                      // fallback={'/images/category-1.png'}
                      width={312}
                      height={269}
                      alt={featuredImage?.altText || title}
                      className="w-full aspect-square object-contain bg-white rounded-lg"
                    />
                  </div>

                  <div className="col-8 py-3 max-md:pt-4">
                    <h2 className="font-bold md:font-normal h4">
                      <Link href={`/products/${handle}`}>{title}</Link>
                    </h2>

                    <CatalogPrice product={product} />

                    <p className="max-md:text-xs text-text-light dark:text-darkmode-text-light my-4 md:mb-8 line-clamp-1 md:line-clamp-3">
                      {description}
                    </p>
                    <Link href={`/products/${handle}`} className="btn btn-outline-primary rounded-full">Visa produkt</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {error&&<p role="alert" className="text-sm text-center mt-4">Det gick inte att läsa in fler produkter. Försök igen.</p>}
      {hasNextPage && <div className="flex justify-center py-8"><button type="button" className="btn btn-outline-primary rounded-full" disabled={isLoadingMore} onClick={()=>fetchDataWithNewCursor(endCursor)}>{isLoadingMore?"Laddar…":"Visa fler produkter"}</button></div>}
      </div>
    </section>
  );
};

export default ProductListView;
