import type { Book, User } from "./mock-data";
import { mockBooks, mockUsers } from "./mock-data";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, "");
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const backendConfigured = Boolean(url && key);
const SESSION_KEY = "maktumbook:session";
const DEMO_BOOKS_KEY = "maktumbook:demo-books";
const DEMO_REQUESTS_KEY = "maktumbook:demo-requests";

function demoRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}
function demoWrite(key: string, value: unknown) {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
}

export type Session = { access_token: string; refresh_token: string; user: { id: string; email?: string } };
export type PurchaseRequest = { id: string; user_id: string; book_id: string; status: "pending"|"approved"|"rejected"; receipt_reference?: string; created_at: string; profiles?: { name?: string; email?: string }; books?: { title?: string } };

function session(): Session | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
}
export const getSession = session;
export const clearSession = () => localStorage.removeItem(SESSION_KEY);

async function request(path: string, init: RequestInit = {}, auth = true) {
  if (!backendConfigured) throw new Error("BACKEND_NOT_CONFIGURED");
  const token = auth ? session()?.access_token : undefined;
  const headers = new Headers(init.headers);
  headers.set("apikey", key!);
  headers.set("Authorization", `Bearer ${token || key}`);
  if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (!headers.has("Prefer")) headers.set("Prefer", "return=representation");
  const response = await fetch(`${url}${path}`, {
    ...init,
    headers,
  });
  if (!response.ok) throw new Error((await response.text()) || "خطا در ارتباط با سرور");
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function signIn(email: string, password: string) {
  if (!backendConfigured) {
    const data: Session = { access_token:"demo", refresh_token:"demo", user:{ id:"demo-admin", email } };
    localStorage.setItem(SESSION_KEY, JSON.stringify(data)); return data;
  }
  const data = await request("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email, password }) }, false);
  localStorage.setItem(SESSION_KEY, JSON.stringify(data)); return data as Session;
}
export async function signUp(name: string, email: string, password: string) {
  if (!backendConfigured) {
    const data: Session = { access_token:"demo", refresh_token:"demo", user:{ id:"demo-admin", email } };
    localStorage.setItem(SESSION_KEY, JSON.stringify(data)); return data;
  }
  const data = await request("/auth/v1/signup", { method: "POST", body: JSON.stringify({ email, password, data: { name } }) }, false);
  if (!data.access_token) throw new Error("حساب ساخته شد؛ لینک تأیید ارسال‌شده به ایمیل را باز کنید.");
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  return data as Session;
}
export async function listBooks(admin = false): Promise<Book[]> {
  if (!backendConfigured) return demoRead<Book[]>(DEMO_BOOKS_KEY, mockBooks).filter(b=>admin||b.published!==false);
  const filter = admin ? "" : "&published=eq.true";
  const rows = await request(`/rest/v1/books?select=*&order=created_at.desc${filter}`);
  return rows.map(fromRow);
}
export async function saveBook(book: Partial<Book> & { title: string; author: string }) {
  if (!backendConfigured) {
    const books=demoRead<Book[]>(DEMO_BOOKS_KEY,mockBooks);
    const saved={...book,id:book.id||`demo-${Date.now()}`} as Book;
    const index=books.findIndex(b=>b.id===saved.id);
    if(index>=0)books[index]=saved;else books.unshift(saved);
    demoWrite(DEMO_BOOKS_KEY,books); return [saved];
  }
  const payload = toRow(book);
  if (book.id) return request(`/rest/v1/books?id=eq.${encodeURIComponent(book.id)}`, { method: "PATCH", body: JSON.stringify(payload) });
  return request("/rest/v1/books", { method: "POST", body: JSON.stringify(payload) });
}
export async function removeBook(id: string) {
  if(!backendConfigured){demoWrite(DEMO_BOOKS_KEY,demoRead<Book[]>(DEMO_BOOKS_KEY,mockBooks).filter(b=>b.id!==id));return;}
  return request(`/rest/v1/books?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}
export async function listUsers(): Promise<User[]> {
  if (!backendConfigured) return mockUsers;
  const rows = await request("/rest/v1/profiles?select=*&order=created_at.desc");
  const grants = await request("/rest/v1/entitlements?select=user_id,book_id");
  return rows.map((r: any) => ({ id:r.id,name:r.name||r.email,email:r.email,status:r.status,role:r.role,assignedBookIds:grants.filter((g:any)=>g.user_id===r.id).map((g:any)=>g.book_id) }));
}
export async function listRequests(): Promise<PurchaseRequest[]> {
  if (!backendConfigured) return demoRead<PurchaseRequest[]>(DEMO_REQUESTS_KEY,[]);
  return request("/rest/v1/purchase_requests?select=*,profiles(name,email),books(title)&order=created_at.desc");
}
export async function currentProfile(): Promise<User|null> {
  if(!backendConfigured)return mockUsers.find(u=>u.role==="admin")||null;
  const s=session(); if(!s)return null;
  const rows=await request(`/rest/v1/profiles?select=*&id=eq.${s.user.id}&limit=1`);
  const r=rows[0]; return r?{id:r.id,name:r.name||r.email,email:r.email,status:r.status,role:r.role,assignedBookIds:[]}:null;
}
export async function createPurchaseRequest(bookId:string, receiptReference:string) {
  if(!backendConfigured){const s=session();const books=await listBooks(true);const items=demoRead<PurchaseRequest[]>(DEMO_REQUESTS_KEY,[]);const item:PurchaseRequest={id:`request-${Date.now()}`,user_id:s?.user.id||"demo-user",book_id:bookId,status:"pending",receipt_reference:receiptReference,created_at:new Date().toISOString(),profiles:{name:"کاربر دمو",email:s?.user.email},books:{title:books.find(b=>b.id===bookId)?.title}};items.unshift(item);demoWrite(DEMO_REQUESTS_KEY,items);return [item];}
  return request("/rest/v1/purchase_requests", { method:"POST", body:JSON.stringify({ book_id:bookId, receipt_reference:receiptReference }) });
}
export async function approveRequest(item: PurchaseRequest) {
  if(!backendConfigured){const items=demoRead<PurchaseRequest[]>(DEMO_REQUESTS_KEY,[]).map(r=>r.id===item.id?{...r,status:"approved" as const}:r);demoWrite(DEMO_REQUESTS_KEY,items);return item;}
  await request(`/rest/v1/purchase_requests?id=eq.${item.id}`, { method:"PATCH", body:JSON.stringify({status:"approved",approved_at:new Date().toISOString()}) });
  return request("/rest/v1/entitlements", { method:"POST", headers:{Prefer:"resolution=merge-duplicates,return=representation"}, body:JSON.stringify({user_id:item.user_id,book_id:item.book_id,purchase_request_id:item.id}) });
}
export async function userHasBook(bookId:string) {
  if (!backendConfigured) return true;
  const rows=await request(`/rest/v1/entitlements?select=id&book_id=eq.${encodeURIComponent(bookId)}&limit=1`);
  return rows.length>0;
}
export async function myBooks(): Promise<Book[]> {
  if(!backendConfigured)return mockBooks.slice(0,3);
  const grants=await request("/rest/v1/entitlements?select=books(*)");
  return grants.map((g:any)=>fromRow(g.books)).filter(Boolean);
}
export async function bookPages(bookId:string): Promise<string[]> {
  if (!backendConfigured) return [];
  const rows=await request(`/rest/v1/book_pages?select=image_path,page_number&book_id=eq.${encodeURIComponent(bookId)}&order=page_number.asc`);
  return Promise.all(rows.map((r:any)=>signedUrl("book-pages",r.image_path)));
}
export async function uploadAsset(bucket:string,path:string,file:File) {
  if (!backendConfigured) throw new Error("BACKEND_NOT_CONFIGURED");
  const token=session()?.access_token;
  const res=await fetch(`${url}/storage/v1/object/${bucket}/${path}`,{method:"POST",headers:{apikey:key!,Authorization:`Bearer ${token}`,"x-upsert":"true"},body:file});
  if(!res.ok) throw new Error(await res.text());
  return path;
}
export async function signedUrl(bucket:string,path:string) {
  const data=await request(`/storage/v1/object/sign/${bucket}/${path}`,{method:"POST",body:JSON.stringify({expiresIn:120})});
  return `${url}/storage/v1${data.signedURL}`;
}
export async function saveBookPages(bookId:string, files:File[]) {
  if(!backendConfigured)return;
  await request(`/rest/v1/book_pages?book_id=eq.${encodeURIComponent(bookId)}`,{method:"DELETE"});
  for(let i=0;i<files.length;i++){const path=`${bookId}/${String(i+1).padStart(4,"0")}-${files[i].name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;await uploadAsset("book-pages",path,files[i]);await request("/rest/v1/book_pages",{method:"POST",body:JSON.stringify({book_id:bookId,page_number:i+1,image_path:path})});}
}
export async function uploadBookCover(bookId:string,file:File){
  if(!backendConfigured)return await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error("خواندن تصویر جلد ناموفق بود"));reader.readAsDataURL(file);});
  const path=`${bookId}/cover-${file.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;
  await uploadAsset("book-covers",path,file);
  return `${url}/storage/v1/object/public/book-covers/${path}`;
}
export function telegramPurchaseUrl(book:Book) {
  const username=(import.meta.env.VITE_TELEGRAM_USERNAME as string|undefined)||"MaktumbookSupport";
  return `https://t.me/${username}?text=${encodeURIComponent(`سلام، برای خرید کتاب «${book.title}» درخواست دارم.`)}`;
}
function fromRow(r:any):Book{return {id:r.id,title:r.title,titleEn:r.title_en,author:r.author,translator:r.translator,description:r.description,pageCount:r.page_count,language:r.language,coverPalette:r.cover_palette||["#1f3a2e","#0f2419"],category:r.category,price:r.price,coverUrl:r.cover_url,published:r.published};}
function toRow(b:any){return {title:b.title,title_en:b.titleEn||null,author:b.author,translator:b.translator||null,description:b.description||"",page_count:Number(b.pageCount)||1,language:b.language||"فارسی",category:b.category||"عمومی",price:Number(b.price)||0,cover_palette:b.coverPalette||["#1f3a2e","#0f2419"],cover_url:b.coverUrl||null,published:b.published??true};}
