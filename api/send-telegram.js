// Vercel Serverless Function
// Bu fayl serverda ishlaydi — Telegram bot tokeni hech qachon browserga chiqmaydi.
//
// Kerakli environment variablelar (Vercel dashboard yoki .env faylida, VITE_ PREFIXSIZ):
//   TELEGRAM_BOT_TOKEN
//   TELEGRAM_CHAT_ID_1
//   TELEGRAM_CHAT_ID_2
//   TELEGRAM_CHAT_ID_3

const UZ_PHONE_REGEX = /^\+998\d{9}$/;

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildMessage({ name, phone, business, services, message }) {
  const serviceList = Array.isArray(services) ? services.join(", ") : String(services || "");

  const lines = [
    "🔔 <b>YANGI LOYIHA SO'ROVI</b>",
    "",
    "👤 <b>Ism:</b>",
    escapeHtml(name),
    "",
    "📞 <b>Telefon:</b>",
    escapeHtml(phone),
    "",
    "🏢 <b>Biznes:</b>",
    escapeHtml(business),
    "",
    "💻 <b>Kerakli xizmat:</b>",
    escapeHtml(serviceList),
  ];

  if (message && String(message).trim().length > 0) {
    lines.push("", "📝 <b>Loyiha:</b>", escapeHtml(message));
  }

  lines.push("", "━━━━━━━━━━━━━━", "🌐 <b>XDRV IT COMPANY</b>");

  return lines.join("\n");
}

async function sendToChat(botToken, chatId, text) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  const data = await res.json().catch(() => ({}));
  return res.ok && data.ok;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { name, phone, business, services, message } = req.body || {};

    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ success: false, error: "Ismingizni kiriting." });
    }
    if (!phone || !UZ_PHONE_REGEX.test(String(phone).replace(/\s/g, ""))) {
      return res.status(400).json({ success: false, error: "Telefon raqami noto'g'ri." });
    }
    if (!business || String(business).trim().length < 1) {
      return res.status(400).json({ success: false, error: "Biznes nomini kiriting." });
    }
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ success: false, error: "Kamida bitta xizmat tanlang." });
    }
    if (message && String(message).length > 500) {
      return res.status(400).json({ success: false, error: "Xabar 500 belgidan oshmasligi kerak." });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return res.status(500).json({ success: false, error: "Server konfiguratsiyasi to'liq emas." });
    }

    const chatIds = [
      process.env.TELEGRAM_CHAT_ID_1,
      process.env.TELEGRAM_CHAT_ID_2,
      process.env.TELEGRAM_CHAT_ID_3,
    ].filter((id) => typeof id === "string" && id.trim().length > 0);

    if (chatIds.length === 0) {
      return res.status(500).json({ success: false, error: "Qabul qiluvchilar sozlanmagan." });
    }

    const text = buildMessage({
      name: String(name).trim(),
      phone: String(phone).trim(),
      business: String(business).trim(),
      services,
      message: message ? String(message).trim() : "",
    });

    const results = await Promise.allSettled(chatIds.map((chatId) => sendToChat(botToken, chatId, text)));

    const anySucceeded = results.some((r) => r.status === "fulfilled" && r.value === true);

    if (!anySucceeded) {
      return res.status(502).json({ success: false, error: "Telegramga yuborib bo'lmadi." });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Kutilmagan xatolik yuz berdi." });
  }
}
