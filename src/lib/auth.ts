import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "./d1";

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

export async function getOrCreateUser(email: string): Promise<AuthUser> {
  const db = await getDb();
  const normalised = normaliseEmail(email);

  const existing = await db
    .prepare("SELECT id, email FROM users WHERE email = ?")
    .bind(normalised)
    .first<AuthUser>();
  if (existing) {
    return existing;
  }

  await db
    .prepare("INSERT INTO users (email, created_at) VALUES (?, ?)")
    .bind(normalised, new Date().toISOString())
    .run();

  return (await db
    .prepare("SELECT id, email FROM users WHERE email = ?")
    .bind(normalised)
    .first<AuthUser>())!;
}

export async function createLoginToken(email: string): Promise<string> {
  const db = await getDb();
  const raw = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000).toISOString();

  await db
    .prepare("INSERT INTO login_tokens (email, token_hash, expires_at) VALUES (?, ?, ?)")
    .bind(normaliseEmail(email), hashToken(raw), expiresAt)
    .run();

  return raw;
}

export type TokenResult =
  | { ok: true; userId: number }
  | { ok: false; email: string | null };

export async function consumeLoginToken(raw: string): Promise<TokenResult> {
  const db = await getDb();
  const row = await db
    .prepare("SELECT id, email, expires_at, used_at FROM login_tokens WHERE token_hash = ?")
    .bind(hashToken(raw))
    .first<TokenRow>();

  if (!row) {
    return { ok: false, email: null };
  }

  if (row.used_at !== null || new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false, email: row.email };
  }

  await db
    .prepare("UPDATE login_tokens SET used_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), row.id)
    .run();

  const user = await getOrCreateUser(row.email);
  return { ok: true, userId: user.id };
}

export async function startSession(userId: number): Promise<void> {
  const db = await getDb();
  const id = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 86_400_000);

  await db
    .prepare("INSERT INTO auth_sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(id, userId, expiresAt.toISOString())
    .run();

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

  const db = await getDb();
  const row = await db
    .prepare(
      `SELECT u.id, u.email, s.expires_at
       FROM auth_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ?`,
    )
    .bind(id)
    .first<{ id: number; email: string; expires_at: string }>();

  if (!row || new Date(row.expires_at).getTime() < Date.now()) {
    return null;
  }

  return { id: row.id, email: row.email };
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  const id = store.get(COOKIE_NAME)?.value;

  if (id) {
    const db = await getDb();
    await db.prepare("DELETE FROM auth_sessions WHERE id = ?").bind(id).run();
  }

  store.delete(COOKIE_NAME);
}

export async function deleteUser(userId: number, email: string): Promise<void> {
  const db = await getDb();
  await db.prepare("DELETE FROM login_tokens WHERE email = ?").bind(normaliseEmail(email)).run();
  await db.prepare("DELETE FROM users WHERE id = ?").bind(userId).run();
}
