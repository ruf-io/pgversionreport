import Semver from "./src/utils/Semver";
import versions from "./src/data/version_dates.json";

const versionRegex = /PostgreSQL ([0-9.]+)/;

export default async function middleware(request: Request) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
        // Get the HTML we are going to update.
        const indexUrl = `${url.origin}/index.html`; // little bit of a back to handle that the content exists on another route
        const text = await (await fetch(indexUrl)).text();

        // Figure out the opengraph image url.
        let ogUrl = `${url.origin}/images/default_og.png`;
        try {
            // Try to decode the data.
            const data = atob(url.searchParams.get("data"));

            // Extract the version.
            const versionMatch = data.match(versionRegex);
            if (!versionMatch) {
                throw 1; // Break out of this block.
            }
            const version = new Semver(versionMatch[1]);

            // Check if the version is within the data.
            const shortenedVersion = `${version.major}.${version.minor}`;
            if (shortenedVersion in versions) {
                // Set the URL to this.
                ogUrl = `${url.origin}/images/pg_generated/${shortenedVersion}.png`;
            }
        } catch {
            // Use the default if this fails for any reason.
        }

        // Update the HTML based on it and return that to the user.
        const html = text.replace(
            '<meta property="og:image" content="INJECT_OG_IMAGE_HERE">',
            `<meta property="og:image" content="${ogUrl}">`,
        );
        return new Response(html, {
            headers: {
                "content-type": "text/html; charset=utf-8",
            },
        });
    }
}
