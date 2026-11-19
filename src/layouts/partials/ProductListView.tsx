"use client";
import ImageFallback from "@/helpers/ImageFallback";
import type {Product} from "@/lib/shopify/types";
import Link from "next/link";
import {useCatalogProducts, type CatalogData} from "@/hooks/useCatalogProducts";
import { AddToCart } from "@/components/cart/AddToCart";
import { Suspense } from "react";
const ProductListView=({searchParams,initialData}:{searchParams:Record<string,string|string[]|undefined>;initialData:CatalogData})=>{
 const {products,endCursor,hasNextPage,isLoadingMore,error,fetchDataWithNewCursor}=useCatalogProducts(searchParams,initialData);
 const searchValue=Array.isArray(searchParams.q)?searchParams.q[0]:searchParams.q;
  const resultsText = "resultat";

  return (
    <section>
      <div className="row">
        {searchValue ? (
          <p className="mb-4">
            {products.length === 0
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
              variants,
              handle,
              featuredImage,
              priceRange,
              description,
              compareAtPriceRange,
            } = product;

            const defaultVariantId =
              variants.length > 0 ? variants[0].id : undefined;

            return (
              <div className="col-12" key={id}>
                <div className="row">
                  <div className="col-4">
                    <ImageFallback
                      src={featuredImage?.url || "/images/product_image404.jpg"}
                      // fallback={'/images/category-1.png'}
                      width={312}
                      height={269}
                      alt={featuredImage?.altText || "fallback image"}
                      className="w-full aspect-square object-contain bg-white rounded-lg"
                    />
                  </div>

                  <div className="col-8 py-3 max-md:pt-4">
                    <h2 className="font-bold md:font-normal h4">
                      <Link href={`/products/${handle}`}>{title}</Link>
                    </h2>

                    <div className="flex items-center gap-x-2 mt-2">
                      <span className="text-text-light dark:text-darkmode-text-light text-xs md:text-lg font-bold">
                        {new Intl.NumberFormat("sv-SE",{style:"currency",currency:priceRange.minVariantPrice.currencyCode}).format(Number(priceRange.minVariantPrice.amount))}
                      </span>
                      {Number(compareAtPriceRange?.maxVariantPrice?.amount) > Number(priceRange.minVariantPrice.amount) ? (
                        <s className="text-text-light dark:text-darkmode-text-light text-xs md:text-base font-medium">
                          {new Intl.NumberFormat("sv-SE",{style:"currency",currency:compareAtPriceRange.maxVariantPrice.currencyCode}).format(Number(compareAtPriceRange.maxVariantPrice.amount))}
                        </s>
                      ) : (
                        ""
                      )}
                    </div>

                    <p className="max-md:text-xs text-text-light dark:text-darkmode-text-light my-4 md:mb-8 line-clamp-1 md:line-clamp-3">
                      {description}
                    </p>
                    <Suspense>
                      <AddToCart
                        variants={product?.variants}
                        availableForSale={product?.availableForSale}
                        handle={handle}
                        defaultVariantId={defaultVariantId}
                        stylesClass={
                          "btn btn-outline-primary max-md:btn-sm drop-shadow-md"
                        }
                      />
                    </Suspense>
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
