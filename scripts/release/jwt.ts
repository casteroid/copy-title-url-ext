import { createHmac } from "node:crypto";

/** A JWT signed with HMAC-SHA256, as AMO expects (https://mozilla.github.io/addons-server/topics/api/auth.html). */
export function signJwt(claims: Record<string, string | number>, secret: string): string {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const unsigned = `${encode({ alg: "HS256", typ: "JWT" })}.${encode(claims)}`;
  return `${unsigned}.${createHmac("sha256", secret).update(unsigned).digest("base64url")}`;
}
