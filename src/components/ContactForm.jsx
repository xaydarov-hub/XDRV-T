import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Button from "./Button.jsx";
import siteConfig from "../config/siteConfig.js";
import { sendLeadToTelegram } from "../services/telegram.js";
import "./contactForm.css";

const UZ_PHONE_DIGITS_REGEX = /^998\d{9}$/;

function formatUzPhone(rawValue) {
  // Faqat raqamlarni qoldiramiz
  let digits = rawValue.replace(/\D/g, "");

  // Har doim 998 bilan boshlanadi
  if (!digits.startsWith("998")) {
    digits = digits.startsWith("8") ? "998" + digits.slice(1) : "998" + digits;
  }
  digits = digits.slice(0, 12); // 998 + 9 raqam

  const rest = digits.slice(3);
  let formatted = "+998";
  if (rest.length > 0) formatted += " " + rest.slice(0, 2);
  if (rest.length > 2) formatted += " " + rest.slice(2, 5);
  if (rest.length > 5) formatted += " " + rest.slice(5, 7);
  if (rest.length > 7) formatted += " " + rest.slice(7, 9);

  return formatted;
}

const initialState = {
  name: "",
  phone: "+998 ",
  business: "",
  services: [],
  message: "",
};

export default function ContactForm({ onSuccess }) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [submitError, setSubmitError] = useState("");

  const messageCount = values.message.length;
  const maxLength = siteConfig.messageMaxLength;

  const isPhoneValid = useMemo(
    () => UZ_PHONE_DIGITS_REGEX.test(values.phone.replace(/\D/g, "")),
    [values.phone]
  );

  function updateField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handlePhoneChange(e) {
    updateField("phone", formatUzPhone(e.target.value));
  }

  function toggleService(service) {
    setValues((prev) => {
      const has = prev.services.includes(service);
      const services = has ? prev.services.filter((s) => s !== service) : [...prev.services, service];
      return { ...prev, services };
    });
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: undefined }));
    }
  }

  function validate() {
    const next = {};
    if (!values.name.trim()) {
      next.name = "Ismingizni kiriting.";
    } else if (values.name.trim().length < 2) {
      next.name = "Ismingizni to'liq kiriting.";
    }

    if (values.phone.replace(/\D/g, "") === "998" || !values.phone.trim()) {
      next.phone = "Telefon raqamingizni kiriting.";
    } else if (!isPhoneValid) {
      next.phone = "Telefon raqami noto'g'ri.";
    }

    if (!values.business.trim()) {
      next.business = "Biznes nomini kiriting.";
    }

    if (values.services.length === 0) {
      next.services = "Kamida bitta xizmat tanlang.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "submitting") return; // double-submitni blokla

    if (!validate()) return;

    setStatus("submitting");
    setSubmitError("");

    const result = await sendLeadToTelegram({
      name: values.name.trim(),
      phone: values.phone.trim(),
      business: values.business.trim(),
      services: values.services,
      message: values.message.trim(),
    });

    if (result.success) {
      setStatus("idle");
      onSuccess?.();
    } else {
      setStatus("error");
      setSubmitError(result.error || "Xatolik yuz berdi.");
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="name">Ismingiz</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Ismingizni kiriting"
          autoComplete="given-name"
          value={values.name}
          onChange={(e) => updateField("name", e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={errors.name ? "has-error" : ""}
        />
        {errors.name && (
          <p className="field-error" id="name-error" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="phone">Aloqa raqamingiz</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          placeholder="+998 90 123 45 67"
          autoComplete="tel"
          value={values.phone}
          onChange={handlePhoneChange}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={errors.phone ? "has-error" : ""}
        />
        {errors.phone && (
          <p className="field-error" id="phone-error" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="business">Korxona yoki biznes nomi</label>
        <input
          id="business"
          name="business"
          type="text"
          placeholder="Masalan: ABC Company"
          autoComplete="organization"
          value={values.business}
          onChange={(e) => updateField("business", e.target.value)}
          aria-invalid={Boolean(errors.business)}
          aria-describedby={errors.business ? "business-error" : undefined}
          className={errors.business ? "has-error" : ""}
        />
        {errors.business && (
          <p className="field-error" id="business-error" role="alert">
            {errors.business}
          </p>
        )}
      </div>

      <fieldset className="field">
        <legend>Sizga qanday xizmat kerak?</legend>
        <div className="service-chips" role="group" aria-describedby={errors.services ? "services-error" : undefined}>
          {siteConfig.services.map((service) => {
            const active = values.services.includes(service);
            return (
              <button
                type="button"
                key={service}
                className={`service-chip ${active ? "is-active" : ""}`}
                aria-pressed={active}
                onClick={() => toggleService(service)}
              >
                {active && <Check size={14} strokeWidth={2.5} aria-hidden="true" />}
                {service}
              </button>
            );
          })}
        </div>
        {errors.services && (
          <p className="field-error" id="services-error" role="alert">
            {errors.services}
          </p>
        )}
      </fieldset>

      <div className="field">
        <label htmlFor="message">Loyihangiz haqida</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Loyihangiz haqida qisqacha yozing..."
          value={values.message}
          maxLength={maxLength}
          onChange={(e) => updateField("message", e.target.value)}
        />
        <span className="char-counter" aria-live="polite">
          {messageCount} / {maxLength}
        </span>
      </div>

      {status === "error" && (
        <motion.div
          className="submit-error"
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p>Xatolik yuz berdi.</p>
          <p>
            Iltimos, qayta urinib ko'ring yoki{" "}
            <a href={siteConfig.telegram.url} target="_blank" rel="noopener noreferrer">
              Telegram orqali bog'laning
            </a>
            .
          </p>
          {submitError && <p className="submit-error__detail">{submitError}</p>}
        </motion.div>
      )}

      <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? "Yuborilmoqda..." : "So'rov yuborish →"}
      </Button>
    </form>
  );
}
