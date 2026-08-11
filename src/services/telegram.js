// Bu servis Telegram Bot API bilan TO'G'RIDAN-TO'G'RI ishlamaydi.
// Bot tokenni browser bundle ichiga chiqarmaslik uchun barcha so'rovlar
// /api/send-telegram serverless funksiyasi orqali yuboriladi (qarang: api/send-telegram.js).
// Shu tufayli bot token faqat serverda saqlanadi va hech qachon clientga yuborilmaydi.

const ENDPOINT = "/api/send-telegram";

/**
 * @param {{ name: string, phone: string, business: string, services: string[], message: string }} payload
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function sendLeadToTelegram(payload) {
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      // javob JSON bo'lmasligi mumkin, pastda response.ok orqali tekshiramiz
    }

    if (!response.ok || !data?.success) {
      return {
        success: false,
        error: data?.error || "So'rovni yuborishda xatolik yuz berdi.",
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Tarmoq bilan bog'lanishda xatolik yuz berdi.",
    };
  }
}
