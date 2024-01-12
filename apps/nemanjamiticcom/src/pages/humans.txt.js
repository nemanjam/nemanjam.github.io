export function GET() {
	const date = new Date();
	return new Response(
		`/* TEAM */
Author: Paul Armstrong
Site: https://paularmstrong.dev
Mastodon: @paularmstrong@mstdn.io
Github: @paularmstrong
LinkedIn: https://linkedin.com/in/paularmstrong-dev/
Twitter: @paularmstrong

/* SITE */
Last updated: ${date.toISOString().split('T')[0]}
Software: Astro, Solid-js, Typescript, JavaScript, Markdown
`,
		{ status: 200, headers: { 'content-type': 'text/plain' } },
	);
}
