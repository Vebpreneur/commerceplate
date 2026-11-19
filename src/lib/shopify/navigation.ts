import {cache} from "react";
import {categoryName,modelName} from "@/lib/utils/modelName";
import {shopifyFetch} from "@/lib/shopify";

export type NavigationProduct={title:string;handle:string;featuredImage?:{url:string;altText?:string}|null;tags:string[];priceRange?:{minVariantPrice:{amount:string;currencyCode:string};maxVariantPrice:{amount:string;currencyCode:string}}};
export type NavigationCategory={title:string;handle:string;image?:{url:string;altText?:string}|null;products:NavigationProduct[]};

type Result={data:{collections:{nodes:Array<{title:string;handle:string;image?:{url:string;altText?:string}|null;products:{nodes:NavigationProduct[]}}>}}};
export const getStoreNavigation=cache(async():Promise<NavigationCategory[]>=>{
 try{
  const result=await shopifyFetch<Result>({query:`query PawliraNavigation { collections(first:40,sortKey:TITLE){nodes{title handle image{url altText} products(first:60){nodes{title handle tags featuredImage{url altText} priceRange{minVariantPrice{amount currencyCode} maxVariantPrice{amount currencyCode}}}}}}}`});
  return result.body.data.collections.nodes.filter(c=>!["frontpage","home-page","homepage","featured-products","all"].includes(c.handle)&&!c.handle.startsWith("hidden")&&c.title.toLowerCase()!=="home page").map(c=>({...c,title:categoryName(c.title),products:c.products.nodes.filter(p=>!p.tags.includes("nextjs-frontend-hidden"))})).filter(c=>c.products.length>0);
 }catch{return [];}
});
export const navigationProductTitle=modelName;
