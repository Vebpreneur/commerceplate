"use client";

import { ProductVariant } from "@/lib/shopify/types";
import { addSelectedItem } from "@/lib/utils/cartActions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { BiLoaderAlt } from "react-icons/bi";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  stylesClass,
  handle,
}: {
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
      type="submit"
      disabled={pending}
      aria-label="Lägg i varukorg"
      aria-disabled={pending ? "true" : "false"}
      className={`${buttonClasses}`}
    >
      {pending ? (
        <BiLoaderAlt
          className={`animate-spin w-[70px] md:w-[85px]`}
          size={26}
        />
      ) : (
        "Lägg i varukorg"
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
}: {
  variants: ProductVariant[];
  availableForSale: boolean;
  stylesClass: string;
  handle: string | null;
  defaultVariantId: string | undefined;
}) {
  const [message, formAction] = useActionState(addSelectedItem, null);
  const searchParams = useSearchParams();

  // Find the variant based on selected options
  const optionNames = new Set(variants.flatMap(v => v.selectedOptions.map(o => o.name.toLowerCase())));
  const selectedOptions = Array.from(searchParams.entries()).filter(([key]) => optionNames.has(key));
  const matches = variants.filter((variant: ProductVariant) =>
    selectedOptions.every(([key, value]) =>
      variant.selectedOptions.some(
        (option) => option.name.toLowerCase() === key && option.value === value,
      ),
    ),
  );

  const variant = matches.find(v => v.availableForSale) || matches[0];
  // Use the default variant ID if no variant is found
  const selectedVariantId = variant?.id || (selectedOptions.length === 0 ? defaultVariantId : undefined);


  return (
    <form action={formAction} className={handle === null ? "w-full" : undefined}>
      <input type="hidden" name="variantId" value={selectedVariantId || ""} />
      <SubmitButton
        availableForSale={availableForSale && (variant?.availableForSale ?? true)}
        selectedVariantId={selectedVariantId}
        stylesClass={stylesClass}
        handle={handle}
      />
      <p aria-live="polite" className={message ? "mt-3 text-sm text-black" : "sr-only"} role="status">
        {message}
      </p>
    </form>
  );
}
