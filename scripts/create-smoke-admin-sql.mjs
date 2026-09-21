import { pbkdf2Sync, randomBytes } from "node:crypto";

const runId = process.env.SMOKE_RUN_ID;
if (!runId) throw new Error("SMOKE_RUN_ID is required");

const email = `smoke-admin-${runId}@example.com`;
const password = "SmokeTest123!";
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, 100000, 32, "sha256");
const b64url = (value) => value.toString("base64url");

process.stdout.write(
  `INSERT OR REPLACE INTO users(id,email,name,password_hash,password_salt,role,status) VALUES('smoke-admin-${runId}','${email}','Smoke Admin','${b64url(hash)}','${b64url(salt)}','admin','active');\n`,
);
