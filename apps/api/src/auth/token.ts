import { SignJWT, jwtVerify } from "jose";

export function secretFrom(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

export async function signAccessToken(
  userId: string,
  secret: Uint8Array,
): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function readAccessToken(
  token: string,
  secret: Uint8Array,
): Promise<string | undefined> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return typeof payload.sub === "string" ? payload.sub : undefined;
  } catch {
    return undefined;
  }
}
