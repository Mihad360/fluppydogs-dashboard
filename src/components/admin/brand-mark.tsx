"use client";

import { cn } from "@/lib/utils";

interface BrandMarkProps {
  src: string;
  alt: string;
  tint?: string;
  className?: string;
  imgClassName?: string;
}

export function BrandMark({
  src,
  alt,
  tint,
  className,
  imgClassName,
}: BrandMarkProps) {
  return (
    <div
      className={cn(
        "overflow-hidden flex items-center justify-center",
        className,
      )}
      style={tint ? { background: tint } : undefined}
    >
      {/* Brand assets are local SVGs in /public */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={cn("object-contain", imgClassName)} />
    </div>
  );
}
