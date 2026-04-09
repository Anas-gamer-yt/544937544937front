import { Children } from "react";

export default function MasonryGrid({
  children,
  className = "",
  itemClassName = ""
}) {
  const items = Children.toArray(children);

  return (
    <div className={`masonry-grid ${className}`.trim()}>
      {items.map((child, index) => (
        <div
          key={child?.key ?? index}
          className={`masonry-item reveal-scroll reveal-scroll-delay-${index % 4} ${itemClassName}`.trim()}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
