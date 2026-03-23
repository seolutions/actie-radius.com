const fs = require("fs");
const path = require("path");

const posts = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "extracted_posts.json"),
    "utf-8"
  )
);

const outDir = path.join(__dirname, "src", "posts");
fs.mkdirSync(outDir, { recursive: true });

// Category display name mapping
const categoryNames = {
  excersice: "Exercise",
  fitness: "Fitness",
  "fitness-app": "Fitness App",
  health: "Health",
  misc: "Lifestyle",
  "nutrion-medicine": "Nutrition & Medicine",
  featured: "Featured",
  sticky: "Sticky",
  uncategorized: "Uncategorized",
};

// Clean HTML content to markdown-ish format
function cleanContent(html) {
  if (!html) return "";

  let text = html;

  // Convert common HTML to markdown
  text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
  text = text.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
  text = text.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n");
  text = text.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n");
  text = text.replace(/<strong>(.*?)<\/strong>/gi, "**$1**");
  text = text.replace(/<b>(.*?)<\/b>/gi, "**$1**");
  text = text.replace(/<em>(.*?)<\/em>/gi, "*$1*");
  text = text.replace(/<i>(.*?)<\/i>/gi, "*$1*");
  text = text.replace(/<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  text = text.replace(/<ul[^>]*>/gi, "\n");
  text = text.replace(/<\/ul>/gi, "\n");
  text = text.replace(/<ol[^>]*>/gi, "\n");
  text = text.replace(/<\/ol>/gi, "\n");
  text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<p[^>]*>/gi, "\n\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, "> $1\n\n");

  // Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#039;/g, "'");
  text = text.replace(/&nbsp;/g, " ");

  // Clean up excessive whitespace
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.trim();

  return text;
}

let count = 0;

posts.forEach((post) => {
  const isSticky = post.is_sticky === "1" || post.is_sticky === 1;

  // Filter out meta categories for front matter
  const metaCats = ["featured", "sticky", "uncategorized"];
  const displayCats = (post.categories || []).filter(
    (c) => !metaCats.includes(c)
  );
  const allCats = post.categories || [];

  const content = cleanContent(post.content);

  // Build front matter
  const frontMatter = [
    "---",
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `slug: "${post.slug}"`,
    `date: "${post.date.replace(' ', 'T')}"`,
    `categories:`,
    ...displayCats.map((c) => `  - "${c}"`),
    `sticky: ${isSticky}`,
    `featured: ${allCats.includes("featured")}`,
    `views: ${parseInt(post.views) || 0}`,
    `layout: post.njk`,
    "---",
  ].join("\n");

  const fileContent = `${frontMatter}\n\n${content}\n`;
  const filePath = path.join(outDir, `${post.slug}.md`);

  fs.writeFileSync(filePath, fileContent, "utf-8");
  count++;
});

// Write directory data file
const dirData = {
  tags: ["posts"],
  permalink: "/{{ slug }}/index.html",
};
fs.writeFileSync(
  path.join(outDir, "posts.json"),
  JSON.stringify(dirData, null, 2),
  "utf-8"
);

console.log(`Converted ${count} posts to markdown files in ${outDir}`);
console.log(`Created posts.json directory data file`);
