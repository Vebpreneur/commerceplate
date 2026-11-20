"use server";
import {getProducts,getCollectionProducts} from "@/lib/shopify";
import {defaultSort,sorting} from "@/lib/constants";
import {customerVariants} from "@/lib/utils/customerProduct";
import type {Product,PageInfo} from "@/lib/shopify/types";

type Params = Record<string,string|string[]|undefined>;
const one=(v:Params[string])=>Array.isArray(v)?v[0]:v;
const many=(v:Params[string])=>Array.isArray(v)?v:v?[v]:[];
const number=(v:Params[string])=>{const t=one(v);if(!t?.trim())return undefined;const n=Number(t);return Number.isFinite(n)&&n>=0?n:undefined;};
const literal=(s:string)=>'"'+s.replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'"';
const empty:PageInfo={hasNextPage:false,hasPreviousPage:false,endCursor:""};
export async function getCatalogPage(params:Params,cursor?:string):Promise<{products:Product[];pageInfo:PageInfo}>{
  const search=(one(params.q)||"").trim().slice(0,160);
  const vendors=many(params.b).filter(Boolean).slice(0,20);
  const tags=many(params.t).filter(Boolean).slice(0,10);
  const category=one(params.c);
  const sale=one(params.sale)==="1";
  const onSale=(p:Product)=>customerVariants(p.variants).some(v=>v.availableForSale&&v.compareAtPrice?.currencyCode===v.price.currencyCode&&Number(v.compareAtPrice.amount)>Number(v.price.amount));
  const min=number(params.minPrice),max=number(params.maxPrice);
  const sort=sorting.find(item=>item.slug===one(params.sort))||defaultSort;
  if(category&&category!=="all"){
    // Keep collection membership while applying every active filter. Never switch to the global catalog while paginating.
    let next=cursor;
    for(let attempt=0;attempt<5;attempt++){
      const result=await getCollectionProducts({collection:category,sortKey:sort.sortKey,reverse:sort.reverse,cursor:next,first:24});
      const matches=result.products.filter(p=>{
        if(sale&&!onSale(p))return false;
        if(vendors.length&&!vendors.some(v=>v.toLowerCase()===p.vendor.toLowerCase()))return false;
        if(tags.length&&!tags.every(t=>p.tags.some(tag=>tag.toLowerCase()===t.toLowerCase())))return false;
        if((min!==undefined||max!==undefined)&&!p.variants.some(v=>{const n=Number(v.price.amount);return(min===undefined||n>=min)&&(max===undefined||n<=max)}))return false;
        if(search){const haystack=[p.title,p.description,p.vendor,...p.tags].join(" ").toLowerCase();if(!search.toLowerCase().split(/\s+/).every(term=>haystack.includes(term)))return false;}
        return true;
      });
      const pageInfo=result.pageInfo||empty;
      if(matches.length||!pageInfo.hasNextPage||!pageInfo.endCursor||pageInfo.endCursor===next||attempt===4)return {products:matches,pageInfo};
      next=pageInfo.endCursor;
    }
    return {products:[],pageInfo:empty};
  }
  const terms:string[]=[];
  if(search)terms.push(...search.split(/\s+/).filter(Boolean).map(literal));
  if(vendors.length)terms.push("("+vendors.map(v=>"vendor:"+literal(v)).join(" OR ")+")");
  if(tags.length)terms.push(...tags.map(t=>"tag:"+literal(t)));
  if(min!==undefined)terms.push("variants.price:>="+min);
  if(max!==undefined)terms.push("variants.price:<="+max);
  let next=cursor;
  for(let attempt=0;attempt<5;attempt++){
    const result=await getProducts({query:terms.join(" ")||undefined,sortKey:search&&!one(params.sort)?"RELEVANCE":sort.sortKey,reverse:sort.reverse,cursor:next});
    if(!sale)return result;
    const products=result.products.filter(onSale);
    const pageInfo=result.pageInfo||empty;
    if(products.length||!pageInfo.hasNextPage||!pageInfo.endCursor||pageInfo.endCursor===next||attempt===4)return {products,pageInfo};
    next=pageInfo.endCursor;
  }
  return {products:[],pageInfo:empty};
}
