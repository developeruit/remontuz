from .database import SessionLocal, engine, Base
from . import models
from .auth import hash_password


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(models.Service).count() == 0:
            services = [
                models.Service(name="Ta'mirlash", category="remont", description="Kvartira va uy ta'mirlash", base_price_per_sqm=280000, icon="🔨"),
                models.Service(name="Dizayn", category="design", description="Interer dizayn loyihalari", base_price_per_sqm=350000, icon="🎨"),
                models.Service(name="Montaj", category="install", description="Elektr va santexnika ishlari", base_price_per_sqm=150000, icon="⚡"),
                models.Service(name="Qurilish", category="build", description="Qurilish va rekonstruksiya", base_price_per_sqm=420000, icon="🧱"),
            ]
            db.add_all(services)
            db.commit()

        if db.query(models.Material).count() == 0:
            mats = [
                models.Material(name="Akril bo'yoq", category="bo'yoq", unit="kg", price=45000, supplier="Bau Market"),
                models.Material(name="Keramik plitka 60x60", category="plitka", unit="m²", price=120000, supplier="TileHouse"),
                models.Material(name="Laminat 32-klass", category="pol", unit="m²", price=95000, supplier="Floor.uz"),
                models.Material(name="Gipsokarton list", category="devor", unit="dona", price=48000, supplier="BuildMart"),
                models.Material(name="Sement M400", category="quruq", unit="kg", price=1800, supplier="StroyUz"),
                models.Material(name="Elektr kabel 2.5mm", category="elektr", unit="m", price=8500, supplier="ElektroShop"),
            ]
            db.add_all(mats)
            db.commit()

        if db.query(models.User).filter_by(email="admin@remontuz.uz").first() is None:
            admin = models.User(
                full_name="Admin",
                email="admin@remontuz.uz",
                phone="+998900000000",
                password_hash=hash_password("admin123"),
                role=models.UserRole.admin,
            )
            db.add(admin)

            masters_data = [
                ("Sardor Usmonov", "sardor@remontuz.uz", "Interer dizayner", 4.9, 128, 8, 120000),
                ("Bobur Karimov", "bobur@remontuz.uz", "Santexnik usta", 4.8, 95, 10, 90000),
                ("Aziz Rahmatov", "aziz@remontuz.uz", "Elektrik usta", 4.7, 73, 6, 85000),
                ("Jasur Olimov", "jasur@remontuz.uz", "Qurilish ustasi", 4.6, 54, 12, 110000),
            ]
            for name, email, spec, rating, revs, exp, rate in masters_data:
                u = models.User(
                    full_name=name, email=email, phone="+998901234567",
                    password_hash=hash_password("master123"),
                    role=models.UserRole.master,
                )
                db.add(u)
                db.flush()
                db.add(models.MasterProfile(
                    user_id=u.id, specializations=spec,
                    experience_years=exp, bio=f"{name} — {spec}. {exp} yillik tajriba.",
                    rating=rating, total_reviews=revs, is_verified=True,
                    hourly_rate=rate,
                ))

            client = models.User(
                full_name="Demo Mijoz", email="client@remontuz.uz",
                phone="+998909876543", password_hash=hash_password("client123"),
                role=models.UserRole.client,
            )
            db.add(client)
            db.commit()
        print("Seed complete")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
