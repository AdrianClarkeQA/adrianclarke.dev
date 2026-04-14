import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { minify } from "terser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "js");
const outputDir = path.join(sourceDir, "min");

async function minifyJavaScriptFiles() {
  await mkdir(outputDir, { recursive: true });

  const entries = await readdir(sourceDir, { withFileTypes: true });
  const jsFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith(".js") && !name.endsWith(".min.js"));

  if (jsFiles.length === 0) {
    console.log("No JavaScript files found in /js to minify.");
    return;
  }

  for (const fileName of jsFiles) {
    const inputPath = path.join(sourceDir, fileName);
    const outputPath = path.join(outputDir, fileName.replace(/\.js$/, ".min.js"));
    const sourceCode = await readFile(inputPath, "utf8");

    const result = await minify(sourceCode, {
      compress: true,
      mangle: true,
      format: {
        comments: false
      }
    });

    if (!result.code) {
      throw new Error(`Minification returned no output for ${fileName}`);
    }

    await writeFile(outputPath, result.code, "utf8");
    console.log(`Minified ${fileName} -> js/min/${path.basename(outputPath)}`);
  }
}

minifyJavaScriptFiles().catch((error) => {
  console.error("Failed to minify JavaScript files:", error);
  process.exitCode = 1;
});