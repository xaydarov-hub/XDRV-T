import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "./Button.jsx";
import "./contactCta.css";

export default function ContactCTA() {
  // return (
  //   <motion.div
  //     className="contact-cta"
  //     initial={{ opacity: 0, y: 14 }}
  //     animate={{ opacity: 1, y: 0 }}
  //     transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
  //   >
  //     <h2 className="contact-cta__title">Loyihangiz bormi?</h2>
  //     <p className="contact-cta__desc">
  //       Biznesingiz uchun kerakli raqamli yechimni birgalikda yaratamiz.
  //     </p>
  //     <Button as={Link} to="/contact" variant="primary">
  //       Xabar yuborish →
  //     </Button>
  //   </motion.div>
  // );
}
