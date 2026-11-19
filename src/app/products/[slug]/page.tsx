import { AddToCart } from "@/components/cart/AddToCart";
import LoadingProductGallery from "@/components/loadings/skeleton/SkeletonProductGallery";
import ProductGallery from "@/components/product/ProductGallery";
import Tabs from "@/components/product/Tabs";
import { VariantSelector } from "@/components/product/VariantSelector";
import { getProduct, getProductRecommendations } from "@/lib/shopify";
import LatestProducts from "@/partials/FeaturedProducts";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const product = await getProduct(params.slug);
  if (!product) return notFound();
  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
  };
};

const ProductSingle = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  return (
    <Suspense fallback={<LoadingProductGallery />}>
      <ShowProductSingle params={params} />
    </Suspense>
  );
};

export default ProductSingle;

const ShowProductSingle = async ({ params }: { params: { slug: string } }) => {
  const product = await getProduct(params.slug);

  if (!product) return notFound();
  const {
    id,
    title,
    description,
    descriptionHtml,
    priceRange,
    compareAtPriceRange,
    images,
    options,
    variants,
  } = product;

  const relatedProducts = await getProductRecommendations(id);
  const labels: Record<string,string> = {specifications:"Tekniska specifikationer", spec:"Specifikationer", technical_specifications:"Tekniska specifikationer", details:"Produktdetaljer", detaljer:"Produktdetaljer", included:"Vad ingår?", ingar:"Vad ingår?", features:"Funktioner och egenskaper", faq:"Vanliga frågor"};
  const fields = (product.metafields || []).flatMap(field => {
    if (!field?.value || field.type.includes("reference")) return [];
    let value = field.value;
    if (field.type === "rich_text_field") {
      try { const flatten = (node:any):string => node.type === "text" ? node.value || "" : (node.children || []).map(flatten).join(node.type === "root" || node.type === "list" ? "\n" : ""); value = flatten(JSON.parse(value)); } catch { return []; }
    } else if (field.type.startsWith("list.")) { try { value = JSON.parse(value).join("\n"); } catch {} }
    return [{title: labels[field.key] || field.key, value}];
  });

  const defaultVariantId = variants.length > 0 ? variants[0].id : undefined;

  return (
    <>
      <section className="py-8 lg:py-16 bg-white">
        <div className="container">
          <div className="row justify-center">
            {/* right side contents  */}
            <div className="col-12 lg:col-7">
              <Suspense>
                <ProductGallery images={images} />
              </Suspense>
            </div>

            {/* left side contents  */}
            <div className="col-12 lg:col-5 py-6 lg:py-0 lg:pl-10">
              <h1 className="text-3xl lg:text-4xl tracking-tight mb-4">{title}</h1>

              <div className="flex gap-2 items-center">
                <h4 className="text-text-light dark:text-darkmode-text-light max-md:h2">
                  {new Intl.NumberFormat("sv-SE", {style:"currency",currency:priceRange.minVariantPrice.currencyCode}).format(Number(priceRange.minVariantPrice.amount))}
                </h4>
                {Number(compareAtPriceRange?.maxVariantPrice?.amount) > Number(priceRange.minVariantPrice.amount) ? (
                  <s className="text-text-light max-md:h3 dark:text-darkmode-text-light">
                    {new Intl.NumberFormat("sv-SE", {style:"currency",currency:compareAtPriceRange.maxVariantPrice.currencyCode}).format(Number(compareAtPriceRange.maxVariantPrice.amount))}
                  </s>
                ) : (
                  ""
                )}
              </div>

              <div className="my-10 md:my-10 space-y-6 md:space-y-10">
                <div>
                  {options && (
                    <VariantSelector
                      options={options}
                      variants={variants}
                      images={images}
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-8 md:mt-10 mb-6">
                <Suspense>
                  <AddToCart
                    variants={product?.variants}
                    availableForSale={product?.availableForSale}
                    stylesClass={"btn btn-primary w-full rounded-full py-4"}
                    handle={null}
                    defaultVariantId={defaultVariantId}
                  />
                </Suspense>
              </div>

              {description && <p className="text-sm leading-relaxed text-text-light mb-6">{description.slice(0, 240)}{description.length > 240 ? "…" : ""}</p>}
              <Tabs descriptionHtml={descriptionHtml} fields={fields} />
            </div>
          </div>
        </div>
      </section>

      {/* Description of a product  */}
      <section id="produktinformation" className="section border-t border-border">
        <div className="container"><h2 className="text-center mb-8">Upptäck {title}</h2>
        {images.slice(1,4).map((image,index)=><div key={image.url} className="grid md:grid-cols-2 gap-8 items-center my-12"><img src={image.url} alt={image.altText || title} className={`w-full object-contain max-h-[500px] rounded-lg ${index%2 ? "md:order-2" : ""}`} /><div><h3 className="mb-4">{title}</h3><a href="#produktinformation" className="underline">Produktinformation</a></div></div>)}
        {fields.length > 0 && <div className="max-w-4xl mx-auto"><h2 className="mb-6">Produktdetaljer</h2><Tabs descriptionHtml="" fields={fields} /></div>}
        </div>
      </section>
      <section className="bg-black text-white py-16"><div className="container text-center"><h2 className="!text-white mb-6">Handla med trygghet.</h2><div className="flex flex-wrap justify-center gap-8"><a href="/contact" className="text-white underline">Kundservice</a><a href="/terms-services" className="text-white underline">Köpvillkor</a><a href="/privacy-policy" className="text-white underline">Integritet</a></div></div></section>

      {/* Recommended Products section  */}
      <section className="section">
        <div className="container">
          {relatedProducts?.length > 0 && (
            <>
              <div className="text-center mb-6 md:mb-14">
                <h2 className="mb-2">Du kanske också gillar</h2>
              </div>
              <LatestProducts products={relatedProducts.slice(0, 4)} />
            </>
          )}
        </div>
      </section>
    </>
  );
};
