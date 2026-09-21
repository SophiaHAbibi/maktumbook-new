# راه‌اندازی بک‌اند رایگان Maktumbook

بک‌اند شامل Cloudflare Worker و دیتابیس D1 است؛ کاربران، کتاب‌ها و تصاویر خصوصی صفحات همگی در D1 ذخیره می‌شوند تا فعال‌سازی سرویس پولی لازم نباشد.

## انتشار

سه GitHub Secret زیر باید وجود داشته باشند: `CLOUDFLARE_API_TOKEN`، `CLOUDFLARE_ACCOUNT_ID` و `JWT_SECRET`.

پس از Push به `main`، در تب Actions اجرای `Deploy Cloudflare backend` را بررسی کنید. مرحله Deploy آدرس Worker را با فرم `https://maktumbook-api.<subdomain>.workers.dev` نمایش می‌دهد.

## اتصال Vercel

در `Project Settings > Environment Variables` متغیر `VITE_API_URL` را با آدرس Worker، بدون اسلش انتهایی، اضافه و سپس Redeploy کنید.

## مدیر اصلی

از صفحه ثبت‌نام با ایمیل `nil.hab25@gmail.com` حساب بسازید. این ایمیل خودکار مدیر می‌شود و به `/admin` دسترسی می‌گیرد.

## امنیت مطالعه

صفحات خصوصی می‌مانند و فقط برای کاربر دارای دسترسی ارائه می‌شوند. هر تصویر باید کمتر از ۱.۹ مگابایت باشد. جلوگیری صددرصدی از اسکرین‌شات در وب ممکن نیست؛ واترمارک اختصاصی کاربر مرحله امنیتی بعدی است.
