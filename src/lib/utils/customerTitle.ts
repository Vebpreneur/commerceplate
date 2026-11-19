// Display-only title; keep Shopify product title unchanged.
export function customerTitle(title:string){return title.trim().replace(/^pawlira\s*(?:[–—-]\s*)?/i,"").trim()||title}
