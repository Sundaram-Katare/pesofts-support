import { remark } from "remark";
import html from "remark-html";


export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(html, { sanitize: false })
    .process(markdown);
  let htmlString = result.toString();

  // Add matching id attributes to h2 tags for anchor linking
  htmlString = htmlString.replace(/<h2>(.*?)<\/h2>/g, (match, headingText) => {
    const textOnly = headingText.replace(/<[^>]*>/g, "").trim();
    const id = textOnly
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return `<h2 id="${id}">${headingText}</h2>`;
  });

  return htmlString;
}
