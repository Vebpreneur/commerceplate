"use client";
import ImageFallback from "@/helpers/ImageFallback";
import { Product } from "@/lib/shopify/types";
import Link from "next/link";

const FeaturedProducts = ({ products }: { products: Product[] }) => {

  return (
    <>
      <div className="row">
        {products.map((product: any) => {
          const {
            id,
            title,
            handle,
            featuredImage,
            priceRange,
            compareAtPriceRange,
          } = product;

          return (
            <div
              key={id}
              className="col-6 lg:col-4 mb-6 md:mb-8"
            >
              <div className="pawlira-card"><Link href={`/products/${handle}`} className="pawlira-card-image" aria-label={title}>
                <ImageFallback
                  src={featuredImage?.url || "/images/product_image404.jpg"}
                  width={312}
                  height={269}
                  alt={featuredImage?.altText || title}
                  className="w-full aspect-square object-contain bg-white rounded-lg"
                />

              </Link>
              <div className="pawlira-card-body">
                <h2 className="font-medium text-base md:text-lg">
                  <Link
                    className="pawlira-card-title"
                    href={`/products/${handle}`}
                  >
                    {title}
                  </Link>
                </h2>
                <div className="flex flex-wrap items-center gap-x-2">
                  <span className="text-base md:text-xl font-bold text-text-dark dark:text-darkmode-text-dark">
                    {new Intl.NumberFormat("sv-SE", { style: "currency", currency: priceRange.minVariantPrice.currencyCode }).format(Number(priceRange.minVariantPrice.amount))}
                  </span>

                  {Number(compareAtPriceRange?.maxVariantPrice?.amount) > Number(priceRange.minVariantPrice.amount) ? (
                    <s className="text-text-light dark:text-darkmode-text-light text-xs md:text-base font-medium">
                      {new Intl.NumberFormat("sv-SE", { style: "currency", currency: compareAtPriceRange.maxVariantPrice.currencyCode }).format(Number(compareAtPriceRange.maxVariantPrice.amount))}
                    </s>
                  ) : (
                    ""
                  )}
                </div>
                <Link href={`/products/${handle}`} className="btn btn-outline-primary pawlira-card-action">Visa produkt</Link>
              </div></div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Link
          className="btn btn-sm md:btn-lg btn-primary font-medium"
          href={"/products"}
        >
          Visa alla produkter
        </Link>
      </div>
    </>
  );
};

export default FeaturedProducts;
