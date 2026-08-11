# XDRV Digital Business Card

XDRV IT COMPANY uchun raqamli vizitka. Bitta link — barcha XDRV kontaktlari:
Instagram, Telegram, Telefon va "Xabar yuborish" formasi (Telegram bot orqali
adminlarga real vaqtda yetib boradi).

**Stack:** React + Vite + React Router + Framer Motion + Lucide Icons + oddiy CSS (Tailwind yo'q).

---

## 1. Ishga tushirish

```bash
npm install
npm run dev
```

Sayt: `http://localhost:5173`

Production build:

```bash
npm run build
npm run preview
```

> Eslatma: `npm run dev` orqali local rejimda `/api/send-telegram` ishlamaydi
> (chunki bu Vercel/Netlify serverless funksiyasi). Formani to'liq test qilish
> uchun `vercel dev` (pastga qarang) yoki deploy qilingan muhitdan foydalaning.

---

## 2. O'rnatilgan asosiy dependencylar

| Paket | Vazifasi |
|---|---|
| `react`, `react-dom` | UI |
| `react-router-dom` | `/` va `/contact` sahifalari orasida navigatsiya |
| `framer-motion` | Premium animatsiyalar |
| `lucide-react` | Iconlar (Instagram, Telegram, Phone va h.k.) |
| `vite`, `@vitejs/plugin-react` | Build tool |

---

## 3. Kompaniya ma'lumotlarini o'zgartirish

Barcha kontakt ma'lumotlari (Instagram, Telegram, telefon, xizmatlar ro'yxati)
bitta faylda:

```text
src/config/siteConfig.js
```

Shu faylni tahrirlab, saytdagi barcha joylarda avtomatik yangilanadi.

---

## 4. Telegram integratsiyasi — MUHIM SECURITY YECHIMI

Topshiriqda `.env` ichida `VITE_TELEGRAM_BOT_TOKEN` kabi `VITE_` prefiksli
o'zgaruvchilar so'ralgan edi, lekin xuddi shu topshiriqning **15-bandida**
(Muhim security eslatma) shu narsa alohida ta'kidlangan:

> Bot token browser bundle ichiga chiqmasligi kerak.

Bu ikkita talab bir-biriga zid, chunki Vite loyihasida `VITE_` bilan
boshlangan har qanday o'zgaruvchi **build vaqtida frontend JS bundle ichiga
tekst sifatida yoziladi** — ya'ni saytga kirgan har bir odam Developer Tools
orqali bot tokeningizni ko'ra oladi. Bu security nuqtai nazaridan yaroqsiz.

Shuning uchun 15-band talabiga muvofiq, **eng xavfsiz production yechim**
qo'llanildi:

```text
Frontend (ContactForm)
      ↓  fetch("/api/send-telegram")
Serverless Function (api/send-telegram.js)
      ↓  process.env.TELEGRAM_BOT_TOKEN (faqat serverda)
Telegram Bot API
      ↓
3 ta administrator Chat ID
```

Bot token va Chat ID'lar `VITE_` **prefiksisiz** environment variable
sifatida saqlanadi — bu qiymatlar faqat serverless funksiya ichida
(`process.env`) o'qiladi va hech qachon clientga yuborilmaydi.

---

## 5. `.env` sozlash

`.env.example` faylidan nusxa oling:

```bash
cp .env.example .env
```

`.env` ichiga quyidagilarni yozing:

```env
TELEGRAM_BOT_TOKEN=123456789:AAExampleBotTokenHere

TELEGRAM_CHAT_ID_1=111111111
TELEGRAM_CHAT_ID_2=222222222
TELEGRAM_CHAT_ID_3=333333333
```

* `TELEGRAM_BOT_TOKEN` — botingiz tokeni ([@BotFather](https://t.me/BotFather)dan olinadi).
* `TELEGRAM_CHAT_ID_1/2/3` — xabar boradigan 3 ta admin/chat ID.
* Agar biror Chat ID bo'sh qoldirilsa, xatolik bermaydi — qolganlariga
  yuborishda davom etadi (`api/send-telegram.js` ichida filterlanadi).

**Diqqat:** `.env` fayli `.gitignore`da — GitHubga hech qachon tushmaydi.
Faqat `.env.example` (bo'sh qiymatlar bilan) repo'ga chiqadi.

---

## 6. Telegram botni sozlash (qadam-baqadam)

1. Telegramda [@BotFather](https://t.me/BotFather)ga o'ting.
2. `/newbot` yuboring, bot nomi va username bering.
3. BotFather bergan tokenni nusxalab, `.env`dagi `TELEGRAM_BOT_TOKEN`ga qo'ying.
4. Har bir admin/kanal uchun Chat ID toping:
   - Shaxsiy chat uchun: adminingiz botga `/start` yozsin, so'ng
     `https://api.telegram.org/bot<TOKEN>/getUpdates` manzilini oching va
     `"chat":{"id": ...}` qiymatini oling.
   - Guruh/kanal uchun: botni guruhga qo'shing, guruhda biror xabar yozing,
     so'ng xuddi shu `getUpdates` usuli bilan (odatda manfiy sonli) ID'ni oling.
5. Olingan ID'larni `TELEGRAM_CHAT_ID_1`, `_2`, `_3` ga yozing.
6. Vercel/Netlify'ga deploy qilganda, xuddi shu 4 ta o'zgaruvchini loyihaning
   Environment Variables bo'limiga qo'shing (pastga qarang).

---

## 7. Production deploy

### Variant A — Vercel (tavsiya etiladi)

1. Repo'ni GitHub'ga push qiling.
2. [vercel.com](https://vercel.com)da "New Project" → repo'ni tanlang.
3. Framework: **Vite** (avtomatik aniqlanadi).
4. **Settings → Environment Variables**ga quyidagilarni qo'shing:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID_1`
   - `TELEGRAM_CHAT_ID_2`
   - `TELEGRAM_CHAT_ID_3`
5. Deploy tugmasini bosing. `api/send-telegram.js` avtomatik ravishda
   Vercel Serverless Function sifatida ishga tushadi — qo'shimcha sozlash
   shart emas.
6. Lokal test uchun: `npm i -g vercel`, so'ng `vercel dev` (bu `/api` funksiyani
   ham local'da ishga tushiradi).

### Variant B — Netlify

1. Repo'ni GitHub'ga push qiling.
2. Netlify'da "Add new site" → repo'ni tanlang.
3. Build command: `npm run build`, Publish directory: `dist` (`netlify.toml`
   ichida allaqachon sozlangan).
4. **Site settings → Environment variables**ga xuddi shu 4 ta o'zgaruvchini
   qo'shing.
5. `netlify/functions/send-telegram.js` avtomatik deploy bo'ladi;
   `netlify.toml`dagi redirect `/api/send-telegram` so'rovlarini shu
   funksiyaga yo'naltiradi.

### Custom domen

Deploy qilingandan so'ng domenni (masalan `xdrv.uz`) Vercel/Netlify'dagi
"Domains" bo'limidan ulang. QR kodni shu final URL uchun generatsiya qiling.

---

## 8. Loyiha strukturasi

```text
src/
├── components/       # Logo, SocialCard, ContactCTA, ContactForm, Button
├── pages/             # Home, Contact, Success
├── config/            # siteConfig.js — barcha kompaniya ma'lumotlari
├── services/          # telegram.js — /api/send-telegram bilan ishlash
├── styles/            # global.css, home.css, contact.css
├── App.jsx
└── main.jsx

api/
└── send-telegram.js   # Vercel Serverless Function (bot bilan bevosita ishlaydi)

netlify/functions/
└── send-telegram.js   # Netlify Functions versiyasi
```

---

## 9. Final Checklist

- [x] Home (`/`) — Instagram / Telegram / Phone kartalari + CTA
- [x] Contact (`/contact`) — forma + validatsiya + Telegram integratsiyasi
- [x] 3 ta Chat ID, bittasi bo'sh bo'lsa ham xato bermaydi
- [x] Loading / Success / Error state'lar
- [x] Mobile-first, 375px dan responsive, horizontal scroll yo'q
- [x] `.env` GitHub'ga chiqmaydi (`.gitignore`)
- [x] Bot token frontend bundle'ga chiqmaydi (serverless function orqali)
# XDRV-T
