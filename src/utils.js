/**
 * Splits the given text into chunks, with each chunk containing a limited number of words.
 * The text is first cleaned of metadata and then split into paragraphs. Each paragraph is
 * further split into chunks that fit the specified word limit.
 *
 * @param {string} text - The text to be split into chunks.
 * @param {number} [wordLimit=72] - The maximum number of words allowed per chunk.
 * @param {number} [limit=10] - The maximum number of chunks (pages) to return.
 * @returns {string[]} An array of text chunks, each with a word count of up to `wordLimit`.
 */
export function splitTextIntoChunks(text, wordLimit = 72, limit = 10) {
  text = text.replace(/---[\s\S]+?---/, ""); // Remove metadata
  const lines = text.split("\n");

  // Remove the first empty line, if any
  if (lines[0].trim() === "") {
    lines.shift();
  }

  // Find the index of the first non-empty line
  const firstNonEmptyIndex = lines.findIndex((line) => line.trim() !== "");

  // Filter out empty lines but keep the first empty line after a paragraph
  let paragraphs = lines.slice(firstNonEmptyIndex).filter((line, index) => {
    if (line.trim() === "" && index > 0 && lines[index - 1].trim() === "") {
      return false; // Skip consecutive empty lines
    }
    return true;
  });

  const chunks = [];
  let chunkCount = 0; // Track the number of chunks created

  paragraphs.forEach((paragraph) => {
    const words = paragraph.split(/\s+/);

    // Split the paragraph into chunks of up to `wordLimit` words
    for (let i = 0; i < words.length; i += wordLimit) {
      let chunk = words.slice(i, i + wordLimit).join(" ");

      // If the chunk is not the last one, add ellipsis
      if (i + wordLimit < words.length) chunk += " ...";

      // If it's not the first chunk, prepend ellipsis
      if (i > 0) chunk = "... " + chunk;

      chunks.push(chunk);

      chunkCount++;

      // Stop chunking if the number of chunks reaches the limit
      if (chunkCount >= limit) {
        chunks[chunkCount - 1] =
          "Read the full article on my blog. Link in bio."; // Add "read more" at the limit
        return; // Exit the loop
      }
    }
  });

  return chunks;
}

/**
 * Parses metadata from the given text. Metadata is assumed to be enclosed in a
 * block of YAML-like syntax, indicated by `---` at the beginning and end.
 *
 * @param {string} text - The text containing metadata.
 * @returns {Object|null} An object containing key-value pairs of metadata, or null if no metadata is found.
 */
export function parseMeta(text) {
  const metaPattern = /---\s*([\s\S]+?)\s*---/;
  const match = text.match(metaPattern);

  if (match) {
    return match[1].split("\n").reduce((metaData, line) => {
      const [key, value] = line.split(":").map((part) => part.trim());
      if (key && value) metaData[key.toLowerCase()] = value;
      return metaData;
    }, {});
  }
  return null;
}

/**
 * Generates HTML content to represent metadata as a series of div elements.
 * Each metadata key-value pair is wrapped in a `div` element with a specific class.
 *
 * @param {Object} metaData - The metadata to be rendered as HTML.
 * @returns {string} The HTML string representing the metadata.
 */
export function generateMetaContent(metaData) {
  return `<div class='properties'>${Object.entries(metaData)
    .map(
      ([key, value]) => `<div class="property property--${key}">${value}</div>`
    )
    .join("")}</div>`;
}
