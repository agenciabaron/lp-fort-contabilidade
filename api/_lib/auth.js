// Admin access without a user database: one admin whose e-mail and password hash live in environment
// variables (ADMIN_EMAIL, ADMIN_PASSWORD_HASH from `npm run admin:senha`), and a signed session cookie.
import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "node:crypto";

const COOKIE = "fort_admin";
const TTL = 8 * 60 * 60; // seconds

// "scrypt:<salt>:<hash>" (no "$", which .env files would try to expand)
export function hashPassword(password) {
  const salt = randomBytes(16).toString("base64url");
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString("base64url")}`;
}

function verifyPassword(password, stored) {
  const [alg, salt, hash] = String(stored || "").split(":");
  if (alg !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = scryptSync(String(password), salt, expected.length);
  return timingSafeEqual(expected, actual);
}

const safeEqual = (a, b) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export const adminConfigured = () => Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH && (process.env.SESSION_SECRET || "").length >= 32);

export function checkCredentials(email, password) {
  const emailOk = safeEqual(String(email || "").trim().toLowerCase(), process.env.ADMIN_EMAIL.trim().toLowerCase());
  const passwordOk = verifyPassword(password, process.env.ADMIN_PASSWORD_HASH); // always runs, so timing doesn't reveal the e-mail
  return emailOk && passwordOk;
}

// The password hash is part of the signature, so changing the password ends every open session
const sign = (payload) => createHmac("sha256", process.env.SESSION_SECRET).update(`${payload}.${process.env.ADMIN_PASSWORD_HASH}`).digest("base64url");

export function sessionCookie(request) {
  const payload = Buffer.from(JSON.stringify({ u: process.env.ADMIN_EMAIL, exp: Math.floor(Date.now() / 1000) + TTL })).toString("base64url");
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE}=${payload}.${sign(payload)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TTL}${secure}`;
}

export const clearedCookie = `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;

export function readSession(request) {
  if (!adminConfigured()) return null;
  const cookie = (request.headers.get("cookie") || "").split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  const [payload, signature] = (cookie?.slice(COOKIE.length + 1) || "").split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.exp > Date.now() / 1000 ? { email: data.u } : null;
  } catch {
    return null;
  }
}
