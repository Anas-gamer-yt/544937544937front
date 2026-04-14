"use client";

import { useEffect, useMemo, useState } from "react";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/constants";

export default function ProductGallery({ images = [], alt }) {
  const galleryImages = useMemo(
    () => (images.length ? images : [DEFAULT_PRODUCT_IMAGE]),
    [images]
  );
  const [activeImage, setActiveImage] = useState(galleryImages[0]);

  useEffect(() => {
    setActiveImage(galleryImages[0]);
  }, [galleryImages]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#111c32] shadow-[0_24px_60px_rgba(2,8,23,0.3)]">
        <div className="aspect-[4/4.6] overflow-hidden bg-[#0f172a]">
          <img
            src={activeImage}
            alt={alt}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {galleryImages.map((image, index) => {
          const isActive = image === activeImage;

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`overflow-hidden rounded-2xl border ${
                isActive
                  ? "border-[#d4af37] shadow-[0_0_0_3px_rgba(212,175,55,0.18)]"
                  : "border-white/10"
              }`}
            >
              <div className="aspect-square overflow-hidden bg-[#111c32]">
                <img
                  src={image}
                  alt={`${alt} preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
