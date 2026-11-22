import type {MetadataRoute} from "next";
import config from "@/config/config.json";
import {getSitemapProducts} from "@/lib/shopify";

export const dynamic="force-dynamic";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const url=(path:string)=>new URL(path,config.site.base_url).toString();
 const pages=["/","/products","/about","/sa-fungerar-det","/guider","/contact","/faq","/compare","/kopguide","/kampanjer","/shipping-policy","/refund-policy","/terms-services","/privacy-policy",...[
  "valja-sjalvrengorande-kattlada","valja-foderautomat","valja-vattenfontan","introducera-ny-kattprodukt","rengora-automatiska-kattprodukter","jamfora-kattprodukter"
 ].map(slug=>"/guider/"+slug)].map(path=>({url:url(path)}));
 const products=await getSitemapProducts();
 return [...pages,...products.map(p=>({url:url("/products/"+encodeURIComponent(p.handle)),lastModified:p.updatedAt}))];
}
