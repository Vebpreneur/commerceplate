"use client";
import Image from "next/image";
import {useActionState} from "react";
import {LuPlus} from "react-icons/lu";
import {addSelectedItem} from "@/lib/utils/cartActions";
import type {AccessoryOffer} from "@/lib/shopify/accessories";
function Accessory({item}:{item:AccessoryOffer}){
 const [message,action,pending]=useActionState(addSelectedItem,null);
 return <form action={action} className="pawlira-cart-extra-item"><input type="hidden" name="variantId" value={item.variantId}/>{item.image&&<Image src={item.image} alt="" width={58} height={58} className="object-contain"/>}<div><p>{item.title}</p><strong>{new Intl.NumberFormat("sv-SE",{style:"currency",currency:item.price.currencyCode}).format(Number(item.price.amount))}</strong>{message&&<p role="status">{message}</p>}</div><button type="submit" disabled={pending} aria-label={"Lägg till "+item.title} className="btn btn-outline-primary"><LuPlus size={17} strokeWidth={1.5}/>{pending?"Lägger till":"Lägg till"}</button></form>
}
export default function CartAccessories({items}:{items:AccessoryOffer[]}){if(!items.length)return null;return <div className="pawlira-cart-extras"><h3>Komplettera din beställning</h3>{items.map(item=><Accessory key={item.variantId} item={item}/>)}</div>}
