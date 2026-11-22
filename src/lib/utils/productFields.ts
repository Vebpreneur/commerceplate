import type {Product} from "@/lib/shopify/types";
import {customerText} from "./customerProduct";
export type ProductField={title:string;value:string;key:string};
const labels:Record<string,{title:string;key:string}>={
 specifications:{title:"Tekniska specifikationer",key:"spec"},spec:{title:"Tekniska specifikationer",key:"spec"},technical_specifications:{title:"Tekniska specifikationer",key:"spec"},specifikationer:{title:"Tekniska specifikationer",key:"spec"},technical_details:{title:"Tekniska specifikationer",key:"spec"},dimensions:{title:"Tekniska specifikationer",key:"spec"},measurements:{title:"Tekniska specifikationer",key:"spec"},
 details:{title:"Produktdetaljer",key:"details"},detaljer:{title:"Produktdetaljer",key:"details"},product_details:{title:"Produktdetaljer",key:"details"},
 included:{title:"Vad ingår?",key:"included"},ingar:{title:"Vad ingår?",key:"included"},what_is_included:{title:"Vad ingår?",key:"included"},package_contents:{title:"Vad ingår?",key:"included"},features:{title:"Funktioner och egenskaper",key:"features"},faq:{title:"Vanliga frågor",key:"faq"},
 compatibility:{title:"Kompatibilitet",key:"compatibility"},kompatibilitet:{title:"Kompatibilitet",key:"compatibility"},
 usage:{title:"Användning och underhåll",key:"usage"},anvandning:{title:"Användning och underhåll",key:"usage"},maintenance:{title:"Användning och underhåll",key:"usage"},underhall:{title:"Användning och underhåll",key:"usage"},care_instructions:{title:"Användning och underhåll",key:"usage"},
 safety:{title:"Säkerhetsinformation",key:"safety"},sakerhet:{title:"Säkerhetsinformation",key:"safety"},safety_information:{title:"Säkerhetsinformation",key:"safety"},sakerhetsinformation:{title:"Säkerhetsinformation",key:"safety"},safety_instructions:{title:"Säkerhetsinformation",key:"safety"}
};
type RichNode={type?:string;value?:string;children?:RichNode[]};
function flatten(node:RichNode):string{
 if(node.type==="text")return node.value||"";
 return (node.children||[]).map(flatten).join(node.type==="root"||node.type==="list"?"\n":"");
}
export function productFields(product:Product):ProductField[]{
 const values=(product.metafields||[]).flatMap(field=>{
  if(!field?.value||field.type.includes("reference")||!labels[field.key])return [];
  let value=field.value;
  try{if(field.type==="rich_text_field")value=flatten(JSON.parse(value));else if(field.type.startsWith("list.")){const items=JSON.parse(value);if(!Array.isArray(items))return [];value=items.filter(item=>typeof item==="string"||typeof item==="number"||typeof item==="boolean").join("\n")}}
  catch{return []}
  value=customerText(value);
  return value.trim()?[{...labels[field.key],value:value.trim()}]:[];
 });
 return values.filter((field,i,all)=>all.findIndex(other=>other.key===field.key&&other.value===field.value)===i);
}
