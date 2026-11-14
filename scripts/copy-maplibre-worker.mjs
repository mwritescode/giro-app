import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const source = join(process.cwd(), "node_modules", "maplibre-gl", "dist", "maplibre-gl-worker.mjs");
const target = join(process.cwd(), "public", "maplibre", "maplibre-gl-worker.mjs");

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
