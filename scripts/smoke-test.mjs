const base = process.env.API_URL || "http://127.0.0.1:8787";
const password = "SmokeTest123!";

async function api(path, options = {}, token) {
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`${base}${path}`, { ...options, headers });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || "GET"} ${path}: ${response.status} ${JSON.stringify(data)}`);
  return data;
}

function assert(value, message) {
  if (!value) throw new Error(message);
}

const stamp = process.env.SMOKE_RUN_ID || Date.now();
const adminEmail = process.env.SMOKE_ADMIN_EMAIL || "smoke-admin@example.com";
const readerEmail = `smoke-reader-${stamp}@example.com`;

const health = await api("/health");
assert(health.ok, "Health check failed");

let admin;
if (process.env.SMOKE_ADMIN_EMAIL) {
  admin = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: adminEmail, password }),
  });
} else {
  try {
    admin = await api("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name: "Smoke Admin", email: adminEmail, password }),
    });
  } catch {
    admin = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: adminEmail, password }),
    });
  }
}
assert(admin.user.role === "admin", "Admin role was not assigned");

const reader = await api("/auth/signup", {
  method: "POST",
  body: JSON.stringify({ name: "Smoke Reader", email: readerEmail, password }),
});
assert(reader.user.role === "reader", "Reader role was not assigned");

const login = await api("/auth/login", {
  method: "POST",
  body: JSON.stringify({ email: readerEmail, password }),
});
assert(login.user.id === reader.user.id, "Reader login returned the wrong user");

const book = await api("/books", {
  method: "POST",
  body: JSON.stringify({
    title: `کتاب آزمایشی ${stamp}`,
    author: "نویسنده آزمایشی",
    description: "تست کامل فرایند خرید و دسترسی",
    pageCount: 12,
    language: "فارسی",
    category: "آزمایشی",
    price: 100000,
    published: true,
  }),
}, admin.access_token);

const publicBooks = await api("/books");
assert(publicBooks.some((item) => item.id === book.id), "Published book is missing from catalog");

const before = await api(`/entitlements/${book.id}`, {}, reader.access_token);
assert(before.allowed === false, "Reader unexpectedly had access before approval");

const created = await api("/purchase-requests", {
  method: "POST",
  body: JSON.stringify({ book_id: book.id, receipt_reference: `receipt-${stamp}` }),
}, reader.access_token);
const requestId = created[0]?.id;
assert(requestId, "Purchase request was not created");

const requests = await api("/purchase-requests", {}, admin.access_token);
assert(requests.some((item) => item.id === requestId), "Purchase request is missing from admin CMS");

await api(`/purchase-requests/${requestId}/approve`, { method: "POST" }, admin.access_token);

const after = await api(`/entitlements/${book.id}`, {}, reader.access_token);
assert(after.allowed === true, "Approved reader still has no entitlement");

const library = await api("/my-books", {}, reader.access_token);
assert(library.some((item) => item.id === book.id), "Approved book is missing from reader library");

console.log("SMOKE TEST PASSED: signup, login, catalog, purchase, approval, entitlement, library");
