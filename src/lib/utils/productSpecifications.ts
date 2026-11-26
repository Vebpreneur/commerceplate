import type {ProductField} from "./productFields";
export type Specification={label:string;value:string};
const technicalNames=/^(?:mått|produktmått|dimensioner|dimensions|bredd|höjd|djup|längd|vikt|nettovikt|kapacitet|volym|avfallsbehållare|avfallsbehållarens kapacitet|foderkapacitet|vattenkapacitet|rekommenderad kattvikt|kattvikt|ingång|öppning|ljudnivå|effekt|strömförsörjning|spänning|anslutning|wi-?fi|sensorer|filtertyp|material|power|height|width|depth|weight|capacity|voltage|noise level|sensors|material|size|pet weight|cat weight|entryway|footprint)$/i;
function namedPair(line:string):Specification|null{
 const match=line.match(/^\s*[-•]?\s*([^:：]{1,80})\s*[:：]\s*(.+)$/);
 if(!match)return null;
 const label=match[1].replace(/<[^>]+>/g,"").trim(),value=match[2].replace(/<[^>]+>/g,"").trim();
 return label&&value&&!/^https?:/i.test(value)?{label,value}:null;
}
export function specifications(fields:ProductField[],descriptionHtml=""):Specification[]{
 const canonical=fields.filter(f=>f.key==="spec_json").flatMap(f=>{try{const rows=JSON.parse(f.value);return Array.isArray(rows)?rows.filter((v):v is Specification=>!!v&&typeof v.label==="string"&&typeof v.value==="string"&&!!v.label.trim()&&!!v.value.trim()):[]}catch{return []}});
 if(canonical.length)return canonical.filter((v,i)=>canonical.findIndex(p=>p.label.trim().toLocaleLowerCase("sv-SE")===v.label.trim().toLocaleLowerCase("sv-SE"))===i);
 const meta=fields.filter(f=>f.key==="spec"&&!/^\s*[\[{]/.test(f.value)).flatMap(f=>f.value.split(/\r?\n/)).map(namedPair).filter((v):v is Specification=>!!v);
 // Some Shopify descriptions carry real technical facts in explicit label:value lists.
 // Do not infer missing values from promotional prose.
 const lines=descriptionHtml.replace(/<(?:br|\/li|\/p|\/div|\/tr|\/h[1-6])\b[^>]*>/gi,"\n")
  .replace(/<[^>]*>/g," ").replace(/&nbsp;/gi," ").replace(/&amp;/gi,"&")
  .split(/\r?\n/).map(x=>x.replace(/\s+/g," ").trim()).filter(Boolean);
 const fromDescription=lines.map(namedPair).filter((v):v is Specification=>!!v&&technicalNames.test(v.label));
 const all=[...meta,...fromDescription];
 return all.filter((v,i)=>v.value.length>0&&all.findIndex(p=>p.label.toLocaleLowerCase("sv-SE")===v.label.toLocaleLowerCase("sv-SE"))===i);
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
