import {getShopPolicy} from "@/lib/shopify";
import StoreFaq from "@/components/StoreFaq";
export default async function FaqSection(){
 const [shipping,refund,terms]=await Promise.all([getShopPolicy("shippingPolicy"),getShopPolicy("refundPolicy"),getShopPolicy("termsOfService")]);
 const configured=process.env.PAWLIRA_SUPPORT_EMAIL?.trim()||"";
 const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configured)?configured:null;
 return <StoreFaq shipping={shipping} refund={refund} terms={terms} email={email}/>;
}
