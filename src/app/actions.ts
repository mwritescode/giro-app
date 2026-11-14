"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createLoginToken, deleteUser, endSession, getSessionUser } from "@/lib/auth";
import { sendLoginEmail } from "@/lib/mailer";
import { toggleFavouriteRow } from "@/lib/queries";

async function currentBaseUrl(): Promise<string> {
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/preferiti";
}

export async function requestLogin(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const next = safeNext(formData.get("next"));

  if (!email || !email.includes("@")) {
    redirect(`/accedi?errore=email&next=${encodeURIComponent(next)}`);
  }

  const token = await createLoginToken(email);
  const base = await currentBaseUrl();
  const url = `${base}/accedi/verifica?token=${token}&next=${encodeURIComponent(next)}`;

  try {
    await sendLoginEmail({ to: email, url });
  } catch {
    redirect(`/accedi?errore=invio&next=${encodeURIComponent(next)}`);
  }

  redirect(`/accedi/inviato?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`);
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/");
}

export async function toggleFavourite(formData: FormData): Promise<void> {
  const next = safeNext(formData.get("next"));
  const user = await getSessionUser();

  if (!user) {
    redirect(`/accedi?next=${encodeURIComponent(next)}`);
  }

  const activityId = Number(formData.get("activityId"));
  if (Number.isFinite(activityId) && activityId > 0) {
    await toggleFavouriteRow(user.id, activityId);
  }

  redirect(next);
}

export async function deleteAccount(formData: FormData): Promise<void> {
  const user = await getSessionUser();

  if (!user) {
    redirect("/accedi");
  }

  const requested = String(formData.get("ritorno") ?? "");
  const back = requested === "/milano" || requested === "/firenze" ? requested : "/firenze";

  await deleteUser(user.id, user.email);
  await endSession();
  redirect(`${back}?eliminato=1`);
}
