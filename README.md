# RemontUZ — Ta'mirlash va dizayn xizmatlari platformasi

Toshkent shahridagi ta'mirlash va dizayn xizmatlari uchun to'liq full-stack veb-ilova.

## Texnologiyalar

- **Backend:** FastAPI (Python) + SQLAlchemy + SQLite + JWT auth
- **Frontend:** React 18 + Vite + React Router
- **Dizayn:** Glassmorphism + Lime accent (spetsifikatsiya asosida)

## Loyiha tuzilmasi

```
.
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── main.py           # FastAPI + barcha endpointlar
│       ├── models.py         # SQLAlchemy modellar
│       ├── schemas.py        # Pydantic sxemalar
│       ├── database.py       # SQLite ulanish
│       ├── auth.py           # JWT + parol hashing
│       └── seed.py           # Boshlang'ich ma'lumotlar
└── frontend/
    ├── package.json
    ├── vite.config.js        # /api → localhost:8000 proxy
    └── src/
        ├── App.jsx
        ├── api.js            # API klient
        ├── context/AuthContext.jsx
        ├── components/       # Navbar, Footer, GlassCard
        └── pages/            # Home, Masters, Services, ...
```

## Ishga tushirish

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate           # Windows
# source venv/bin/activate      # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend `http://127.0.0.1:8000` da ishga tushadi. Swagger docs: `http://127.0.0.1:8000/docs`

Birinchi ishga tushganda `remontuz.db` avtomatik yaratiladi va demo ma'lumotlar bilan to'ldiriladi.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` da ochiladi. `/api/*` so'rovlari avtomatik backendga proxy qilinadi.

## Demo akkauntlar

| Rol    | Email                   | Parol      |
|--------|-------------------------|------------|
| Admin  | admin@remontuz.uz       | admin123   |
| Usta   | sardor@remontuz.uz      | master123  |
| Usta   | bobur@remontuz.uz       | master123  |
| Mijoz  | client@remontuz.uz      | client123  |

## Amalga oshirilgan funksiyalar

- ✅ Autentifikatsiya (ro'yxatdan o'tish / kirish / JWT)
- ✅ 3 ta rol: Mijoz, Usta, Admin
- ✅ Ta'mirlash kalkulyatori (maydon × xizmat bahosi)
- ✅ Ustalar katalogi (qidiruv, reyting bo'yicha filter)
- ✅ Usta profili (portfolio, sharhlar)
- ✅ Xizmatlar katalogi
- ✅ Materiallar bozori (kategoriya filter)
- ✅ Portfolio galereya
- ✅ Ariza topshirish
- ✅ Mijoz kabineti (arizalar ro'yxati va holatlari)
- ✅ Usta kabineti (ariza qabul qilish, tugatish)
- ✅ Admin panel (statistika, foydalanuvchilar, tasdiqlash)
- ✅ Reyting va sharhlar tizimi (backend)
- ✅ Glassmorphism dizayn (spetsifikatsiya ranglari)
- ✅ Responsive (desktop + mobile)

## API endpointlar

Barcha endpointlar spetsifikatsiyadagi kabi: `/api/auth/*`, `/api/services`, `/api/masters`,
`/api/orders`, `/api/portfolio`, `/api/materials`, `/api/reviews`, `/api/admin/*`.

To'liq ro'yxat: `http://127.0.0.1:8000/docs`

## Keyingi qadamlar

- Real-time chat (WebSocket)
- Fayl yuklash (portfolio rasmlari)
- Yandex Maps integratsiyasi
- Payme / Click to'lov integratsiyasi
- Supabase'ga migratsiya (production uchun)
