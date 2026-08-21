"use client";

/**
 * Stops a click from bubbling to a parent <Link> wrapping the whole card.
 * Needed because the card itself is now a Server Component, so an inline
 * onClick can't be attached directly in page.js.
 */
export default function ClickGuard({
  as: Tag = "div",
  preventDefault = false,
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      className={className}
      onClick={(e) => {
        if (preventDefault) e.preventDefault();
        e.stopPropagation();
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
