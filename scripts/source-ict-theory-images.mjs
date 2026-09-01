import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const componentPath = path.join(root, "src", "components", "ict-theory-hub.tsx");
const outputRoot = path.join(root, "public", "assets", "ict-theory");
const slotNames = ["01-concept.jpg", "02-detail.jpg", "03-real-world.jpg", "04-context.jpg"];

const source = await readFile(componentPath, "utf8");
const lessonBlocks = [...source.matchAll(/"([^"]+)":\s*\[([\s\S]*?)\n\s*\]/g)];
const usedSourceUrls = new Set();
const manifest = [];

function extractSearches(block) {
  return [...block.matchAll(/\{\s*title:\s*"([^"]+)",\s*query:\s*"([^"]+)"\s*\}/g)].map((match) => ({
    title: match[1],
    query: match[2]
  }));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function openverseSearch(query, page = 1) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    page_size: "20",
    license_type: "commercial",
    extension: "jpg"
  });

  const response = await fetch(`https://api.openverse.engineering/v1/images/?${params}`, {
    headers: { "User-Agent": "ApexStudyHubImageSourcing/1.0 (educational local asset sourcing)" }
  });
  if (!response.ok) {
    console.warn(`Openverse search skipped for "${query}" page ${page}: ${response.status}`);
    await wait(750);
    return [];
  }
  const data = await response.json();
  return (data.results || [])
    .filter((item) => item.url && item.thumbnail)
    .filter((item) => !item.mature)
    .map((item) => ({
      title: item.title,
      url: item.url,
      thumbnail: item.thumbnail,
      sourceUrl: item.foreign_landing_url,
      creator: item.creator,
      license: item.license,
      licenseVersion: item.license_version,
      width: item.width,
      height: item.height,
      source: item.source
    }));
}

async function findImage(query) {
  const baseWords = query.split(/\s+/).slice(0, 3).join(" ");
  const attempts = [
    query,
    `${query} technology`,
    `${query} computer`,
    `${baseWords} technology`,
    `${baseWords} computer`,
    "information technology computer",
    "computer classroom technology"
  ];

  for (const attempt of attempts) {
    for (const page of [1, 2, 3, 4, 5]) {
      const candidates = await openverseSearch(attempt, page);
      const candidate = candidates.find((item) => !usedSourceUrls.has(item.url));
      if (candidate) {
        usedSourceUrls.add(candidate.url);
        return candidate;
      }
      await wait(150);
    }
  }
  throw new Error(`No unique image found for "${query}"`);
}

async function downloadImage(image, filePath) {
  const urls = [image.thumbnail, image.url].filter(Boolean);
  let lastError = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "ApexStudyHubImageSourcing/1.0 (educational local asset sourcing)" }
      });
      if (!response.ok) throw new Error(`Download failed ${response.status}: ${url}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      await writeFile(filePath, buffer);
      return buffer.length;
    } catch (error) {
      lastError = error;
      console.warn(error.message);
      await wait(500);
    }
  }

  throw lastError || new Error(`Download failed for ${image.sourceUrl || image.url}`);
}

for (const [, lessonId, block] of lessonBlocks) {
  const searches = extractSearches(block);
  if (searches.length !== 4) continue;

  const lessonDir = path.join(outputRoot, lessonId);
  await mkdir(lessonDir, { recursive: true });

  for (const [index, search] of searches.entries()) {
    const filePath = path.join(lessonDir, slotNames[index]);
    let image = null;
    let bytes = 0;
    let lastError = null;

    for (let attempt = 0; attempt < 6; attempt += 1) {
      try {
        image = await findImage(search.query);
        bytes = await downloadImage(image, filePath);
        break;
      } catch (error) {
        lastError = error;
        console.warn(`Retrying ${lessonId} ${slotNames[index]}: ${error.message}`);
      }
    }

    if (!image || !bytes) {
      throw lastError || new Error(`Could not download image for ${search.query}`);
    }
    manifest.push({
      lessonId,
      slot: index + 1,
      title: search.title,
      query: search.query,
      file: path.relative(root, filePath).replaceAll("\\", "/"),
      sourceUrl: image.sourceUrl,
      bytes,
      width: image.width,
      height: image.height
    });
    console.log(`${lessonId} ${slotNames[index]} <- ${search.query}`);
  }
}

await writeFile(
  path.join(outputRoot, "sources.json"),
  `${JSON.stringify(manifest, null, 2)}\n`
);

console.log(`Downloaded ${manifest.length} images.`);
