"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACCESS_COOKIE,
  ACCESS_PATH,
  SESSION_SECONDS,
  createAccessToken,
  isCorrectPassword,
  isValidAccessToken,
} from "./access";

async function setAccessCookie() {
  (await cookies()).set(ACCESS_COOKIE, createAccessToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: ACCESS_PATH,
    maxAge: SESSION_SECONDS,
  });
}

export async function unlockKanaler(_prev: { error: string }, formData: FormData) {
  if (!isCorrectPassword(String(formData.get("password") ?? ""))) {
    return { error: "Fel lösenord. Försök igen." };
  }
  await setAccessCookie();
  redirect(`${ACCESS_PATH}/`);
}

/** Called by the open page while the visitor is active; renews the 60 s unlock. */
export async function keepKanalerUnlocked() {
  const valid = isValidAccessToken((await cookies()).get(ACCESS_COOKIE)?.value);
  if (valid) await setAccessCookie();
  return valid;
}

export async function lockKanaler() {
  (await cookies()).delete({ name: ACCESS_COOKIE, path: ACCESS_PATH });
}
