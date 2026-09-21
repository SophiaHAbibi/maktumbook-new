import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import type { Book } from "@/lib/mock-data";
import { backendConfigured, listBooks, removeBook, saveBook, saveBookPages, uploadBookCover } from "@/lib/backend";
import { Plus, Pencil, Trash2, FileImage, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/admin/books")({ head:()=>({meta:[{title:"کتاب‌ها — پنل مدیریت"}]}), component:AdminBooks });

function AdminBooks(){
  const [books,setBooks]=useState<Book[]>([]),[q,setQ]=useState(""),[editing,setEditing]=useState<Partial<Book>|null>(null),[notice,setNotice]=useState("");
  const load=()=>listBooks(true).then(setBooks).catch(e=>setNotice(e.message));
  useEffect(load,[]);
  const rows=useMemo(()=>books.filter(b=>!q||b.title.includes(q)||b.author.includes(q)),[books,q]);
  const del=async(id:string)=>{if(!confirm("این کتاب حذف شود؟"))return;await removeBook(id);load();};
  return <AdminShell><div className="p-8 space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">مدیریت محتوا</p><h1 className="mt-2 font-display text-3xl font-semibold">کتاب‌ها</h1></div><div className="flex items-center gap-2"><div className="relative"><Search className="absolute inset-y-0 start-3 my-auto h-4 w-4 text-muted-foreground"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="جستجوی کتاب..." className="w-72 rounded-lg border border-input bg-card ps-10 pe-3 py-2 text-sm"/></div><button onClick={()=>setEditing({published:true,language:"فارسی",coverPalette:["#1f3a2e","#0f2419"]})} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Plus className="h-4 w-4"/>افزودن کتاب</button></div></div>
    {!backendConfigured&&<div className="rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm">حالت دموی CMS فعال است؛ تغییرات این نسخه در همین مرورگر ذخیره می‌شوند.</div>}
    {notice&&<div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{notice}</div>}
    <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card"><table className="w-full text-sm"><thead className="bg-muted/60"><tr><th className="px-5 py-3 text-start">کتاب</th><th className="px-5 py-3 text-start">نویسنده</th><th className="px-5 py-3 text-start">قیمت</th><th className="px-5 py-3">وضعیت</th><th className="px-5 py-3 text-end">عملیات</th></tr></thead><tbody className="divide-y divide-border/60">{rows.map(b=><tr key={b.id}><td className="px-5 py-3 font-medium">{b.title}</td><td className="px-5 py-3">{b.author}</td><td className="px-5 py-3">{(b.price||0).toLocaleString("fa-IR")} تومان</td><td className="px-5 py-3 text-center">{b.published===false?"پیش‌نویس":"منتشرشده"}</td><td className="px-5 py-3 text-end"><button onClick={()=>setEditing(b)} title="ویرایش" className="p-2"><Pencil className="h-4 w-4"/></button><button onClick={()=>del(b.id)} title="حذف" className="p-2 text-destructive"><Trash2 className="h-4 w-4"/></button></td></tr>)}</tbody></table></div>
  </div>{editing&&<BookEditor initial={editing} onClose={()=>setEditing(null)} onSaved={()=>{setEditing(null);load();}}/>}</AdminShell>;
}

function BookEditor({initial,onClose,onSaved}:{initial:Partial<Book>;onClose:()=>void;onSaved:()=>void}){
  const [form,setForm]=useState(initial),[pages,setPages]=useState<File[]>([]),[cover,setCover]=useState<File|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState("");
  const field=(key:keyof Book,value:any)=>setForm(p=>({...p,[key]:value}));
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setBusy(true);setError("");try{let result=await saveBook(form as Book);const saved=(result?.[0]||form) as any;const id=saved.id||form.id;if(id&&cover){const coverUrl=await uploadBookCover(id,cover);result=await saveBook({...form,id,coverUrl} as Book);}if(id&&pages.length)await saveBookPages(id,pages);onSaved();}catch(e){setError(e instanceof Error?e.message:"ذخیره نشد");}finally{setBusy(false);}};
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><form onSubmit={submit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-7 shadow-xl"><div className="flex items-center justify-between"><div><h3 className="font-display text-2xl font-semibold">{form.id?"ویرایش کتاب":"افزودن کتاب"}</h3><p className="text-sm text-muted-foreground">مشخصات و تصاویر صفحات کتاب را وارد کنید.</p></div><button type="button" onClick={onClose}><X/></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2">
    <Field label="عنوان" value={form.title||""} onChange={v=>field("title",v)} required/><Field label="نویسنده" value={form.author||""} onChange={v=>field("author",v)} required/>
    <Field label="مترجم" value={form.translator||""} onChange={v=>field("translator",v)}/><Field label="دسته‌بندی" value={form.category||""} onChange={v=>field("category",v)}/>
    <Field label="قیمت (تومان)" type="number" value={String(form.price||"")} onChange={v=>field("price",Number(v))}/><Field label="تعداد صفحات" type="number" value={String(form.pageCount||"")} onChange={v=>field("pageCount",Number(v))}/>
    <div className="sm:col-span-2"><label className="mb-1 block text-sm">توضیحات</label><textarea value={form.description||""} onChange={e=>field("description",e.target.value)} rows={4} className="w-full rounded-xl border border-input bg-background p-3"/></div>
    <label className="rounded-xl border border-dashed border-border p-5 text-center cursor-pointer"><FileImage className="mx-auto mb-2"/><span className="text-sm">انتخاب تصویر جلد</span><input className="hidden" type="file" accept="image/*" onChange={e=>setCover(e.target.files?.[0]||null)}/>{cover&&<b className="mt-2 block text-primary">جلد انتخاب شد</b>}</label>
    <label className="rounded-xl border border-dashed border-border p-5 text-center cursor-pointer"><FileImage className="mx-auto mb-2"/><span className="text-sm">انتخاب تصاویر صفحات به‌ترتیب</span><input className="hidden" type="file" accept="image/*" multiple onChange={e=>setPages(Array.from(e.target.files||[]))}/>{pages.length>0&&<b className="mt-2 block text-primary">{pages.length.toLocaleString("fa-IR")} صفحه انتخاب شد</b>}</label>
    <label className="flex items-center gap-2"><input type="checkbox" checked={form.published!==false} onChange={e=>field("published",e.target.checked)}/>انتشار در فروشگاه</label>
  </div>{error&&<p className="mt-4 text-sm text-destructive">{error}</p>}<div className="mt-6 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2">انصراف</button><button disabled={busy} className="rounded-lg bg-primary px-5 py-2 text-primary-foreground">{busy?"در حال ذخیره…":"ذخیره کتاب"}</button></div></form></div>;
}
function Field({label,value,onChange,type="text",required=false}:{label:string;value:string;onChange:(v:string)=>void;type?:string;required?:boolean}){return <label className="text-sm">{label}<input required={required} type={type} value={value} onChange={e=>onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"/></label>;}
