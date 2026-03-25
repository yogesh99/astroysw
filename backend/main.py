import os
import json
import sqlite3
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from jose import JWTError, jwt
import bcrypt

# Configuration (Use environment variables in production)
SECRET_KEY = os.environ.get("SECRET_KEY", "astroysw_super_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD_HASH = "$2b$12$/KsRXAJ9.bLujNAZllLSQ.pNq4m1PHHBY0RRoEH5tFNyP7EJKfIyi" # bcrypt hash for "astro2026"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Directories
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
BLOGS_DIR = os.path.join(DATA_DIR, "blogs")
UPLOADS_DIR = os.path.join(DATA_DIR, "uploads")
METADATA_FILE = os.path.join(DATA_DIR, "blog_metadata.json")

os.makedirs(BLOGS_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

if not os.path.exists(METADATA_FILE):
    with open(METADATA_FILE, "w", encoding="utf-8") as f:
        json.dump([], f)

# --- SQLite Database ---
DB_PATH = os.path.join(DATA_DIR, "astroysw.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content_type TEXT NOT NULL,
            content_id TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at TEXT NOT NULL,
            UNIQUE(content_type, content_id, email)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

app = FastAPI(title="AstroYSW API")

cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# --- Models ---
class BlogMeta(BaseModel):
    id: str
    slug: str
    title: str
    excerpt: str
    readTime: str
    tags: List[str]
    category: str
    published: bool
    createdAt: str
    updatedAt: str
    featuredImage: str

class ContactForm(BaseModel):
    name: str
    email: str
    message: str

class LikeRequest(BaseModel):
    content_type: str
    content_id: str
    name: str
    email: str

class SubscribeRequest(BaseModel):
    email: str

# --- Auth ---
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_admin(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None or username != ADMIN_USERNAME:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username

@app.post("/api/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != ADMIN_USERNAME or not bcrypt.checkpw(form_data.password.encode('utf-8'), ADMIN_PASSWORD_HASH.encode('utf-8')):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- Blog API ---
def get_metadata():
    with open(METADATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_metadata(data):
    with open(METADATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

@app.get("/api/blogs")
async def list_blogs(admin: bool = False):
    meta = get_metadata()
    if not admin:
        meta = [b for b in meta if b.get('published', False)]
    # Sort by recent
    meta.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
    return meta

@app.get("/api/blogs/{slug}")
async def get_blog(slug: str):
    meta = get_metadata()
    blog_meta = next((b for b in meta if b['slug'] == slug), None)
    if not blog_meta:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    mdx_path = os.path.join(BLOGS_DIR, f"{slug}.mdx")
    if not os.path.exists(mdx_path):
        raise HTTPException(status_code=404, detail="Content not found")
        
    with open(mdx_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    return {"meta": blog_meta, "content": content}

@app.post("/api/blogs")
async def save_blog(
    slug: str = Form(...),
    title: str = Form(...),
    excerpt: str = Form(""),
    readTime: str = Form("5 min read"),
    tags: str = Form(""),
    category: str = Form("Astrology"),
    published: str = Form("false"),
    content: str = Form(...),
    featuredImage: str = Form(""),
    current_admin: str = Depends(get_current_admin)
):
    metadata = get_metadata()
    existing = next((b for b in metadata if b['slug'] == slug), None)
    now_iso = datetime.utcnow().isoformat()
    
    meta_entry = {
        "id": existing['id'] if existing else slug,
        "slug": slug,
        "title": title,
        "excerpt": excerpt,
        "readTime": readTime,
        "tags": [t.strip() for t in tags.split(",") if t.strip()],
        "category": category,
        "published": published.lower() == 'true',
        "createdAt": existing['createdAt'] if existing else now_iso,
        "updatedAt": now_iso,
        "featuredImage": featuredImage
    }
    
    if existing:
        metadata = [m if m['slug'] != slug else meta_entry for m in metadata]
    else:
        metadata.append(meta_entry)
        
    save_metadata(metadata)
    
    with open(os.path.join(BLOGS_DIR, f"{slug}.mdx"), "w", encoding="utf-8") as f:
        f.write(content)
        
    return {"status": "success", "meta": meta_entry}

@app.delete("/api/blogs/{slug}")
async def delete_blog(slug: str, current_admin: str = Depends(get_current_admin)):
    metadata = get_metadata()
    new_meta = [b for b in metadata if b['slug'] != slug]
    if len(new_meta) == len(metadata):
        raise HTTPException(status_code=404, detail="Blog not found")
    save_metadata(new_meta)
    
    mdx_path = os.path.join(BLOGS_DIR, f"{slug}.mdx")
    if os.path.exists(mdx_path):
        os.remove(mdx_path)
    return {"status": "success"}

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...), current_admin: str = Depends(get_current_admin)):
    file_loc = os.path.join(UPLOADS_DIR, file.filename)
    with open(file_loc, "wb") as f:
        f.write(await file.read())
    return {"url": f"http://localhost:8000/uploads/{file.filename}"}

@app.post("/api/contact")
async def submit_contact(form: ContactForm):
    conn = get_db()
    conn.execute(
        "INSERT INTO contacts (name, email, message, created_at) VALUES (?, ?, ?, ?)",
        (form.name, form.email, form.message, datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Signal received"}

@app.post("/api/subscribe")
async def subscribe(sub: SubscribeRequest):
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO subscribers (email, created_at) VALUES (?, ?)",
            (sub.email, datetime.utcnow().isoformat())
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=409, detail="Already subscribed")
    conn.close()
    return {"status": "success"}

# --- Likes API ---
@app.post("/api/likes")
async def add_like(like: LikeRequest):
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO likes (content_type, content_id, name, email, created_at) VALUES (?, ?, ?, ?, ?)",
            (like.content_type, like.content_id, like.name, like.email, datetime.utcnow().isoformat())
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=409, detail="You have already liked this content.")
    conn.close()
    return {"status": "success"}

@app.get("/api/likes/{content_type}/{content_id}")
async def get_likes(content_type: str, content_id: str):
    conn = get_db()
    count = conn.execute(
        "SELECT COUNT(*) FROM likes WHERE content_type = ? AND content_id = ?",
        (content_type, content_id)
    ).fetchone()[0]
    likers = conn.execute(
        "SELECT name, created_at FROM likes WHERE content_type = ? AND content_id = ? ORDER BY created_at DESC LIMIT 20",
        (content_type, content_id)
    ).fetchall()
    conn.close()
    return {"count": count, "likers": [{"name": r["name"], "created_at": r["created_at"]} for r in likers]}

@app.get("/api/likes/{content_type}/{content_id}/check")
async def check_like(content_type: str, content_id: str, email: str = Query(...)):
    conn = get_db()
    row = conn.execute(
        "SELECT id FROM likes WHERE content_type = ? AND content_id = ? AND email = ?",
        (content_type, content_id, email)
    ).fetchone()
    conn.close()
    return {"liked": row is not None}

@app.get("/api/admin/likes")
async def admin_list_likes(current_admin: str = Depends(get_current_admin)):
    conn = get_db()
    rows = conn.execute(
        "SELECT id, content_type, content_id, name, email, created_at FROM likes ORDER BY created_at DESC"
    ).fetchall()
    conn.close()
    return [{"id": r["id"], "content_type": r["content_type"], "content_id": r["content_id"], "name": r["name"], "email": r["email"], "created_at": r["created_at"]} for r in rows]

@app.get("/api/admin/subscribers")
async def admin_list_subscribers(current_admin: str = Depends(get_current_admin)):
    conn = get_db()
    rows = conn.execute("SELECT id, email, created_at FROM subscribers ORDER BY created_at DESC").fetchall()
    conn.close()
    return [{"id": r["id"], "email": r["email"], "created_at": r["created_at"]} for r in rows]

@app.get("/api/admin/contacts")
async def admin_list_contacts(current_admin: str = Depends(get_current_admin)):
    conn = get_db()
    rows = conn.execute("SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC").fetchall()
    conn.close()
    return [{"id": r["id"], "name": r["name"], "email": r["email"], "message": r["message"], "created_at": r["created_at"]} for r in rows]
