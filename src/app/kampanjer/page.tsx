import Link from "next/link";
import ProductCardView from "@/partials/ProductCardView";
import PawliraPageHero from "@/partials/PawliraPageHero";
import {getCatalogPage} from "@/lib/shopify/catalog";
import {LuArrowDown,LuArrowUpRight} from "react-icons/lu";

export const metadata={title:"Kampanjer | Pawlira",description:"Se produkter som för närvarande har ett aktivt erbjudande hos Pawlira."};
export const dynamic="force-dynamic";
export default async function Campaigns(){
 const searchParams={sale:"1"};
 const initialData=await getCatalogPage(searchParams);
 const active=initialData.products.length>0;
 return <div className="pawlira-catalog-page pawlira-campaign-page"><PawliraPageHero className="pawlira-campaign-hero" title="Kampanjer" description={active?"Här hittar du produkter med aktuella erbjudandepriser. Pris och lagerstatus visas på respektive produktkort.":"Det finns inga aktiva kampanjer just nu. Kom gärna tillbaka senare eller utforska hela sortimentet."}>
  {active?<Link href="#kampanjprodukter" className="btn btn-inverse rounded-full mt-6">Se aktuella erbjudanden <LuArrowDown size={18}/></Link>:<Link href="/products" className="btn btn-inverse rounded-full mt-6">Utforska sortimentet <LuArrowUpRight size={18}/></Link>}
 </PawliraPageHero><section id="kampanjprodukter" className="container pawlira-catalog-width pawlira-catalog-whisker-section scroll-mt-36"><div className="pawlira-catalog-top-row"><h2>Erbjudanden</h2></div><ProductCardView key="campaigns" searchParams={searchParams} initialData={initialData}/></section></div>;
}
