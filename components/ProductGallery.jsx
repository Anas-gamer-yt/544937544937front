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
      <div className="overflow-hidden rounded-[32px] border border-brand-border bg-white shadow-soft">
        <div className="aspect-[4/4.6] overflow-hidden bg-brand-background">
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
                  ? "border-brand-secondary shadow-focus"
                  : "border-brand-border"
              }`}
            >
              <div className="aspect-square overflow-hidden bg-brand-background">
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
