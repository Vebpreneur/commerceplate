"use client";

import StickyBuyBar from "@/components/product/StickyBuyBar";
import type {AccessoryOffer} from "@/lib/shopify/accessories";
import {selectedProductVariant} from "@/lib/utils/productSelection";
import { ProductVariant } from "@/lib/shopify/types";
import { addSelectedItem } from "@/lib/utils/cartActions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {LuMinus as FiMinus,LuPlus as FiPlus,LuShoppingBag as FiShoppingBag,LuLoaderCircle} from "react-icons/lu";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  stylesClass,
  handle,
  buttonId,
}: {
  buttonId?:string;
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  stylesClass: string;
  handle: string | null;
}) {
  const { pending } = useFormStatus();
  const buttonClasses = stylesClass;
  const disabledClasses = "cursor-not-allowed flex";


  if (!availableForSale) {
    return (
      <button
        disabled
        aria-disabled
        className={`${buttonClasses} ${disabledClasses}`}
      >
        Slut i lager
      </button>
    );
  }

  if (!selectedVariantId) {
    return handle ? <Link href={`/products/${handle}`} className={buttonClasses}>Välj variant</Link> : <button type="button" disabled className={`${buttonClasses} ${disabledClasses}`}>Välj variant</button>;
  }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      id={buttonId}
      type="submit"
      disabled={pending}
      aria-label="Lägg i varukorg"
      aria-disabled={pending ? "true" : "false"}
      className={`${buttonClasses}`}
    >
      {pending ? (
        <LuLoaderCircle strokeWidth={1.5}
          className={`animate-spin w-[70px] md:w-[85px]`}
          size={26}
        />
      ) : (
        <span className="inline-flex items-center justify-center gap-3"><FiShoppingBag size={21} strokeWidth={1.5}/> Lägg i varukorg</span>
      )}
    </button>
  );
}

export function AddToCart({
  variants,
  availableForSale,
  stylesClass,
  handle,
  defaultVariantId,
  productInfo,
  accessory,
}: {
  productInfo?:{title:string;handle:string;image?:string};
  accessory?:AccessoryOffer;
  variants: ProductVariant[];
  availableForSale: boolean;
  stylesClass: string;
  handle: string | null;
  defaultVariantId: string | undefined;
}) {
  const [message, formAction, pending] = useActionState(addSelectedItem, null);
  const [quantity,setQuantity]=useState(1);
  const [include,setInclude]=useState(false);
  const searchParams = useSearchParams();

  const variant = selectedProductVariant(variants,searchParams);
  // Use the default variant ID if no variant is found
  const selectedVariantId = variant?.id || (variants.length===0 ? defaultVariantId : undefined);


  return (
    <form action={formAction} className={handle === null ? "w-full" : undefined}>
      <input type="hidden" name="variantId" value={selectedVariantId || ""} />
      {handle===null&&<div className="pawlira-quantity-row"><span className="font-medium text-sm">Antal</span><div className="pawlira-quantity-stepper"><button type="button" aria-label="Minska antal" disabled={quantity<=1} onClick={()=>setQuantity(q=>Math.max(1,q-1))}><FiMinus size={18} strokeWidth={1.5}/></button><output aria-live="polite" aria-label="Antal">{quantity}</output><button type="button" aria-label="Öka antal" disabled={quantity>=10} onClick={()=>setQuantity(q=>Math.min(10,q+1))}><FiPlus size={18} strokeWidth={1.5}/></button></div><input type="hidden" name="quantity" value={quantity}/></div>}
      {productInfo&&<input type="hidden" name="primaryHandle" value={productInfo.handle}/>}
      {accessory&&<label className="pawlira-order-bump"><input type="checkbox" name="accessoryId" value={accessory.variantId} checked={include} onChange={e=>setInclude(e.target.checked)} disabled={pending}/><span><strong>{accessory.title}</strong><small>Lägg till för {new Intl.NumberFormat("sv-SE",{style:"currency",currency:accessory.price.currencyCode}).format(Number(accessory.price.amount))}</small></span></label>}
      <SubmitButton
        buttonId={productInfo?"pawlira-primary-buy":undefined}
        availableForSale={availableForSale && (variant?.availableForSale ?? true)}
        selectedVariantId={selectedVariantId}
        stylesClass={stylesClass}
        handle={handle}
      />
      {productInfo&&<StickyBuyBar title={productInfo.title} image={productInfo.image} variant={variant} pending={pending} available={availableForSale} buttonId="pawlira-primary-buy"/>}
      <p aria-live="polite" className={message ? "mt-3 text-sm text-black" : "sr-only"} role="status">
        {message}
      </p>
    </form>
  );
}
