import {LuTruck,LuShieldCheck,LuCreditCard} from "react-icons/lu";
import Link from "next/link";
export default function PurchaseAssurance(){return <div className="pawlira-purchase-assurance"><Link href="/shipping-policy"><LuTruck size={18} strokeWidth={1.5}/> Fri frakt inom Sverige</Link><Link href="/refund-policy"><LuShieldCheck size={18} strokeWidth={1.5}/> Retur och reklamation</Link><span><LuCreditCard size={18} strokeWidth={1.5}/> Betalningsalternativ i kassan</span></div>}
