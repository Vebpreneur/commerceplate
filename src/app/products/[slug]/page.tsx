import { AddToCart } from "@/components/cart/AddToCart";
import LoadingProductGallery from "@/components/loadings/skeleton/SkeletonProductGallery";
import ProductGallery from "@/components/product/ProductGallery";
import { VariantSelector } from "@/components/product/VariantSelector";
import { getProduct, getProductRecommendations, shopifyFetch } from "@/lib/shopify";
import PurchaseContent from "@/components/product/PurchaseContent";
import {selectedProductVariant} from "@/lib/utils/productSelection";
import LatestProducts from "@/partials/FeaturedProducts";
import Link from "next/link";
import {productFields} from "@/lib/utils/productFields";
import {customerOptions,customerText,customerHtml,customerVariants} from "@/lib/utils/customerProduct";
import {compatibleAccessories} from "@/lib/shopify/accessories";
import ProductStory,{type ProductFamily} from "@/components/product/ProductStory";
import {getStoreNavigation} from "@/lib/shopify/navigation";
import {LuBookOpen} from "react-icons/lu";
import {LuPackage as FiPackage,LuRefreshCcw as FiRefreshCcw,LuCircleHelp as FiHelpCircle,LuArrowUpRight as FiArrowUpRight,LuChevronRight} from "react-icons/lu";
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

const ProductSingle = async (props: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string,string|string[]|undefined>> }) => {
  const params = await props.params;
  return (
    <Suspense fallback={<LoadingProductGallery />}>
      <ShowProductSingle params={params} searchParams={await props.searchParams} />
    </Suspense>
  );
};

export default ProductSingle;

const ShowProductSingle = async ({ params,searchParams }: { params: { slug: string };searchParams:Record<string,string|string[]|undefined> }) => {
  const product = await loadProduct(params.slug);

  if (!product) return notFound();
  const {
    id,
    title,
    images,
    options,
    variants,
  } = product;

  const selection=new URLSearchParams();for(const [key,value] of Object.entries(searchParams||{})){if(typeof value==="string")selection.set(key,value);}
  const active=selectedProductVariant(variants,selection);
  const variantName=customerOptions(active?.selectedOptions||[]).map(o=>o.value).join(" ");
  const accessoryOnly=/ONLY 18 Rolls|8 Extra Filters Pack/i.test(variantName);
  const bags=/ONLY 18 Rolls/i.test(variantName);
  const model=title.split(" ")[1];
  const variantMessage=accessoryOnly?(bags?"Vald variant: 18 rullar avfallspåsar. Ingen kattlåda ingår.":"Vald variant: åtta utbytesfilter. Ingen vattenfontän ingår."):model==="MILORA"?(/button/i.test(variantName)?"Vald variant: knappstyrning, utan appstyrning.":"Vald variant: Wi-Fi-styrning."):model==="TRIVIA"?(/video/i.test(variantName)?"Vald variant: video och kamera.":/wifi/i.test(variantName)?"Vald variant: Wi-Fi-styrning, utan kamera.":"Vald variant: Basic med knappstyrning, utan kamera.")+(/stainless/i.test(variantName)?" Rostfri skål.":""):model==="TEMIRA"?(/stainless/i.test(variantName)?"Vald variant: rostfri skål.":"Vald variant: plastskål."):model==="RENORA"&&/stainless/i.test(variantName)?"Vald variant: rostfri skål.":null;
  const accessoryCopy=accessoryOnly?JSON.stringify({heading:bags?"Reservpåsar till ÉLUNA":"Reservfilter till AQUORA",description:variantMessage,benefits:bags?["18 rullar avfallspåsar","Avsedda för ÉLUNA","Ingen kattlåda ingår"]:["Åtta utbytesfilter","Avsedda för AQUORA","Ingen fontän ingår"],overview:bags?"Ett separat paket med avfallspåsar för den som redan har ÉLUNA.":"Ett separat filterpaket för den som redan har AQUORA."}):undefined;
  const description=customerText(product.description);
  const descriptionHtml=customerHtml(product.descriptionHtml);
  const [recommended,accessories,navigation]=await Promise.all([getProductRecommendations(id).catch(()=>[]),compatibleAccessories([product.handle],product.priceRange.minVariantPrice.currencyCode),getStoreNavigation()]);
  const guideCategory=navigation.find(c=>c.products.some(p=>p.handle===product.handle));
  const guideHref=guideCategory?"/kopguide?c="+encodeURIComponent(guideCategory.handle):"/kopguide";
  const categoryText=[guideCategory?.title,guideCategory?.handle,...(product.collections?.nodes||[]).map((c:{title?:string})=>c.title),product.title].filter(Boolean).join(" ").toLocaleLowerCase("sv-SE");
  const family:ProductFamily=/kattlå|kattla|litter|toalett/.test(categoryText)?"litter":/foder|feed|matningsautomat/.test(categoryText)?"feeder":/vatten|fontän|fountain/.test(categoryText)?"water":"other";
  const guideHandle=family==="litter"?"kattlador":family==="feeder"?"foderautomater":family==="water"?"vattenfontaner":null;
  const guide=guideHandle?await shopifyFetch<{data:{metaobject:{fields:{key:string;value:string}[]}|null};variables:{handle:string}}>({query:`query CategoryGuide($handle:String!){metaobject(handle:{type:"pawlira_category_guide",handle:$handle}){fields{key value}}}`,variables:{handle:guideHandle}}).then(r=>r.body.data.metaobject).catch(()=>null):null;
  const read=(key:string)=>product.metafields?.find(f=>f?.namespace==="custom"&&f.key===key)?.value;
  const relatedProducts=Array.from(new Map(recommended.filter(p=>p.id!==id&&p.availableForSale).map(p=>[p.id,p])).values()).slice(0,3);
  const fields=productFields(product);
  const galleryImages=Array.from(new Map([...(product.featuredImage?.url?[product.featuredImage]:[]),...images].filter(i=>i.url).map(i=>[i.url.split("?")[0],i])).values());

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
      <section id="kop" className="py-16 lg:py-24 pawlira-product-purchase-section scroll-mt-32">
        <div className="pawlira-pdp-container">
          <nav aria-label="Brödsmulor" className="pawlira-catalog-breadcrumb pawlira-product-breadcrumb"><Link href="/">Hem</Link><LuChevronRight aria-hidden="true" strokeWidth={1.5}/><Link href="/products">Produkter</Link><LuChevronRight aria-hidden="true" strokeWidth={1.5}/><span aria-current="page">{title}</span></nav>
          <div className="pawlira-pdp-grid grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* right side contents  */}
            <div className="min-w-0 lg:col-span-7"><div className="pawlira-gallery-frame">
              <Suspense>
                <ProductGallery images={galleryImages} variants={variants} title={title} />
              </Suspense></div>
            </div>

            {/* left side contents  */}
            <div className="min-w-0 lg:col-span-5"><div className="pawlira-purchase-panel lg:sticky lg:top-28">
              <h1 className="pawlira-h1 mb-5">{title}</h1>

              <div className="my-6"><Suspense><VariantSelector options={options} variants={variants} images={images} /></Suspense></div>

              <div className="flex gap-4 mt-6 mb-6 min-w-0">
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

              {variantMessage&&<p role="status" className="text-sm font-medium mb-4">{variantMessage}</p>}
              <PurchaseContent raw={accessoryCopy||read("cta_content")} fallback={read("short_description")||description} guideFields={accessoryOnly?[]:guide?.fields||[]} guideLabel={family==="litter"?"Passar den min katt?":family==="feeder"?"Utfodringsguide":"Dricksguide"} compatibility={read("compatibility")} safety={read("safety_information")}/>
              <div className="pawlira-purchase-facts">{[{Icon:FiPackage,title:"Leverans",href:"/shipping-policy"},{Icon:FiRefreshCcw,title:"Retur",href:"/refund-policy"},{Icon:FiHelpCircle,title:"Kundservice",href:"/contact"}].map(({Icon,title,href})=><Link href={href} key={href}><Icon size={20} strokeWidth={1.5}/><span>{title}</span><LuChevronRight size={18} strokeWidth={1.5}/></Link>)}</div></div>
            </div>
          </div>
        </div>
      </section>

      {accessoryOnly?<section className="container pawlira-pdp-details-area py-12"><h2 className="text-2xl font-semibold mb-4">Detta ingår</h2><p>{variantMessage}</p><p className="mt-2">Tillbehöret är avsett för {bags?"ÉLUNA":"AQUORA"}.</p></section>:<ProductStory product={{...product,description,descriptionHtml}} descriptionHtml={descriptionHtml} fields={fields} family={family} hasRelated={relatedProducts.length>0}/>}
      <section className="container pawlira-home-section pawlira-pdp-guide-section"><div className="pawlira-pdp-guide-card"><div className="pawlira-pdp-guide-icon"><LuBookOpen size={30} strokeWidth={1.5} aria-hidden="true"/></div><div className="pawlira-pdp-guide-copy"><h2>Hitta rätt produkt för din katt</h2><p>Vår köpguide hjälper dig att jämföra egenskaper, mått och funktioner utifrån din katts behov.</p></div><Link href={guideHref} className="btn btn-primary">Öppna köpguiden <FiArrowUpRight size={18} strokeWidth={1.5}/></Link></div></section>
      {/* Recommended Products section  */}
      {relatedProducts?.length > 0 && <section id="relaterade" className="container pawlira-home-section scroll-mt-48">
          {relatedProducts?.length > 0 && (
            <>
              <div className="pawlira-section-heading"><div><h2>Relaterade produkter</h2></div><Link href="/products" className="pawlira-text-link">Hela sortimentet<FiArrowUpRight size={20} strokeWidth={1.5}/></Link></div>
              <LatestProducts products={relatedProducts} showAllLink={false} />
            </>
          )}
      </section>}
    </>
  );
};
