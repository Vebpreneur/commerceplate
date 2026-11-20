"use client";

import Image from "next/image";
import { useState } from "react";

const ImageFallback = (props: any) => {
  const { src, fallback, ...rest } = props;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imgSrc = failedSrc === src ? fallback : src;

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={props.alt || ""}
      onError={() => {
        setFailedSrc(src);
      }}
    />
  );
};

export default ImageFallback;
