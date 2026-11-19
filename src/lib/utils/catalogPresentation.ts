import type {Product} from "@/lib/shopify/types";
const clean=(value:string)=>value.replace(/\s+/g," ").trim();
const labels:Record<string,string>={color:"Färg",colour:"Färg",färg:"Färg",size:"Storlek",storlek:"Storlek",material:"Material",style:"Utförande",model:"Modell",modell:"Modell",capacity:"Kapacitet",kapacitet:"Kapacitet"};
export function catalogDescription(product:Product){
 const description=clean(product.description||"");
 if(!description||description.toLowerCase()===clean(product.title).toLowerCase())return "";
 if(description.length<=180)return description;
 const start=description.slice(0,180);
 const end=start.lastIndexOf(" ");
 return start.slice(0,end>110?end:180).replace(/[,:;\s]+$/,"")+"…";
}
export function catalogOptions(product:Product){
 return product.options.flatMap(option=>{
  const values=[...new Set(option.values.map(clean).filter(v=>v&&!/^default title$/i.test(v)))];
  if(!values.length||/^title$/i.test(option.name))return [];
  const label=labels[option.name.trim().toLowerCase()]||option.name;
  const formatted=values.length<=3&&values.join(", ").length<=56?values.join(", "):values.length+" alternativ";
  return [{label,value:formatted}];
 }).slice(0,2);
}
