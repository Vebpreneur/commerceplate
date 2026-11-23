import { getShopPolicy } from "@/lib/shopify";
import Link from "next/link";
import MDXContent from "@/helpers/MDXContent";
import { getSinglePage } from "@/lib/contentParser";
import PageHeader from "@/partials/PageHeader";
import PolicyDocument from "@/components/PolicyDocument";
import SeoMeta from "@/partials/SeoMeta";
import { RegularPage } from "@/types";
import { notFound } from "next/navigation";

// Generate static params
export const dynamic = "force-dynamic";
export const generateStaticParams = () => {
  const regularPages = getSinglePage("pages").map((page: RegularPage) => ({
    regular: page.slug,
  }));
  return [...regularPages, {regular:"shipping-policy"}, {regular:"refund-policy"}];
};

// For all regular pages
const RegularPages = async (props: {
  params: Promise<{ regular: string }>;
}) => {
  const params = await props.params;
  const policies = {
    "privacy-policy": {kind:"privacyPolicy", title:"Integritetspolicy"},
    "terms-services": {kind:"termsOfService", title:"Köpvillkor"},
    "refund-policy": {kind:"refundPolicy", title:"Retur och ångerrätt"},
    "shipping-policy": {kind:"shippingPolicy", title:"Leverans"}
  } as const;
  if (Object.prototype.hasOwnProperty.call(policies,params.regular)) {
    const {kind,title}=policies[params.regular as keyof typeof policies];
    const policy=await getShopPolicy(kind);
    return <><SeoMeta title={title}/><PageHeader title={title}/><section className="pawlira-policy-wrapper"><div className="container"><PolicyDocument kind={kind} body={policy?.body}/></div></section></>;
  }
  const regularData = getSinglePage("pages");
  const data = regularData.find(
    (page: RegularPage) => page.slug === params.regular,
  );

  if (!data) return notFound();

  const { frontmatter, content } = data;
  const { title, meta_title, description, image } = frontmatter;

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <PageHeader title={title} />
      <section className="section">
        <div className="container">
          <div className="content">
            <MDXContent content={content} />
          </div>
        </div>
      </section>
    </>
  );
};

export default RegularPages;
