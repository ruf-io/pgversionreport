
export default async function middleware(request: Request) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
        const indexUrl = `${url.origin}/index.html`; // little bit of a back to handle that the content exists on another route
        const text = await (await fetch(indexUrl)).text();
        const html = text.replace(
            '<meta property="og:image" content="INJECT_OG_IMAGE_HERE">',
            `<meta property="og:image" content="https://example.com?${url.searchParams.toString()}">`,
        );
        return new Response(html, {
            headers: {
                "content-type": "text/html; charset=utf-8",
            },
        });
    }
}
