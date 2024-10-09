import Semver from "./src/utils/Semver";
import versions from "./src/data/version_dates.json";

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
            const versionStr = url.searchParams.get("version");
            const version = new Semver(versionStr);

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
            'content="INJECT_OG_IMAGE_HERE"',
            `content="${ogUrl}"`,
        );
        return new Response(html, {
            headers: {
                "content-type": "text/html; charset=utf-8",
            },
        });
    }
}
