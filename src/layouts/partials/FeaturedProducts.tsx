"use client";
import { AddToCart } from "@/components/cart/AddToCart";
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
            variants,
            compareAtPriceRange,
          } = product;

          const defaultVariantId =
            variants.length > 0 ? variants[0].id : undefined;
          return (
            <div
              key={id}
              className="text-center col-6 lg:col-4 mb-8 md:mb-10 group relative"
            >
              <div className="relative overflow-hidden">
                <ImageFallback
                  src={featuredImage?.url || "/images/product_image404.jpg"}
                  width={312}
                  height={269}
                  alt={featuredImage?.altText || "fallback image"}
                  className="w-full aspect-square object-contain bg-white rounded-lg"
                />

                <AddToCart
                  variants={product.variants}
                  availableForSale={product.availableForSale}
                  handle={handle}
                  defaultVariantId={defaultVariantId}
                  stylesClass={
                    "btn btn-primary max-md:btn-sm z-10 absolute bottom-12 md:bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full md:group-hover:-translate-y-6 duration-300 ease-in-out whitespace-nowrap drop-shadow-md"
                  }
                />
              </div>
              <div className="py-2 md:py-4 text-center z-20">
                <h2 className="font-medium text-base md:text-lg">
                  <Link
                    className="after:absolute after:inset-0"
                    href={`/products/${handle}`}
                  >
                    {title}
                  </Link>
                </h2>
                <div className="flex flex-wrap justify-center items-center gap-x-2 mt-2 md:mt-4">
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
              </div>
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
