import type { Book, User } from "./mock-data";
import { mockBooks, mockUsers } from "./mock-data";
const api=(import.meta.env.VITE_API_URL as string|undefined)?.replace(/\/$/,"");
export const backendConfigured=Boolean(api);
const SESSION_KEY="maktumbook:session",DEMO_BOOKS_KEY="maktumbook:demo-books";
export type Session={access_token:string;refresh_token:string;user:{id:string;email?:string}};
export type PurchaseRequest={id:string;user_id:string;book_id:string;status:"pending"|"approved"|"rejected";receipt_reference?:string;created_at:string;profiles?:{name?:string;email?:string};books?:{title?:string}};
function session():Session|null{if(typeof window==="undefined")return null;try{return JSON.parse(localStorage.getItem(SESSION_KEY)||"null");}catch{return null;}}
function demoRead<T>(key:string,fallback:T):T{if(typeof window==="undefined")return fallback;try{return JSON.parse(localStorage.getItem(key)||"null")??fallback;}catch{return fallback;}}
function demoWrite(key:string,value:unknown){if(typeof window!=="undefined")localStorage.setItem(key,JSON.stringify(value));}
export const getSession=session;export const clearSession=()=>localStorage.removeItem(SESSION_KEY);
async function request(path:string,init:RequestInit={}){if(!api)throw new Error("BACKEND_NOT_CONFIGURED");const headers=new Headers(init.headers),token=session()?.access_token;if(token)headers.set("Authorization",`Bearer ${token}`);if(!(init.body instanceof FormData)&&!headers.has("Content-Type"))headers.set("Content-Type","application/json");const response=await fetch(`${api}${path}`,{...init,headers});const data=await response.json().catch(()=>null);if(!response.ok)throw new Error(data?.message||"خطا در ارتباط با سرور");return data;}
export async function signIn(email:string,password:string){if(!api){const data:Session={access_token:"demo",refresh_token:"demo",user:{id:"demo-admin",email}};localStorage.setItem(SESSION_KEY,JSON.stringify(data));return data;}const data=await request("/auth/login",{method:"POST",body:JSON.stringify({email,password})});localStorage.setItem(SESSION_KEY,JSON.stringify(data));return data as Session;}
export async function signUp(name:string,email:string,password:string){if(!api){const data:Session={access_token:"demo",refresh_token:"demo",user:{id:"demo-admin",email}};localStorage.setItem(SESSION_KEY,JSON.stringify(data));return data;}const data=await request("/auth/signup",{method:"POST",body:JSON.stringify({name,email,password})});localStorage.setItem(SESSION_KEY,JSON.stringify(data));return data as Session;}
export async function listBooks(admin=false):Promise<Book[]>{if(!api)return demoRead<Book[]>(DEMO_BOOKS_KEY,mockBooks).filter(b=>admin||b.published!==false);return request(`/books${admin?"?admin=1":""}`);}
export async function saveBook(book:Partial<Book>&{title:string;author:string}){if(!api){const books=demoRead<Book[]>(DEMO_BOOKS_KEY,mockBooks),saved={...book,id:book.id||`demo-${Date.now()}`} as Book,i=books.findIndex(b=>b.id===saved.id);if(i>=0)books[i]=saved;else books.unshift(saved);demoWrite(DEMO_BOOKS_KEY,books);return[saved];}const saved=await request(book.id?`/books/${book.id}`:"/books",{method:book.id?"PATCH":"POST",body:JSON.stringify(book)});return[saved];}
export async function removeBook(id:string){if(!api){demoWrite(DEMO_BOOKS_KEY,demoRead<Book[]>(DEMO_BOOKS_KEY,mockBooks).filter(b=>b.id!==id));return;}return request(`/books/${id}`,{method:"DELETE"});}
export async function listUsers():Promise<User[]>{if(!api)return mockUsers;return request("/users");}
export async function listRequests():Promise<PurchaseRequest[]>{if(!api)return[];return request("/purchase-requests");}
export async function currentProfile():Promise<User|null>{if(!api)return mockUsers.find(u=>u.role==="admin")||null;if(!session())return null;return request("/me");}
export async function createPurchaseRequest(bookId:string,receiptReference:string){if(!api)return[];return request("/purchase-requests",{method:"POST",body:JSON.stringify({book_id:bookId,receipt_reference:receiptReference})});}
export async function approveRequest(item:PurchaseRequest){if(!api)return item;return request(`/purchase-requests/${item.id}/approve`,{method:"POST"});}
export async function userHasBook(bookId:string){if(!api)return true;const data=await request(`/entitlements/${bookId}`);return Boolean(data.allowed);}
export async function myBooks():Promise<Book[]>{if(!api)return mockBooks.slice(0,3);return request("/my-books");}
export async function bookPages(bookId:string):Promise<string[]>{if(!api)return[];return request(`/books/${bookId}/pages`);}
async function upload(kind:"cover"|"page",bookId:string,file:File,page?:number){if(!api)return await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error("خواندن فایل ناموفق بود"));reader.readAsDataURL(file);});const form=new FormData();form.set("file",file);form.set("kind",kind);form.set("book_id",bookId);if(page)form.set("page",String(page));const data=await request("/uploads",{method:"POST",body:form});return data.url as string;}
export async function saveBookPages(bookId:string,files:File[]){if(!api)return;await request(`/books/${bookId}/pages`,{method:"DELETE"});for(let i=0;i<files.length;i++)await upload("page",bookId,files[i],i+1);}
export async function uploadBookCover(bookId:string,file:File){return upload("cover",bookId,file);}
export function telegramPurchaseUrl(book:Book){const username=(import.meta.env.VITE_TELEGRAM_USERNAME as string|undefined)||"MaktumbookSupport";return`https://t.me/${username}?text=${encodeURIComponent(`سلام، برای خرید کتاب «${book.title}» درخواست دارم.`)}`;}
