import type {ProductVariant} from "@/lib/shopify/types";

// Supplier fulfilment options are not customer-configurable product properties.
// Never match manufacturing origin, material, safety information or ordinary delivery terms.
const normalize=(name:string)=>name.trim().toLowerCase().replace(/[_-]+/g," ").replace(/\s+/g," ");
const logisticsNames=new Set(["ships from","ship from","shipping from","shipped from","dispatch from","dispatch country","shipping origin","shipping country","ship from country","warehouse","warehouse location","fulfillment warehouse","fulfilment warehouse","skickas från","skickas ifrån","levereras från","levereras ifrån","avsändningsland","avsändningsplats","lagerplats","lagerland","lager","frakt från","fraktursprung"]);
export function isFulfillmentOption(name:string){return logisticsNames.has(normalize(name))}
export function customerOptions<T extends {name:string}>(options:T[]){return options.filter(o=>!isFulfillmentOption(o.name))}
export function customerVariants(variants:ProductVariant[]){
 const groups=new Map<string,ProductVariant>();
 for(const variant of variants){
  const key=JSON.stringify(customerOptions(variant.selectedOptions).map(o=>[normalize(o.name),o.value]).sort((a,b)=>a[0].localeCompare(b[0])));
  const old=groups.get(key);
  if(!old||(!old.availableForSale&&variant.availableForSale))groups.set(key,variant);
 }
 return [...groups.values()];
}
function plain(html:string){return html.replace(/<[^>]*>/g," ").replace(/&nbsp;|&#160;/gi," ").replace(/\s+/g," ").trim()}
function fulfillmentLine(line:string){
 const value=plain(line).replace(/^[-•]\s*/,"");
 const label=value.match(/^([^:：]{2,50})\s*[:：]/)?.[1];
 if(label&&isFulfillmentOption(label))return true;
 return /^(?:ships?\s+from|shipped\s+from|shipping\s+from|dispatch(?:ed)?\s+from|skickas\s+(?:i)?från|levereras\s+(?:i)?från)\s+[^.!?]{1,70}[.]?$/i.test(value);
}
export function customerText(value:string){
 return value.split(/\r?\n/).filter(line=>!fulfillmentLine(line)).join("\n").replace(/\n{3,}/g,"\n\n").trim();
}
export function customerHtml(value:string){
 return value.replace(/<(p|li)(?:\s[^>]*)?>([\s\S]*?)<\/\1\s*>/gi,(block,_tag,inner)=>fulfillmentLine(inner)?"":block)
 .replace(/<tr(?:\s[^>]*)?>([\s\S]*?)<\/tr\s*>/gi,(block,inner)=>{
   const first=inner.match(/<t[dh](?:\s[^>]*)?>([\s\S]*?)<\/t[dh]\s*>/i)?.[1];
   return first&&isFulfillmentOption(plain(first).replace(/[:：]$/,""))?"":block;
 })
 .replace(/<(ul|ol)(?:\s[^>]*)?>\s*<\/\1\s*>/gi,"");
}
