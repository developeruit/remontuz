from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from .database import Base, engine, get_db
from . import models, schemas, auth
from .seed import seed

Base.metadata.create_all(bind=engine)
seed()

app = FastAPI(title="RemontUZ API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"name": "RemontUZ API", "docs": "/docs"}


# ---------------- AUTH ----------------
@app.post("/api/auth/register", response_model=schemas.Token)
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter_by(email=payload.email).first():
        raise HTTPException(400, "Email allaqachon ro'yxatdan o'tgan")
    role = models.UserRole(payload.role) if payload.role in ("client", "master", "admin") else models.UserRole.client
    user = models.User(
        full_name=payload.full_name, email=payload.email, phone=payload.phone,
        city=payload.city or "Toshkent",
        password_hash=auth.hash_password(payload.password),
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    if role == models.UserRole.master:
        mp = models.MasterProfile(user_id=user.id)
        db.add(mp)
        db.commit()
    token = auth.create_token(user.id)
    return {"access_token": token, "token_type": "bearer", "user": user}


@app.post("/api/auth/login", response_model=schemas.Token)
def login(payload: schemas.LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(email=payload.email).first()
    if not user or not auth.verify_password(payload.password, user.password_hash):
        raise HTTPException(401, "Email yoki parol noto'g'ri")
    token = auth.create_token(user.id)
    return {"access_token": token, "token_type": "bearer", "user": user}


@app.get("/api/auth/me", response_model=schemas.UserOut)
def me(user: models.User = Depends(auth.get_current_user)):
    return user


# ---------------- SERVICES ----------------
@app.get("/api/services", response_model=List[schemas.ServiceOut])
def list_services(db: Session = Depends(get_db)):
    return db.query(models.Service).all()


@app.get("/api/services/{sid}", response_model=schemas.ServiceOut)
def get_service(sid: int, db: Session = Depends(get_db)):
    s = db.query(models.Service).get(sid)
    if not s:
        raise HTTPException(404)
    return s


@app.post("/api/services", response_model=schemas.ServiceOut)
def create_service(
    payload: schemas.ServiceBase,
    db: Session = Depends(get_db),
    _: models.User = Depends(auth.require_role("admin")),
):
    s = models.Service(**payload.dict())
    db.add(s); db.commit(); db.refresh(s)
    return s


@app.delete("/api/services/{sid}")
def delete_service(sid: int, db: Session = Depends(get_db), _: models.User = Depends(auth.require_role("admin"))):
    s = db.query(models.Service).get(sid)
    if not s:
        raise HTTPException(404)
    db.delete(s); db.commit()
    return {"ok": True}


# ---------------- CALCULATOR ----------------
@app.post("/api/calculator", response_model=schemas.CalcOut)
def calculate(payload: schemas.CalcIn, db: Session = Depends(get_db)):
    s = db.query(models.Service).get(payload.service_id)
    if not s:
        raise HTTPException(404, "Xizmat topilmadi")
    total = s.base_price_per_sqm * payload.area_sqm
    return {
        "service_id": s.id,
        "area_sqm": payload.area_sqm,
        "price_per_sqm": s.base_price_per_sqm,
        "total": total,
    }


# ---------------- MASTERS ----------------
@app.get("/api/masters", response_model=List[schemas.MasterProfileOut])
def list_masters(
    city: Optional[str] = None,
    min_rating: Optional[float] = None,
    db: Session = Depends(get_db),
):
    q = db.query(models.MasterProfile).join(models.User)
    if city:
        q = q.filter(models.MasterProfile.city == city)
    if min_rating:
        q = q.filter(models.MasterProfile.rating >= min_rating)
    rows = q.all()
    out = []
    for mp in rows:
        out.append(schemas.MasterProfileOut(
            id=mp.id, user_id=mp.user_id, full_name=mp.user.full_name,
            specializations=mp.specializations, experience_years=mp.experience_years,
            bio=mp.bio, rating=mp.rating, total_reviews=mp.total_reviews,
            is_verified=mp.is_verified, hourly_rate=mp.hourly_rate, city=mp.city,
            avatar_url=mp.user.avatar_url,
        ))
    return out


@app.get("/api/masters/{mid}", response_model=schemas.MasterProfileOut)
def get_master(mid: int, db: Session = Depends(get_db)):
    mp = db.query(models.MasterProfile).filter_by(user_id=mid).first()
    if not mp:
        raise HTTPException(404)
    return schemas.MasterProfileOut(
        id=mp.id, user_id=mp.user_id, full_name=mp.user.full_name,
        specializations=mp.specializations, experience_years=mp.experience_years,
        bio=mp.bio, rating=mp.rating, total_reviews=mp.total_reviews,
        is_verified=mp.is_verified, hourly_rate=mp.hourly_rate, city=mp.city,
        avatar_url=mp.user.avatar_url,
    )


@app.put("/api/masters/me", response_model=schemas.MasterProfileOut)
def update_my_master(
    payload: schemas.MasterProfileUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.require_role("master")),
):
    mp = db.query(models.MasterProfile).filter_by(user_id=user.id).first()
    if not mp:
        mp = models.MasterProfile(user_id=user.id)
        db.add(mp)
    for k, v in payload.dict(exclude_unset=True).items():
        setattr(mp, k, v)
    db.commit(); db.refresh(mp)
    return schemas.MasterProfileOut(
        id=mp.id, user_id=mp.user_id, full_name=user.full_name,
        specializations=mp.specializations, experience_years=mp.experience_years,
        bio=mp.bio, rating=mp.rating, total_reviews=mp.total_reviews,
        is_verified=mp.is_verified, hourly_rate=mp.hourly_rate, city=mp.city,
    )


@app.get("/api/masters/{mid}/reviews", response_model=List[schemas.ReviewOut])
def master_reviews(mid: int, db: Session = Depends(get_db)):
    return db.query(models.Review).filter_by(master_id=mid, is_approved=True).all()


# ---------------- ORDERS ----------------
@app.post("/api/orders", response_model=schemas.OrderOut)
def create_order(
    payload: schemas.OrderCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.get_current_user),
):
    o = models.Order(client_id=user.id, **payload.dict())
    db.add(o); db.commit(); db.refresh(o)
    return o


@app.get("/api/orders", response_model=List[schemas.OrderOut])
def list_orders(
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.get_current_user),
):
    q = db.query(models.Order)
    if user.role == models.UserRole.client:
        q = q.filter(models.Order.client_id == user.id)
    elif user.role == models.UserRole.master:
        q = q.filter((models.Order.master_id == user.id) | (models.Order.master_id == None))
    return q.order_by(models.Order.created_at.desc()).all()


@app.get("/api/orders/{oid}", response_model=schemas.OrderOut)
def get_order(oid: int, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    o = db.query(models.Order).get(oid)
    if not o:
        raise HTTPException(404)
    return o


@app.put("/api/orders/{oid}/status", response_model=schemas.OrderOut)
def update_status(oid: int, status_val: str = Query(...), db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    o = db.query(models.Order).get(oid)
    if not o:
        raise HTTPException(404)
    try:
        o.status = models.OrderStatus(status_val)
    except ValueError:
        raise HTTPException(400, "Noto'g'ri status")
    db.commit(); db.refresh(o)
    return o


@app.put("/api/orders/{oid}/assign", response_model=schemas.OrderOut)
def assign_order(oid: int, db: Session = Depends(get_db), user: models.User = Depends(auth.require_role("master"))):
    o = db.query(models.Order).get(oid)
    if not o:
        raise HTTPException(404)
    o.master_id = user.id
    o.status = models.OrderStatus.in_progress
    db.commit(); db.refresh(o)
    return o


# ---------------- PORTFOLIO ----------------
@app.get("/api/portfolio", response_model=List[schemas.PortfolioOut])
def list_portfolio(master_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(models.PortfolioItem)
    if master_id:
        q = q.filter(models.PortfolioItem.master_id == master_id)
    return q.order_by(models.PortfolioItem.created_at.desc()).all()


@app.post("/api/portfolio", response_model=schemas.PortfolioOut)
def add_portfolio(
    payload: schemas.PortfolioCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.require_role("master")),
):
    p = models.PortfolioItem(master_id=user.id, **payload.dict())
    db.add(p); db.commit(); db.refresh(p)
    return p


@app.delete("/api/portfolio/{pid}")
def delete_portfolio(pid: int, db: Session = Depends(get_db), user: models.User = Depends(auth.require_role("master"))):
    p = db.query(models.PortfolioItem).get(pid)
    if not p or p.master_id != user.id:
        raise HTTPException(404)
    db.delete(p); db.commit()
    return {"ok": True}


# ---------------- MATERIALS ----------------
@app.get("/api/materials", response_model=List[schemas.MaterialOut])
def list_materials(category: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.Material)
    if category:
        q = q.filter(models.Material.category == category)
    return q.all()


@app.post("/api/materials", response_model=schemas.MaterialOut)
def add_material(payload: schemas.MaterialBase, db: Session = Depends(get_db), _: models.User = Depends(auth.require_role("admin"))):
    m = models.Material(**payload.dict())
    db.add(m); db.commit(); db.refresh(m)
    return m


# ---------------- REVIEWS ----------------
@app.post("/api/reviews", response_model=schemas.ReviewOut)
def add_review(
    payload: schemas.ReviewCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.get_current_user),
):
    r = models.Review(
        client_id=user.id, master_id=payload.master_id,
        order_id=payload.order_id, rating=payload.rating, comment=payload.comment,
        is_approved=True,
    )
    db.add(r); db.commit(); db.refresh(r)
    mp = db.query(models.MasterProfile).filter_by(user_id=payload.master_id).first()
    if mp:
        mp.total_reviews = (mp.total_reviews or 0) + 1
        all_r = db.query(models.Review).filter_by(master_id=payload.master_id, is_approved=True).all()
        mp.rating = sum(x.rating for x in all_r) / len(all_r)
        db.commit()
    return r


# ---------------- MESSAGES ----------------
@app.get("/api/messages/{oid}", response_model=List[schemas.MessageOut])
def get_msgs(oid: int, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Message).filter_by(order_id=oid).order_by(models.Message.created_at).all()


@app.post("/api/messages", response_model=schemas.MessageOut)
def send_msg(payload: schemas.MessageCreate, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    m = models.Message(order_id=payload.order_id, sender_id=user.id, content=payload.content)
    db.add(m); db.commit(); db.refresh(m)
    return m


# ---------------- ADMIN ----------------
@app.get("/api/admin/stats")
def admin_stats(db: Session = Depends(get_db), _: models.User = Depends(auth.require_role("admin"))):
    return {
        "users": db.query(models.User).count(),
        "masters": db.query(models.User).filter_by(role=models.UserRole.master).count(),
        "clients": db.query(models.User).filter_by(role=models.UserRole.client).count(),
        "orders": db.query(models.Order).count(),
        "services": db.query(models.Service).count(),
        "materials": db.query(models.Material).count(),
    }


@app.get("/api/admin/users", response_model=List[schemas.UserOut])
def admin_users(db: Session = Depends(get_db), _: models.User = Depends(auth.require_role("admin"))):
    return db.query(models.User).all()


@app.put("/api/admin/users/{uid}/verify")
def verify_master(uid: int, db: Session = Depends(get_db), _: models.User = Depends(auth.require_role("admin"))):
    mp = db.query(models.MasterProfile).filter_by(user_id=uid).first()
    if not mp:
        raise HTTPException(404)
    mp.is_verified = True
    db.commit()
    return {"ok": True}
