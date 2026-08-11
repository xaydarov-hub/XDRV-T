// Netlify Functions versiyasi (Vercel o'rniga Netlify'da deploy qilsangiz shundan foydalaning).
// netlify.toml faylida redirect sozlangan: /api/send-telegram -> /.netlify/functions/send-telegram

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
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
  });
  const data = await res.json().catch(() => ({}));
  return res.ok && data.ok;
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ success: false, error: "Method not allowed" }) };
  }

  try {
    const { name, phone, business, services, message } = JSON.parse(event.body || "{}");

    if (!name || String(name).trim().length < 2) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: "Ismingizni kiriting." }) };
    }
    if (!phone || !UZ_PHONE_REGEX.test(String(phone).replace(/\s/g, ""))) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: "Telefon raqami noto'g'ri." }) };
    }
    if (!business) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: "Biznes nomini kiriting." }) };
    }
    if (!Array.isArray(services) || services.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: "Kamida bitta xizmat tanlang." }) };
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return { statusCode: 500, body: JSON.stringify({ success: false, error: "Server konfiguratsiyasi to'liq emas." }) };
    }

    const chatIds = [
      process.env.TELEGRAM_CHAT_ID_1,
      process.env.TELEGRAM_CHAT_ID_2,
      process.env.TELEGRAM_CHAT_ID_3,
    ].filter((id) => typeof id === "string" && id.trim().length > 0);

    if (chatIds.length === 0) {
      return { statusCode: 500, body: JSON.stringify({ success: false, error: "Qabul qiluvchilar sozlanmagan." }) };
    }

    const text = buildMessage({ name, phone, business, services, message });
    const results = await Promise.allSettled(chatIds.map((id) => sendToChat(botToken, id, text)));
    const anySucceeded = results.some((r) => r.status === "fulfilled" && r.value === true);

    if (!anySucceeded) {
      return { statusCode: 502, body: JSON.stringify({ success: false, error: "Telegramga yuborib bo'lmadi." }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: "Kutilmagan xatolik yuz berdi." }) };
  }
}
