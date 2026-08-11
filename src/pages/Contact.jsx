import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "../components/Logo.jsx";
import ContactForm from "../components/ContactForm.jsx";
import Success from "./Success.jsx";
import "../styles/contact.css";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="page contact-page">
      <div className="container">
        <header className="contact-header">
          <Link to="/" className="back-link" aria-label="Bosh sahifaga qaytish">
            <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
            <span>Orqaga</span>
          </Link>
          <Logo />
        </header>

        <AnimatePresence mode="wait">
          {submitted ? (
            <Success key="success" />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="contact-intro">
                <h1 className="contact-intro__title">Loyihangiz haqida gaplashaylik.</h1>
                <p className="contact-intro__desc">
                  Bir nechta ma'lumot qoldiring. XDRV jamoasi siz bilan bog'lanadi.
                </p>
              </div>

              <ContactForm onSuccess={() => setSubmitted(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
