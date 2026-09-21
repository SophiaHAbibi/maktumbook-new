import { cpSync, mkdirSync, copyFileSync, rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/server", { recursive: true });
mkdirSync("dist/client", { recursive: true });
mkdirSync("dist/.openai", { recursive: true });
cpSync(".output/server", "dist/server", { recursive: true });
cpSync(".output/public", "dist/client", { recursive: true });
copyFileSync(".output/server/index.mjs", "dist/server/index.js");
copyFileSync(".openai/hosting.json", "dist/.openai/hosting.json");
