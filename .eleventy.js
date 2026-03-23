module.exports = function (eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");

  // Date formatting filter
  eleventyConfig.addFilter("dateFormat", (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Short date filter
  eleventyConfig.addFilter("dateShort", (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });

  // Limit filter for arrays
  eleventyConfig.addFilter("limit", (arr, limit) => {
    return arr.slice(0, limit);
  });

  // Filter to exclude meta categories from display
  eleventyConfig.addFilter("displayCategories", (categories) => {
    const meta = ["featured", "sticky", "uncategorized"];
    return (categories || []).filter((c) => !meta.includes(c));
  });

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

  eleventyConfig.addFilter("categoryName", (slug) => {
    return categoryNames[slug] || slug;
  });

  // Excerpt filter - first 160 chars
  eleventyConfig.addFilter("excerpt", (content) => {
    if (!content) return "";
    const text = content.replace(/<[^>]+>/g, "").replace(/\n+/g, " ").trim();
    return text.length > 160 ? text.substring(0, 160) + "..." : text;
  });

  // Collection: all posts sorted by date
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/posts/**/*.md")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  // Collection: sticky posts
  eleventyConfig.addCollection("stickyPosts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/posts/**/*.md")
      .filter((item) => item.data.sticky === true)
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  // Collection: featured posts (non-sticky, for homepage cards)
  eleventyConfig.addCollection("recentPosts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/posts/**/*.md")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  // Collections per category
  const cats = [
    "excersice",
    "fitness",
    "fitness-app",
    "health",
    "misc",
    "nutrion-medicine",
  ];
  cats.forEach((cat) => {
    eleventyConfig.addCollection(`cat_${cat}`, (collectionApi) => {
      return collectionApi
        .getFilteredByGlob("src/posts/**/*.md")
        .filter(
          (item) => item.data.categories && item.data.categories.includes(cat)
        )
        .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
    });
  });

  // Markdown configuration
  const markdownIt = require("markdown-it");
  const md = markdownIt({ html: true, linkify: true, typographer: true });
  eleventyConfig.setLibrary("md", md);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownFrontMatterOptions: { excerpt: true },
    templateFormats: ["md", "njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
