# 🏠 RemontUZ

> Ta'mirlash va dizayn xizmatlari platformasi — Toshkent shahridagi mijozlarni ishonchli ustalar bilan bog'laydigan zamonaviy veb-ilova.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

---

## 📖 Loyiha haqida

**RemontUZ** — ta'mirlash, dizayn va qurilish xizmatlarini buyurtma qilish uchun to'liq full-stack veb-ilova. Mijozlar o'z uylari yoki ofislari uchun ishlarni tez topa oladilar, ustalar esa yangi buyurtmalarni qabul qilib, portfoliosini boshqaradi.

Loyiha diplom ishi doirasida, zamonaviy **Backend-as-a-Service** (Supabase) va **React** texnologiyalari asosida qurilgan.

---

## ✨ Asosiy imkoniyatlar

### 🔐 Autentifikatsiya
- Email + parol bilan ro'yxatdan o'tish va kirish
- 3 xil foydalanuvchi roli: **Mijoz**, **Usta**, **Admin**
- Parolni tiklash (email orqali)
- JWT-asosli xavfsiz sessiya
- Row Level Security (RLS) bilan himoyalangan ma'lumotlar

### 👥 Mijoz uchun
- **Ta'mirlash kalkulyatori** — 7 bosqichli interaktiv forma (xizmat, obyekt, maydon, sifat, qo'shimcha ishlar, muddat)
- **Ariza topshirish** — rasm ilovalari bilan (maks 5 ta)
- **Ustalar katalogi** — shahar, mutaxassislik, reyting bo'yicha filter
- **Shaxsiy kabinet** — arizalar ro'yxati, statuslari, jami sarflangan summa
- **Sharh qoldirish** — tugallangan ishlar uchun 5 yulduzli baholash
- **Real-time bildirishnomalar** — ariza statusi o'zgarganda toast

### 🔧 Usta uchun
- **Shaxsiy profil** — bio, mutaxassislik, soatlik narx, tajriba
- **Mavjud arizalar** — qabul qilish uchun yangi ishlar
- **Mening ishlarim** — jarayondagi buyurtmalarni boshqarish
- **Portfolio menejment** — «oldin/keyin» rasmlar bilan ishlar
- **Statistika** — jami daromad, tugallangan loyihalar soni
- **Yangi arizalar** real vaqtda toast bilan bildiriladi

### 👑 Administrator uchun
- **Dashboard** — umumiy statistika (foydalanuvchilar, arizalar, daromad)
- **Foydalanuvchilar boshqaruvi** — qidiruv, rol bo'yicha filter, jadval ko'rinishi
- **Ustalarni tasdiqlash** — verified badge
- **Arizalar nazorati** — barcha buyurtmalar ro'yxati
- **So'nggi faollik** — yangi foydalanuvchilar va arizalar

### 🎨 UI / UX
- **Glassmorphism** zamonaviy dizayn
- **Orange accent** palette (ta'mirlash industriyasiga mos)
- **Responsive** — desktop, tablet, mobile (hamburger menu)
- **Toast bildirishnomalar** (success/error/info)
- **Real-time ma'lumot yangilanishi** Supabase Realtime orqali

---

## 🛠️ Texnologiyalar stek

### Frontend
- **React 18** — komponentlarga asoslangan UI
- **Vite 5** — tezkor dev server va build
- **React Router v6** — sahifalar navigatsiyasi
- **Context API** — auth va toast global state
- **@supabase/supabase-js** — backend bilan ulanish

### Backend (Supabase BaaS)
- **PostgreSQL** — relyatsion ma'lumotlar bazasi
- **Supabase Auth** — foydalanuvchi boshqaruvi, JWT
- **Supabase Storage** — rasm va fayllar uchun
- **Supabase Realtime** — WebSocket orqali jonli yangilanishlar
- **Row Level Security** — qatorlar darajasida xavfsizlik

### DevOps
- **Git + GitHub** — versiya boshqaruvi
- **Vercel** — frontend deploy (bepul tarif)
- **CI/CD** — har push'da avtomatik build va deploy

---

## 📂 Loyiha tuzilmasi

```
remontuz/
├── frontend/                     # React + Vite SPA
│   ├── public/
│   │   ├── hero.png              # Bosh sahifa banner rasmi
│   │   └── footer.png            # Footer shaharcha illyustratsiyasi
│   ├── src/
│   │   ├── App.jsx               # Router, Protected routes
│   │   ├── main.jsx              # Entry point, providerlar
│   │   ├── api.js                # Supabase client wrapper
│   │   ├── supabase.js           # Supabase client yaratish
│   │   ├── index.css             # Global stillar + responsive
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Foydalanuvchi sessiyasi
│   │   │   └── ToastContext.jsx  # Global toast bildirishnomalar
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigatsiya (hamburger menu)
│   │   │   ├── Footer.jsx        # Footer (shaharcha bilan)
│   │   │   ├── GlassCard.jsx     # Qayta ishlatiladigan glass karta
│   │   │   ├── DashboardHeader.jsx
│   │   │   ├── StatCard.jsx      # Statistika kartasi
│   │   │   ├── Tabs.jsx          # Tab navigatsiya
│   │   │   └── ReviewModal.jsx   # Sharh qoldirish oynasi
│   │   └── pages/
│   │       ├── Home.jsx          # Bosh sahifa
│   │       ├── Services.jsx      # Xizmatlar katalogi
│   │       ├── Masters.jsx       # Ustalar ro'yxati (filter)
│   │       ├── MasterProfile.jsx # Usta profili
│   │       ├── Portfolio.jsx     # Portfolio galereya
│   │       ├── Materials.jsx     # Materiallar bozori
│   │       ├── Calculator.jsx    # 7 bosqichli kalkulyator
│   │       ├── Login.jsx         # Kirish
│   │       ├── Register.jsx      # Ro'yxatdan o'tish
│   │       ├── Profile.jsx       # Profil tahrirlash
│   │       ├── Apply.jsx         # Ariza topshirish
│   │       ├── ClientDashboard.jsx
│   │       ├── MasterDashboard.jsx
│   │       └── AdminDashboard.jsx
│   ├── .env                      # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json               # SPA rewrites
├── supabase/
│   ├── schema.sql                # 8 jadval + RLS + seed data
│   ├── storage.sql               # Storage bucket policy'lari
│   └── migration_attachments.sql # orders.attachments ustuni
└── README.md
```

---

## 🗄️ Ma'lumotlar bazasi

**8 ta asosiy jadval:**

| Jadval | Vazifasi |
|---|---|
| `profiles` | Foydalanuvchi profillari (auth.users bilan bog'langan) |
| `master_profiles` | Usta qo'shimcha ma'lumotlari (bio, rating, tajriba) |
| `services` | Xizmatlar katalogi (Ta'mirlash, Dizayn, Montaj, Qurilish) |
| `orders` | Arizalar (status, narx, attachments) |
| `portfolio_items` | Usta ishlari namunalari (oldin/keyin rasmlar) |
| `reviews` | Mijoz sharhlari va baholari |
| `materials` | Qurilish materiallari ro'yxati |
| `messages` | Chat xabarlari (ariza bo'yicha) |

**Trigger:** yangi foydalanuvchi ro'yxatdan o'tganda `profiles` yozuvi avtomatik yaratiladi.

---

## 🚀 Lokal ishga tushirish

### 1-qadam: Supabase loyihasi yaratish

1. [supabase.com](https://supabase.com) da akkaunt oching
2. **New Project** → nomi: `remontuz` → parol qo'ying → **Create**
3. **Settings → API** bo'limidan oling:
   - `Project URL`
   - `anon public key`

### 2-qadam: Ma'lumotlar bazasi sozlash

1. Supabase Dashboard → **SQL Editor** → **New query**
2. `supabase/schema.sql` faylini nusxalab yopishtiring → **Run**
3. `supabase/storage.sql` faylini ishga tushiring
4. `supabase/migration_attachments.sql` faylini ishga tushiring
5. **Storage** bo'limida `portfolio` nomli **Public bucket** yarating
6. **Authentication → Providers → Email** da `Confirm email` ni **o'chiring** (test uchun)

### 3-qadam: Frontend sozlash

```bash
# Loyihani klonlash
git clone https://github.com/developeruit/remontuz.git
cd remontuz/frontend

# Dependency'larni o'rnatish
npm install

# Environment variables
cp .env.example .env
# .env faylini oching va VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY ni yozing

# Dev serverni ishga tushirish
npm run dev
```

Sayt `http://localhost:5173` da ochiladi.

### 4-qadam: Admin yaratish

Birinchi foydalanuvchini ro'yxatdan o'tkazing, keyin Supabase SQL Editor'da:

```sql
update public.profiles set role = 'admin' where email = 'sizning@email.uz';
```

---

## ☁️ Deploy (Vercel)

Loyiha Vercel'da bepul deploy qilinadi:

1. GitHub'ga push qiling
2. [vercel.com](https://vercel.com) ga kiring → **Add New Project**
3. GitHub repository'ni import qiling
4. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` ⚠️ muhim
5. **Environment Variables** qo'shing:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. **Deploy** bosing
7. Supabase **Auth → URL Configuration**'da Vercel URL'ingizni **Site URL** va **Redirect URLs**'ga qo'shing

---

## 📊 Funksional imkoniyatlar ro'yxati

- ✅ Supabase Auth (register/login/logout)
- ✅ Parolni tiklash (email orqali)
- ✅ 3 ta rol asosida ruxsat nazorati (RLS)
- ✅ Profil tahrirlash (usta uchun qo'shimcha maydonlar)
- ✅ 7 bosqichli ta'mirlash kalkulyatori
- ✅ Ariza yaratish + fayl ilovalari (rasmlar)
- ✅ Ustalar katalogi + qidiruv + filter (shahar, mutaxassislik, reyting)
- ✅ Usta profili (portfolio, sharhlar, bio)
- ✅ Portfolio CRUD + rasm yuklash (Supabase Storage)
- ✅ Sharh qoldirish (5 yulduzli baholash)
- ✅ Real-time toast bildirishnomalar
- ✅ Ariza holati o'zgarganda live update
- ✅ Mijoz / Usta / Admin dashboardlari
- ✅ Admin — foydalanuvchilar jadvali + tasdiqlash
- ✅ Materiallar bozori (kategoriya filter)
- ✅ Glassmorphism dizayn (orange palette)
- ✅ Responsive (desktop, tablet, mobile)
- ✅ Hamburger navigation menu

---

## 🎯 Kelajakdagi yo'l xaritasi

- [ ] Real-time chat (Supabase Realtime orqali)
- [ ] Yandex Maps integratsiyasi (manzil tanlash)
- [ ] Payme / Click to'lov integratsiyasi
- [ ] Push bildirishnomalar (Web Push API)
- [ ] Ko'p til qo'llab-quvvatlash (O'zbek / Rus / Ingliz)
- [ ] Progressive Web App (PWA)
- [ ] Ustalarning jonli xarita joylashuvi
- [ ] Email bildirishnomalar (Resend / SendGrid)

---

## 📄 Litsenziya

Bu loyiha ta'limiy maqsadda — diplom ishi doirasida ishlab chiqilgan.

## 👤 Muallif

**RemontUZ Dev Team** — 2025

---

⭐ Agar loyiha foydali bo'lsa, GitHub'da yulduzcha bosing!
