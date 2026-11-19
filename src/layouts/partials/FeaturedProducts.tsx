"use client";
import CatalogPrice from "@/components/product/CatalogPrice";
import ImageFallback from "@/helpers/ImageFallback";
import { Product } from "@/lib/shopify/types";
import Link from "next/link";

const FeaturedProducts = ({ products, showAllLink = true }: { products: Product[]; showAllLink?: boolean }) => {

  return (
    <>
      <div className="row">
        {products.map((product: Product) => {
          const {
            id,
            title,
            handle,
            featuredImage,
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
                <CatalogPrice product={product} />
                <Link href={`/products/${handle}`} className="btn btn-outline-primary pawlira-card-action">Visa produkt</Link>
              </div></div>
            </div>
          );
        })}
      </div>

      {showAllLink && <div className="flex justify-center">
        <Link
          className="btn btn-sm md:btn-lg btn-primary font-medium rounded-full"
          href={"/products"}
        >
          Visa alla produkter
        </Link>
      </div>}
    </>
  );
};

export default FeaturedProducts;
