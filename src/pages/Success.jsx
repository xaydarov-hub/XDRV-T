import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Button from "../components/Button.jsx";

export default function Success() {
  return (
    <motion.div
      className="success-state"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      role="status"
    >
      <motion.div
        className="success-state__icon"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <Check size={28} strokeWidth={2.6} aria-hidden="true" />
      </motion.div>

      <h1 className="success-state__title">So'rovingiz qabul qilindi.</h1>
      <p className="success-state__desc">
        Ma'lumotlaringiz XDRV jamoasiga yuborildi.
        <br />
        Tez orada siz bilan bog'lanamiz.
      </p>

      <Button as={Link} to="/" variant="secondary">
        Bosh sahifaga qaytish
      </Button>
    </motion.div>
  );
}
