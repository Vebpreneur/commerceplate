import type {ProductField} from "./productFields";
export type Specification={label:string;value:string};
export function specifications(fields:ProductField[]):Specification[]{
 const pairs=fields.filter(f=>["spec","details","features"].includes(f.key)).flatMap(f=>f.value.split(/\r?\n/)).map(line=>{
  const match=line.match(/^\s*[-•]?\s*([^:：]{1,80})\s*[:：]\s*(.+)$/);
  return match?{label:match[1].trim(),value:match[2].trim()}:null;
 }).filter((v):v is Specification=>!!v);
 return pairs.filter((v,i)=>v.value.length>0&&pairs.findIndex(p=>p.label.toLowerCase()===v.label.toLowerCase())===i);
}
export function findSpecification(specs:Specification[],pattern:RegExp){
 return specs.find(s=>pattern.test(s.label))?.value;
}
// Only use explicitly named technical fields. Do not infer performance values from marketing copy.
export function hotspotSpecifications(fields:ProductField[]){
 const specs=specifications(fields);
 return [
 {sensor:findSpecification(specs,/^(?:sensorer|säkerhetssensorer|säkerhetsfunktioner|viktsensorer|sensors|safety sensors|safety features)$/i)},
 {noise:findSpecification(specs,/^(?:ljudnivå|ljudstyrka|noise level|sound level|driftljud)$/i)},
 {odor:findSpecification(specs,/^(?:luktkontroll|luktfilter|odour control|odor control|kolfilter|filtertyp)$/i)},
 {cleaning:findSpecification(specs,/^(?:rengöringsfunktion|rengöringscykel|rengöringssystem|nivåreglering|cleaning cycle|cleaning system)$/i)}
 ].map((entry)=>Object.values(entry)[0]||null);
}
