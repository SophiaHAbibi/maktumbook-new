CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,password_hash TEXT NOT NULL,password_salt TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'reader',status TEXT NOT NULL DEFAULT 'active',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS books (id TEXT PRIMARY KEY,title TEXT NOT NULL,title_en TEXT,author TEXT NOT NULL,translator TEXT,description TEXT NOT NULL DEFAULT '',page_count INTEGER NOT NULL DEFAULT 1,language TEXT NOT NULL DEFAULT 'فارسی',category TEXT NOT NULL DEFAULT 'عمومی',price INTEGER NOT NULL DEFAULT 0,cover_url TEXT,published INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS purchase_requests (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,book_id TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',receipt_reference TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,approved_at TEXT,FOREIGN KEY(user_id) REFERENCES users(id),FOREIGN KEY(book_id) REFERENCES books(id));
CREATE TABLE IF NOT EXISTS entitlements (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,book_id TEXT NOT NULL,purchase_request_id TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,UNIQUE(user_id,book_id));
CREATE TABLE IF NOT EXISTS book_pages (id TEXT PRIMARY KEY,book_id TEXT NOT NULL,page_number INTEGER NOT NULL,object_key TEXT NOT NULL,UNIQUE(book_id,page_number));
CREATE TABLE IF NOT EXISTS files (object_key TEXT PRIMARY KEY,content_type TEXT NOT NULL,data BLOB NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_requests_user ON purchase_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_user ON entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_pages_book ON book_pages(book_id,page_number);
