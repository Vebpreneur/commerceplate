"use client";
import {useRef,useState} from "react";
import type {Product,PageInfo} from "@/lib/shopify/types";
import {getCatalogPage} from "@/lib/shopify/catalog";
export type CatalogData={products:Product[];pageInfo:PageInfo};
export function useCatalogProducts(searchParams:Record<string,string|string[]|undefined>,initialData:CatalogData){
  const [data,setData]=useState(initialData);
  const [isLoadingMore,setLoadingMore]=useState(false);
  const [error,setError]=useState(false);
  const pending=useRef(false);
  const endCursor=data.pageInfo?.endCursor||"";
  const hasNextPage=!!(data.pageInfo?.hasNextPage&&endCursor);
  async function fetchDataWithNewCursor(cursor:string){
    if(pending.current||!cursor)return;
    pending.current=true;
    setLoadingMore(true);
    setError(false);
    try{
      const result=await getCatalogPage(searchParams,cursor);
      setData(prev=>({products:[...prev.products,...result.products.filter(p=>!prev.products.some(old=>old.id===p.id))],pageInfo:result.pageInfo}));
    }catch{setError(true);}finally{pending.current=false;setLoadingMore(false);}
  }
  return {...data,endCursor,hasNextPage,isLoadingMore,error,fetchDataWithNewCursor};
}
