// main.ts — Menyerahkan entry LumbungKeluarga ke make.fun.
//
// Menyalin app/ dan screenshots/ dari repo ini ke direktori output, lalu
// menulis dossier.json dengan buildDossier dari vendor/makefun-frontend.ts.
// Di luar grader, MAKEFUN_OUTPUT_DIR menggantikan /output.
//
// Deterministik: tidak ada waktu, acak, atau jaringan di sini — dua run
// pada repo yang sama menulis byte yang sama. Output dir TIDAK pernah
// dihapus dari program ini (stale file dibersihkan pemanggil bila perlu).
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

function copyTree(name: string): void {
  const src = join(repoRoot, name);
  const dst = join(outDir, name);
  if (!existsSync(src)) throw new Error("missing in repo: " + name);
  cpSync(src, dst, { recursive: true });
}

mkdirSync(outDir, { recursive: true });
copyTree("app");
copyTree("screenshots");

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
  app_path_max_bytes: 1000,
});
writeFileSync(join(outDir, "dossier.json"), dossier);
console.log("wrote " + join(outDir, "dossier.json") + " (" + dossier.length + " bytes)");
