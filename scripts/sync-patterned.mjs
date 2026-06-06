import fs from "fs/promises";
import path from "path";

const CMS_BASE_URL = "https://cms.adrianne.io/wp-json/wp/v2";
const TAG_CACHE = new Map();
const MEDIA_CACHE = new Map();

const COLLECTIONS = [
  {
    label: "Patterned Work",
    endpoint: "patterned_work",
    outputDir: path.join(process.cwd(), "content", "work"),
    contentType: "work",
  },
  {
    label: "Patterned Blog",
    endpoint: "patterned_blog",
    outputDir: path.join(process.cwd(), "content", "blog"),
    contentType: "blog",
  },
];

function stripHtml(html = "") {
  return decodeHtml(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/h([1-6])>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]*>/g, "")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
}

function decodeHtml(html = "") {
  return html
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, "...")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function cleanExtractedMarkdown(markdown = "") {
  return markdown
    .replace(/^\s*[–—]\s+/gm, "- ")
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\r/g, "")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
}

function extractGfmBlockContent(html = "") {
  const decoded = decodeHtml(html);
  const blockMatch = decoded.match(
    /<!--\s*wp:gfm-renderer\/markdown\s+({[\s\S]*?})\s*\/-->/i
  );

  if (!blockMatch) return "";

  try {
    const attrs = JSON.parse(blockMatch[1]);
    return cleanExtractedMarkdown(attrs.content ?? "");
  } catch {
    return "";
  }
}

function removeGfmBlockComments(html = "") {
  return html.replace(
    /<!--\s*wp:gfm-renderer\/markdown\s+{[\s\S]*?}\s*\/-->/gi,
    ""
  );
}

function extractMarkdownSource(html = "") {
  const sourceMatch = html.match(
    /<div[^>]*class="[^"]*gfm-markdown-source[^"]*"[^>]*>([\s\S]*?)<\/div>/i
  );

  if (!sourceMatch) return "";

  let markdown = decodeHtml(sourceMatch[1]).trim();

  markdown = markdown
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\r/g, "")
    .trim();

  return cleanExtractedMarkdown(markdown);
}

function removeMarkdownSource(html = "") {
  return removeGfmBlockComments(html).replace(
    /<div[^>]*class="[^"]*gfm-markdown-source[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    ""
  );
}

function escapeYamlString(value = "") {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function getCustomField(post, fieldName) {
  return (
    post?.[fieldName] ??
    post?.meta?.[fieldName] ??
    post?.acf?.[fieldName] ??
    post?.pods?.[fieldName] ??
    ""
  );
}

function parseManualTags(post) {
  const rawTags = getCustomField(post, "tags");

  if (Array.isArray(rawTags)) {
    return rawTags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof rawTags === "string") {
    return rawTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function parseTags(post) {
  const manualTags = parseManualTags(post);
  const manualTagsAreOnlyIds = manualTags.every((tag) => /^\d+$/.test(tag));

  if (Array.isArray(post._hugoTags) && post._hugoTags.length > 0) {
    return post._hugoTags;
  }

  if (manualTags.length > 0 && !manualTagsAreOnlyIds) {
    return manualTags;
  }

  return [];
}

async function fetchTaxonomyTerms(taxonomy = "tags") {
  if (TAG_CACHE.has(taxonomy)) {
    return TAG_CACHE.get(taxonomy);
  }

  const terms = [];
  let page = 1;

  while (true) {
    const url = `${CMS_BASE_URL}/${taxonomy}?per_page=100&page=${page}`;
    const response = await fetch(url);

    if (response.status === 400) {
      break;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch ${taxonomy}: ${response.status}`);
    }

    const batch = await response.json();

    if (!Array.isArray(batch) || batch.length === 0) {
      break;
    }

    terms.push(...batch);

    const totalPages = Number(response.headers.get("x-wp-totalpages") || "1");
    if (page >= totalPages) {
      break;
    }

    page += 1;
  }

  const termMap = new Map();

  for (const term of terms) {
    const value = term.slug || term.name;
    termMap.set(term.id, value);
    termMap.set(String(term.id), value);
  }

  TAG_CACHE.set(taxonomy, termMap);
  return termMap;
}

function normalizeFeaturedMedia(media) {
  if (!media) return null;

  const image = media.source_url ?? media.media_details?.sizes?.full?.source_url ?? "";
  const alt = decodeHtml(media.alt_text ?? media.title?.rendered ?? "");

  return image
    ? {
        image,
        alt,
      }
    : null;
}

function extractEmbeddedFeaturedMedia(post) {
  const embeddedMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  return normalizeFeaturedMedia(embeddedMedia);
}

async function fetchFeaturedMedia(mediaId) {
  if (!mediaId) return null;

  const cacheKey = String(mediaId);

  if (MEDIA_CACHE.has(cacheKey)) {
    return MEDIA_CACHE.get(cacheKey);
  }

  const response = await fetch(`${CMS_BASE_URL}/media/${mediaId}`);

  if (!response.ok) {
    MEDIA_CACHE.set(cacheKey, null);
    return null;
  }

  const media = await response.json();
  const cover = normalizeFeaturedMedia(media);

  MEDIA_CACHE.set(cacheKey, cover);
  return cover;
}

function createFrontMatter({ post, collection }) {
  const title = decodeHtml(post.title?.rendered ?? "Untitled");
  const excerpt = decodeHtml(stripHtml(post.excerpt?.rendered ?? ""));
  const tags = parseTags(post);
  const category = post._hugoCategories?.[0] ?? "";
  const date = post.date ?? new Date().toISOString();
  const modified = post.modified ?? date;
  const cover = post._hugoCover;

  return `---
title: "${escapeYamlString(title)}"
date: ${date}
lastmod: ${modified}
draft: false
type: "${collection.contentType}"${collection.contentType === "work" && category ? `\ncategory: "${escapeYamlString(category)}"` : ""}${collection.contentType === "blog" && tags.length > 0 ? `\ntags: ${JSON.stringify(tags)}` : ""}${excerpt ? `\nsummary: "${escapeYamlString(excerpt)}"` : ""}${cover?.image ? `\nimage: "${escapeYamlString(cover.image)}"` : ""}
---`;
}

function createMarkdown({ post, collection }) {
  const frontMatter = createFrontMatter({ post, collection });
  const renderedContent = post.content?.rendered ?? "";
  const blockMarkdown = extractGfmBlockContent(renderedContent);
  const sourceMarkdown = extractMarkdownSource(renderedContent);
  const rawMarkdown = blockMarkdown || sourceMarkdown;

  if (rawMarkdown && rawMarkdown.length > 20) {
    return `${frontMatter}\n\n${rawMarkdown}\n`;
  }

  const content = stripHtml(removeMarkdownSource(renderedContent));

  return `${frontMatter}\n\n${cleanExtractedMarkdown(content)}\n`;
}

async function fetchCollectionPosts(collection) {
  const url = `${CMS_BASE_URL}/${collection.endpoint}?per_page=100&_embed=1`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${collection.label}: ${response.status}`
    );
  }

  return response.json();
}

async function syncCollection(collection) {
  console.log(`Fetching ${collection.label}...`);

  const posts = await fetchCollectionPosts(collection);
  const tagMap = await fetchTaxonomyTerms("tags");
  const categoryMap = await fetchTaxonomyTerms("categories");

  await fs.mkdir(collection.outputDir, {
    recursive: true,
  });

  for (const post of posts) {
    post._hugoTags = (post.tags ?? [])
      .map((tagId) => tagMap.get(tagId) || tagMap.get(String(tagId)))
      .filter(Boolean);

    post._hugoCategories = (post.categories ?? [])
      .map((categoryId) => categoryMap.get(categoryId) || categoryMap.get(String(categoryId)))
      .filter(Boolean);

    post._hugoCover = extractEmbeddedFeaturedMedia(post) || await fetchFeaturedMedia(post.featured_media);

    const slug = post.slug;
    const markdown = createMarkdown({ post, collection });
    const filePath = path.join(collection.outputDir, `${slug}.md`);

    await fs.writeFile(filePath, markdown);

    console.log(`✓ Synced ${collection.label}: ${slug}`);
  }

  if (posts.length === 0) {
    console.log(`No posts found for ${collection.label}.`);
  }
}

async function syncPatterned() {
  for (const collection of COLLECTIONS) {
    await syncCollection(collection);
  }

  console.log("Done syncing Patterned by Adrianne!");
}

syncPatterned().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});