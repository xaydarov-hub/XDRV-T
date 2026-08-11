import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import "./socialCard.css";

export default function SocialCard({ icon: Icon, title, value, action, href, external = true, index = 0 }) {
  return (
    <motion.a
      href={href}
      className="social-card"
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={`${title}: ${value}. ${action}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="social-card__icon" aria-hidden="true">
        <Icon size={20} strokeWidth={1.8} />
      </span>
      <span className="social-card__body">
        <span className="social-card__title">{title}</span>
        <span className="social-card__value">{value}</span>
      </span>
      <span className="social-card__action">
        <span className="social-card__action-text">{action}</span>
        <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
      </span>
    </motion.a>
  );
}
