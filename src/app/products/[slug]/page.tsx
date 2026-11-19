import { AddToCart } from "@/components/cart/AddToCart";
import LoadingProductGallery from "@/components/loadings/skeleton/SkeletonProductGallery";
import ProductGallery from "@/components/product/ProductGallery";
import Tabs from "@/components/product/Tabs";
import { VariantSelector } from "@/components/product/VariantSelector";
import { getProduct, getProductRecommendations } from "@/lib/shopify";
import LatestProducts from "@/partials/FeaturedProducts";
import Link from "next/link";
import Accordion from "@/shortcodes/Accordion";
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
      <section id="kop" className="py-8 lg:py-16 bg-white scroll-mt-32">
        <div className="container">
          <nav aria-label="Brödsmulor" className="flex flex-wrap gap-2 text-xs text-neutral-600 mb-6"><Link href="/">Hem</Link><span aria-hidden="true">/</span><Link href="/products">Produkter</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
          <div className="row justify-center">
            {/* right side contents  */}
            <div className="col-12 lg:col-7"><div className="lg:sticky lg:top-28">
              <Suspense>
                <ProductGallery images={images} />
              </Suspense></div>
            </div>

            {/* left side contents  */}
            <div className="col-12 lg:col-5 py-6 lg:py-0 lg:pl-10">
              <h1 className="text-3xl lg:text-4xl tracking-tight mb-4">{title}</h1>

              <div className="my-6"><Suspense><VariantSelector options={options} variants={variants} images={images} /></Suspense></div>

              <div className="flex gap-4 mt-6 mb-6">
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

      <nav aria-label="Produktnavigation" className="pawlira-detail-nav bg-black text-white py-3"><div className="container flex overflow-x-auto gap-6 md:justify-center md:gap-10 text-sm"><a href="#kop" className="!text-white">Köp</a><a href="#produktinformation" className="!text-white">Produktöversikt</a>{fields.length > 0 && <a href="#specifikationer" className="!text-white">Produktdetaljer</a>}<a href="#kundinformation" className="!text-white">Kundinformation</a></div></nav>
      {/* Description of a product  */}
      <section id="produktinformation" className="section border-t border-border scroll-mt-32">
        <div className="container"><h2 className="text-center mb-8">Upptäck {title}</h2>
        <div className="grid md:grid-cols-2 items-center gap-10 my-10">{images[0] && <img src={images[0].url} alt={images[0].altText || title} className="w-full max-h-[540px] object-contain" />}<div>{description && <div className="content text-lg max-w-none" dangerouslySetInnerHTML={{__html:descriptionHtml.split("--- split content ---")[0]}} />}</div></div>
        {images.length > 1 && <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 my-10">{images.slice(1,7).map((image,index)=><div key={image.url+index} className="pawlira-card-image border border-border"><img src={image.url} alt={image.altText || title} className="w-full aspect-square object-contain" loading="lazy" /></div>)}</div>}
        {fields.length > 0 && <div id="specifikationer" className="max-w-4xl mx-auto scroll-mt-32 mt-12"><h2 className="mb-6">Produktdetaljer</h2><div className="grid md:grid-cols-2 gap-4">{fields.map((field,index)=><article key={field.title+index} className="rounded-xl border border-border p-6"><h3 className="text-xl mb-3">{field.title}</h3><p className="whitespace-pre-wrap leading-relaxed">{field.value}</p></article>)}</div></div>}
        </div>
      </section>
      <section className="bg-black text-white py-16"><div className="container text-center"><h2 className="!text-white mb-6">Handla med trygghet.</h2><div className="flex flex-wrap justify-center gap-8"><a href="/contact" className="text-white underline">Kundservice</a><a href="/terms-services" className="text-white underline">Köpvillkor</a><a href="/shipping-policy" className="text-white underline">Leverans</a><a href="/refund-policy" className="text-white underline">Retur och ångerrätt</a><a href="/privacy-policy" className="text-white underline">Integritet</a></div></div></section>

      <section id="kundinformation" className="py-16 scroll-mt-28"><div className="container"><h2 className="text-center mb-8">Vanliga frågor</h2><div className="max-w-3xl mx-auto"><Accordion title="Var hittar jag produktens specifikationer?"><p>Se produktinformationen ovan för tillgängliga tekniska uppgifter.</p></Accordion><Accordion title="Hur fungerar leverans och retur?"><Link href="/shipping-policy" className="underline">Leveransvillkor</Link> · <Link href="/refund-policy" className="underline">Retur och ångerrätt</Link></Accordion><Accordion title="Behöver du hjälp att välja?"><Link href="/contact" className="underline">Kontakta Pawlira</Link></Accordion></div></div></section>
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
