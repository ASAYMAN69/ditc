// Prebuild hook: keep SQLite for local dev, flip to Postgres whenever the
// DATABASE_URL points at one (e.g. Render). Runs inside `npm run build`,
// so no dashboard-specific build command can bypass it.
import fs from "node:fs";

const url = process.env.DATABASE_URL ?? "";
const schemaPath = "prisma/schema.prisma";
const schema = fs.readFileSync(schemaPath, "utf8");

if (/^postgres(ql)?:\/\//.test(url) && schema.includes('provider = "sqlite"')) {
  fs.writeFileSync(schemaPath, schema.replace('provider = "sqlite"', 'provider = "postgresql"'));
  console.log("prebuild: prisma provider flipped to postgresql");
} else {
  console.log("prebuild: prisma provider unchanged (sqlite)");
}
