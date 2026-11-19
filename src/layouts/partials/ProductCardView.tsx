"use client";
import ImageFallback from "@/helpers/ImageFallback";
import type {Product} from "@/lib/shopify/types";
import Link from "next/link";
import {useCatalogProducts, type CatalogData} from "@/hooks/useCatalogProducts";

const ProductCardView=({searchParams,initialData}:{searchParams:Record<string,string|string[]|undefined>;initialData:CatalogData})=>{
 const {products,endCursor,hasNextPage,isLoadingMore,error,fetchDataWithNewCursor}=useCatalogProducts(searchParams,initialData);
 const searchValue=Array.isArray(searchParams.q)?searchParams.q[0]:searchParams.q;
  const resultsText = products.length === 1 ? "resultat" : "resultat";

  return (
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
            className="mx-auto mb-6 w-[211px] h-[184px]"
            src="/images/no-search-found.png"
            alt="no-search-found"
            width={211}
            height={184}
            priority={true}
          />
          <h2 className="h3 mb-4">Inga produkter hittades</h2>
          <p>
            Prova en annan sökning eller ändra filtren.
          </p>
        </div>
      )}

      <div className="row gap-y-8 md:gap-y-14">
        {products.map((product) => {
          return (
            <div
              key={product.id}
              className="col-6"
            >
              <div className="pawlira-card"><Link href={`/products/${product.handle}`} className="pawlira-card-image" aria-label={product.title}>
                <ImageFallback
                  src={
                    product.featuredImage?.url || "/images/product_image404.jpg"
                  }
                  width={312}
                  height={269}
                  alt={product.featuredImage?.altText || product.title}
                  className="w-full aspect-square object-contain bg-white rounded-lg mx-auto"
                />

              </Link>
              <div className="pawlira-card-body">
                <h2 className="font-medium text-base md:text-xl">
                  <Link
                    className="pawlira-card-title"
                    href={`/products/${product?.handle}`}
                  >
                    {product?.title}
                  </Link>
                </h2>
                <div className="flex flex-wrap items-center gap-x-2">
                  <span className="text-base md:text-xl font-bold text-text-dark dark:text-darkmode-text-dark">
                    {new Intl.NumberFormat("sv-SE",{style:"currency",currency:product.priceRange.minVariantPrice.currencyCode}).format(Number(product.priceRange.minVariantPrice.amount))}
                  </span>
                  {Number(product.compareAtPriceRange?.maxVariantPrice?.amount) > Number(product.priceRange.minVariantPrice.amount) ? (
                    <s className="text-text-light dark:text-darkmode-text-light text-xs md:text-base font-medium">
                      {new Intl.NumberFormat("sv-SE",{style:"currency",currency:product.compareAtPriceRange.maxVariantPrice.currencyCode}).format(Number(product.compareAtPriceRange.maxVariantPrice.amount))}
                    </s>
                  ) : (
                    ""
                  )}
                </div>
                <Link href={`/products/${product.handle}`} className="btn btn-outline-primary pawlira-card-action">Visa produkt</Link>
              </div></div>
            </div>
          );
        })}
      </div>

      {error&&<p role="alert" className="text-sm text-center mt-4">Det gick inte att läsa in fler produkter. Försök igen.</p>}
      {hasNextPage && <div className="flex justify-center py-8"><button type="button" className="btn btn-outline-primary rounded-full" disabled={isLoadingMore} onClick={()=>fetchDataWithNewCursor(endCursor)}>{isLoadingMore?"Laddar…":"Visa fler produkter"}</button></div>}
    </div>
  );
};

export default ProductCardView;
