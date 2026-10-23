// Generates the admin access variables. Run: npm run admin:senha
// Prints ADMIN_PASSWORD_HASH (the password itself is never stored) and a fresh SESSION_SECRET.
import { createInterface } from "node:readline/promises";
import { randomBytes } from "node:crypto";
import { hashPassword } from "../api/_lib/auth.js";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const password = await rl.question("Nova senha do admin (mínimo 10 caracteres): ");
rl.close();
if (password.length < 10) {
  console.error("Senha curta demais: use pelo menos 10 caracteres.");
  process.exit(1);
}
console.log("\nCole estas variáveis na Vercel (Settings → Environment Variables) ou no .env.local:\n");
console.log(`ADMIN_PASSWORD_HASH=${hashPassword(password)}`);
console.log(`SESSION_SECRET=${randomBytes(32).toString("base64url")}`);
console.log("\nE também ADMIN_EMAIL=<e-mail usado para entrar>.");
