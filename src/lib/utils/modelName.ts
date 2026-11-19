// Preserve the actual model identifier. Generic product names retain their descriptive text.
export function modelName(title:string){
 const clean=title.trim().replace(/\s+/g," ");
 const parts=clean.split(/\s+[–—-]\s+/);
 const first=parts[0]||clean;
 if(/^pawlira$/i.test(first)&&parts.length>1)return parts.slice(1).join(" – ").trim()||clean;
 if(/^pawlira\s+\S/i.test(first)&&first.length<=55&&parts.length>1)return first;
 return clean.replace(/^Pawlira\s+/i,"").trim()||clean;
}
export function categoryName(title:string){
 return title.trim().replace(/\s+/g," ").replace(/Självrengörande Kattlådor/gi,"Självrengörande kattlådor");
}
