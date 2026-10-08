import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const PREFIX = "scrypt";

// scrypt with per-password salt. Stored format: "scrypt$<saltHex>$<hashHex>".
// No new dependency: stdlib crypto only.
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${PREFIX}$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== PREFIX) return false;
  const salt = parts[1] ?? "";
  const expectedHex = parts[2] ?? "";
  if (salt === "" || expectedHex === "") return false;
  let actual: Buffer;
  let expected: Buffer;
  try {
    actual = Buffer.from(scryptSync(password, salt, 64).toString("hex"), "hex");
    expected = Buffer.from(expectedHex, "hex");
  } catch {
    return false;
  }
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
