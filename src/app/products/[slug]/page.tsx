import { AddToCart } from "@/components/cart/AddToCart";
import LoadingProductGallery from "@/components/loadings/skeleton/SkeletonProductGallery";
import ProductGallery from "@/components/product/ProductGallery";
import Tabs from "@/components/product/Tabs";
import { VariantSelector } from "@/components/product/VariantSelector";
import { getProduct, getProductRecommendations } from "@/lib/shopify";
import LatestProducts from "@/partials/FeaturedProducts";
import Link from "next/link";
import ProductSectionNav from "@/components/product/ProductSectionNav";
import {productFields} from "@/lib/utils/productFields";
import {customerOptions,customerText,customerHtml,customerVariants} from "@/lib/utils/customerProduct";
import DimensionsGuide from "@/components/product/DimensionsGuide";
import {compatibleAccessories} from "@/lib/shopify/accessories";
import ProductStory from "@/components/product/ProductStory";
import {LuPackage as FiPackage,LuRefreshCcw as FiRefreshCcw,LuCircleHelp as FiHelpCircle,LuArrowUpRight as FiArrowUpRight} from "react-icons/lu";
import { notFound } from "next/navigation";
import { Suspense, cache } from "react";
import config from "@/config/config.json";

const loadProduct=cache(getProduct);

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const product = await loadProduct(params.slug);
  if (!product) return notFound();
  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    alternates:{canonical:new URL("/products/"+encodeURIComponent(product.handle),config.site.base_url).toString()},
    openGraph:{title:product.seo.title||product.title,description:product.seo.description||product.description,url:new URL("/products/"+encodeURIComponent(product.handle),config.site.base_url).toString(),images:product.featuredImage?.url?[{url:product.featuredImage.url,alt:product.title}]:[]},
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
  const product = await loadProduct(params.slug);

  if (!product) return notFound();
  const {
    id,
    title,
    images,
    options,
    variants,
  } = product;

  const description=customerText(product.description);
  const descriptionHtml=customerHtml(product.descriptionHtml);
  const relatedProducts = await getProductRecommendations(id).catch(()=>[]);
  const fields=productFields(product);
  const accessories=await compatibleAccessories([product.handle],product.priceRange.minVariantPrice.currencyCode);

  const defaultVariantId = variants.length > 0 ? variants[0].id : undefined;
  const url=new URL("/products/"+encodeURIComponent(product.handle),config.site.base_url).toString();
  const offers=customerVariants(variants).filter(v=>Number.isFinite(Number(v.price.amount))&&Number(v.price.amount)>=0).map(v=>{
    const target=new URL(url);customerOptions(v.selectedOptions).forEach(o=>{if(o.value!=="Default Title")target.searchParams.set(o.name.toLowerCase(),o.value);});
    return {"@type":"Offer",url:target.toString(),price:v.price.amount,priceCurrency:v.price.currencyCode,availability:v.availableForSale?"https://schema.org/InStock":"https://schema.org/OutOfStock"};
  });
  const structuredData={"@context":"https://schema.org","@type":"Product",name:title,description,image:images.map(i=>i.url),url,...(product.vendor?{brand:{"@type":"Brand",name:product.vendor}}:{}),...(offers.length?{offers}:{})};

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}} />
      <section id="kop" className="py-16 lg:py-24 bg-white scroll-mt-32">
        <div className="container">
          <nav aria-label="Brödsmulor" className="flex flex-wrap gap-2 text-xs text-neutral-600 mb-6"><Link href="/">Hem</Link><span aria-hidden="true">/</span><Link href="/products">Produkter</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
          <div className="pawlira-pdp-grid">
            {/* right side contents  */}
            <div className="min-w-0"><div className="lg:sticky lg:top-28 pawlira-gallery-frame">
              <Suspense>
                <ProductGallery images={images} variants={variants} title={title} />
              </Suspense></div>
            </div>

            {/* left side contents  */}
            <div className="min-w-0"><div className="pawlira-purchase-panel">
              <p className="pawlira-eyebrow">Pawlira</p><h1 className="pawlira-h1 mb-5">{title}</h1>

              <div className="my-6"><Suspense><VariantSelector options={options} variants={variants} images={images} /></Suspense></div>

              <div className="flex gap-4 mt-6 mb-6">
                <Suspense>
                  <AddToCart
                    variants={product?.variants}
                    availableForSale={product?.availableForSale}
                    stylesClass={"btn btn-primary pawlira-purchase-cta w-full rounded-full py-4"}
                    handle={null}
                    defaultVariantId={defaultVariantId}
                    productInfo={{title,handle:product.handle,image:product.featuredImage?.url}}
                    accessory={accessories[0]}
                  />
                </Suspense>
              </div>

              {description && <p className="text-sm leading-relaxed text-text-light mb-6">{description.slice(0, 240)}{description.length > 240 ? "…" : ""}</p>}
              <Link href={"/compare?product="+encodeURIComponent(product.handle)} className="pawlira-product-compare-link">Jämför med andra modeller <FiArrowUpRight size={20} strokeWidth={1.5}/></Link>
              <div className="pawlira-purchase-facts">{[{Icon:FiPackage,title:"Leverans",href:"/shipping-policy"},{Icon:FiRefreshCcw,title:"Retur",href:"/refund-policy"},{Icon:FiHelpCircle,title:"Kundservice",href:"/contact"}].map(({Icon,title,href})=><Link href={href} key={href}><Icon size={20} strokeWidth={1.5}/><span>{title}</span><FiArrowUpRight size={20} strokeWidth={1.5}/></Link>)}</div><Tabs descriptionHtml={descriptionHtml} fields={fields} /></div>
            </div>
          </div>
        </div>
      </section>

      <ProductSectionNav hasDetails={fields.some(f=>f.title!=="Vanliga frågor"&&f.value.trim())} hasGallery={images.length>2} hasRelated={relatedProducts.length>0}/>
      <DimensionsGuide fields={fields}/>
      <ProductStory product={{...product,description,descriptionHtml}} fields={fields}/>
      {/* Recommended Products section  */}
      {relatedProducts?.length > 0 && <section id="relaterade" className="container pawlira-home-section scroll-mt-48">
          {relatedProducts?.length > 0 && (
            <>
              <div className="pawlira-section-heading"><div><p className="pawlira-eyebrow">Fler möjligheter</p><h2>Fler produkter för din katt</h2></div><Link href="/products" className="pawlira-text-link">Hela sortimentet<FiArrowUpRight size={20} strokeWidth={1.5}/></Link></div>
              <LatestProducts products={relatedProducts.slice(0, 6)} />
            </>
          )}
      </section>}
    </>
  );
};
