import { forwardRef } from "react";
import "./button.css";

const Button = forwardRef(function Button(
  { children, as = "button", variant = "primary", loading = false, className = "", ...rest },
  ref
) {
  const Tag = as;
  const classes = ["xdrv-btn", `xdrv-btn--${variant}`, loading ? "is-loading" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={ref} className={classes} aria-busy={loading || undefined} {...rest}>
      <span className="xdrv-btn__label">{children}</span>
      {loading && <span className="xdrv-btn__spinner" aria-hidden="true" />}
    </Tag>
  );
});

export default Button;
