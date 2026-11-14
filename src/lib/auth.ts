import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "./db";

const COOKIE_NAME = "giro_session";
const TOKEN_TTL_MINUTES = 15;
const SESSION_TTL_DAYS = 30;

export type AuthUser = {
  id: number;
  email: string;
};

type TokenRow = {
  id: number;
  email: string;
  expires_at: string;
  used_at: string | null;
};

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getOrCreateUser(email: string): AuthUser {
  const db = getDb();
  const normalised = normaliseEmail(email);
  const existing = db.prepare("SELECT id, email FROM users WHERE email = ?").get(normalised) as AuthUser | undefined;
  if (existing) {
    return existing;
  }
  db.prepare("INSERT INTO users (email, created_at) VALUES (?, ?)").run(normalised, new Date().toISOString());
  return db.prepare("SELECT id, email FROM users WHERE email = ?").get(normalised) as AuthUser;
}

export function createLoginToken(email: string): string {
  const raw = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000).toISOString();
  getDb()
    .prepare("INSERT INTO login_tokens (email, token_hash, expires_at) VALUES (?, ?, ?)")
    .run(normaliseEmail(email), hashToken(raw), expiresAt);
  return raw;
}

export type TokenResult =
  | { ok: true; userId: number }
  | { ok: false; email: string | null };

export function consumeLoginToken(raw: string): TokenResult {
  const db = getDb();
  const row = db
    .prepare("SELECT id, email, expires_at, used_at FROM login_tokens WHERE token_hash = ?")
    .get(hashToken(raw)) as TokenRow | undefined;

  if (!row) {
    return { ok: false, email: null };
  }

  if (row.used_at !== null || new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false, email: row.email };
  }

  db.prepare("UPDATE login_tokens SET used_at = ? WHERE id = ?").run(new Date().toISOString(), row.id);
  const user = getOrCreateUser(row.email);
  return { ok: true, userId: user.id };
}

export async function startSession(userId: number): Promise<void> {
  const id = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 86_400_000);
  getDb()
    .prepare("INSERT INTO auth_sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
    .run(id, userId, expiresAt.toISOString());

  const store = await cookies();
  store.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
  });
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const store = await cookies();
  const id = store.get(COOKIE_NAME)?.value;
  if (!id) {
    return null;
  }

  const row = getDb()
    .prepare(
      `SELECT u.id, u.email, s.expires_at
       FROM auth_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ?`,
    )
    .get(id) as { id: number; email: string; expires_at: string } | undefined;

  if (!row || new Date(row.expires_at).getTime() < Date.now()) {
    return null;
  }

  return { id: row.id, email: row.email };
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  const id = store.get(COOKIE_NAME)?.value;
  if (id) {
    getDb().prepare("DELETE FROM auth_sessions WHERE id = ?").run(id);
  }
  store.delete(COOKIE_NAME);
}

export function deleteUser(userId: number, email: string): void {
  const db = getDb();
  db.prepare("DELETE FROM login_tokens WHERE email = ?").run(normaliseEmail(email));
  db.prepare("DELETE FROM users WHERE id = ?").run(userId);
}
