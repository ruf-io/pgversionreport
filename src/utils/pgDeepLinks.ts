import { marked } from "marked";

function markdownToPlainText(markdown: string): string {
    const html = marked.parse(markdown, { async: false }) as string;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    let plainText = tempDiv.textContent || tempDiv.innerText || "";

    // Trim whitespace and remove extra spaces
    plainText = plainText.trim().replace(/\s+/g, " ");

    // Remove § symbols
    plainText = plainText.replace(/§/g, "").trim();

    return plainText;
}

export function generatePgDeepLink(
    version: string,
    markdownText: string,
): string {
    const shortVersion = version.split(".").slice(0, 2).join(".");

    const plainText = markdownToPlainText(markdownText);

    // Encode the text, ensuring dashes are encoded as %2D
    const encodedText = encodeURIComponent(plainText).replace(/-/g, "%2D");

    return `https://www.postgresql.org/docs/release/${shortVersion}/#:~:text=${encodedText}`;
}
