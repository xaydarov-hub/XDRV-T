import { motion } from "framer-motion";
import { Instagram, Send, Phone } from "lucide-react";
import Logo from "../components/Logo.jsx";
import SocialCard from "../components/SocialCard.jsx";
import ContactCTA from "../components/ContactCTA.jsx";
import siteConfig from "../config/siteConfig.js";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="page home-page">
      <div className="container home-container">
        <motion.header
          className="home-header"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Logo />
        </motion.header>

        <motion.section
          className="hero"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow">Digital business card</p>
          <h1 className="hero__title">{siteConfig.shortName}</h1>
          <p className="hero__tagline">{siteConfig.tagline}</p>
          <p className="hero__tagline-uz">{siteConfig.taglineUz}</p>
        </motion.section>

        <section className="social-list" aria-label="Aloqa kanallari">
          <SocialCard
            icon={Instagram}
            title="Instagram"
            value={siteConfig.instagram.username}
            action="Instagramga o'tish"
            href={siteConfig.instagram.url}
            index={0}
          />
          <SocialCard
            icon={Send}
            title="Telegram"
            value={siteConfig.telegram.username}
            action="Telegramga o'tish"
            href={siteConfig.telegram.url}
            index={1}
          />
          <SocialCard
            icon={Phone}
            title="Telefon"
            value={siteConfig.phone.display}
            action="Qo'ng'iroq qilish"
            href={siteConfig.phone.href}
            external={false}
            index={2}
          />
        </section>

        <ContactCTA />

        <footer className="home-footer">
          <p>{siteConfig.company}</p>
        </footer>
      </div>
    </div>
  );
}
