import puppeteer from "puppeteer";
import {
  generateMetaContent,
  parseMeta,
  splitTextIntoChunks,
} from "./utils.js";
import path from "path";

const md = new (await import("markdown-it")).default();

const dimensions = {
  portrait: { width: 1080, height: 1920 }, // Portrait: 1080x1920
  square: { width: 1080, height: 1080 }, // Square: 1080x1080
  landscape: { width: 1920, height: 1080 }, // Landscape: 1920x1080
};

/**
 * Generates a page from the template, sets the content, and takes a screenshot.
 *
 * @param {object} page - Puppeteer page object.
 * @param {string} htmlContent - The HTML content to be rendered in the page.
 * @param {string} outputDir - Directory where the PNG files will be saved.
 * @param {string} baseFileName - The base file name used to name the output PNG files.
 * @param {number} pageNum - The page number for the output PNG file.
 * @param {string} template - The HTML template used to generate the page.
 * @param {object} options - Options for the image generation.
 */
async function generatePageFromTemplate(
  page,
  htmlContent,
  outputDir,
  baseFileName,
  pageNum,
  template,
  options
) {
  const { width, height } = dimensions[options.layout];
  const finalHtml = template
    .replace("${content}", htmlContent)
    .replace("${theme}", options.theme)
    .replace("${layout}", options.layout)
    .replace("/*$width*/", width)
    .replace("/*$height*/", height);

  await page.setContent(finalHtml, { waitUntil: "load" });
  const outputFile = path.join(
    outputDir,
    `${baseFileName}-${pageNum}-${width}x${height}.png`
  );
  await page.setViewport({ width: width, height: height });
  await page.screenshot({ path: outputFile, fullPage: true });
  process.stdout.write(
    `Generating page ${pageNum} of ${options.limit} (${outputFile}) \r`
  );
}

/**
 * Converts markdown text to PNG images using the specified template and options.
 *
 * @param {string} markdownText - The Markdown text to be converted into images.
 * @param {string} outputDir - Directory where the PNG files will be saved.
 * @param {string} baseFileName - The base file name used to name the output PNG files.
 * @param {string} template - The HTML template used to generate the page.
 * @param {object} [options={}] - Options for the image generation, including layout, charactersPerPage, etc.
 */
async function markdownToPng(
  markdownText,
  outputDir,
  baseFileName,
  template,
  options
) {
  // Set the correct dimensions based on the selected layout
  const { width, height } = dimensions[options.layout];
  console.log(`Layout: ${options.layout} (${width}x${height})`);

  const metaData = parseMeta(markdownText);
  const chunks = splitTextIntoChunks(markdownText, options.charactersPerPage);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // If metadata exists, generate the first page with the metadata
  if (metaData) {
    const metaContent = generateMetaContent(metaData);
    await generatePageFromTemplate(
      page,
      metaContent,
      outputDir,
      baseFileName,
      1, // Metadata is always the first page
      template,
      options
    );
  } else {
    console.error("Metadata not found in the markdown file.");
    process.exit(1);
  }

  // Ensure there are always 10 pages (1 metadata page, 8 content pages, 1 closing page)
  const totalPages = options.limit; // Total pages to generate, including metadata and closing page
  const contentPages = totalPages - 2; // Subtract metadata and closing page for content pages
  const availableContentPages = Math.min(contentPages, chunks.length); // Ensure we don't generate more content pages than chunks

  // Generate content pages (between metadata and closing page)
  for (let i = 0; i < availableContentPages; i++) {
    const htmlContent = `<p>${md.render(chunks[i])}</p>`;
    await generatePageFromTemplate(
      page,
      htmlContent,
      outputDir,
      baseFileName,
      i + 2, // Start numbering from page 2 (after metadata)
      template,
      options
    );
  }

  // Always generate the closing page as the last page
  const closingPageContent =
    "<p>I invite you to read the full article on my blog! Link in Bio!</p>";
  await generatePageFromTemplate(
    page,
    closingPageContent,
    outputDir,
    baseFileName,
    totalPages, // Closing page will always be the last page
    template,
    options
  );

  await browser.close();
}

export default markdownToPng; // Export the markdownToPng function
