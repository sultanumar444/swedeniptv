import { createHash } from "node:crypto";

/**
 * Password for the "Kanaler" page, from the KANALER_PASSWORD environment
 * variable (.env.local locally, the host's settings in production). It is
 * never stored in the code. If it isn't set, the page stays locked.
 */
const PASSWORD = process.env.KANALER_PASSWORD ?? "";

export const ACCESS_COOKIE = "kanaler_access";
export const ACCESS_PATH = "/streaming-kanaler-sverige";

/** An unlock lasts this long unless the open page keeps renewing it. */
export const SESSION_SECONDS = 60;

function sign(expiresAt: number) {
  return createHash("sha256").update(`kanaler:${PASSWORD}:${expiresAt}`).digest("hex");
}

/**
 * Cookie value: "<expiry ms>.<signature>". The expiry is signed with the
 * password, so it can't be extended by editing the cookie, and changing the
 * password locks everyone out.
 */
export function createAccessToken(now = Date.now()) {
  const expiresAt = now + SESSION_SECONDS * 1000;
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function isValidAccessToken(token: string | undefined, now = Date.now()) {
  if (!token || PASSWORD === "") return false;
  const [expires, signature] = token.split(".");
  const expiresAt = Number(expires);
  return Number.isFinite(expiresAt) && expiresAt > now && signature === sign(expiresAt);
}

export function isCorrectPassword(input: string) {
  return PASSWORD !== "" && input.trim() === PASSWORD;
}
