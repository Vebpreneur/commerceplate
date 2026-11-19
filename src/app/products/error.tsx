"use client";
import Link from "next/link";
export default function CatalogError({reset}:{error:Error & {digest?:string};reset:()=>void}){
 return <section className="container py-24 text-center"><h1 className="mb-4">Sortimentet kunde inte läsas in</h1><p className="mb-6">Försök igen eller återvänd till startsidan.</p><div className="flex flex-wrap gap-3 justify-center"><button type="button" onClick={reset} className="btn btn-primary rounded-full">Försök igen</button><Link href="/" className="btn btn-outline-primary rounded-full">Till startsidan</Link></div></section>;
}
