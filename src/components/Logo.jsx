import { motion } from "framer-motion";
import "./logo.css";

export default function Logo({ size = "md" }) {
  return (
    <div className={`xdrv-logo xdrv-logo--${size}`}>
      <div className="xdrv-logo__mark" aria-hidden="true">
        <motion.span
          className="xdrv-logo__ring"
          initial={{ opacity: 0.5, scale: 0.9 }}
          animate={{ opacity: [0.5, 0, 0.5], scale: [0.9, 1.35, 0.9] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <svg viewBox="0 0 32 32" className="xdrv-logo__glyph">
          <path
            d="M8 9 L15 16 L8 23"
            stroke="var(--color-accent)"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 9 L17 16 L24 23"
            stroke="#f5f5f0"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="xdrv-logo__text">
        <span className="xdrv-logo__name">XDRV</span>
        <span className="xdrv-logo__sub">IT COMPANY</span>
      </div>
    </div>
  );
}
