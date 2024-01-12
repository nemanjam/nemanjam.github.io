declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"2017-04-11-twitter-lite-and-high-performance-react-progressive-web-apps-at-scale.mdx": {
	id: "2017-04-11-twitter-lite-and-high-performance-react-progressive-web-apps-at-scale.mdx";
  slug: "twitter-lite-and-high-performance-react-progressive-web-apps-at-scale";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2020-05-16-git-helpers.mdx": {
	id: "2020-05-16-git-helpers.mdx";
  slug: "git-helpers";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2020-11-16-ducky.mdx": {
	id: "2020-11-16-ducky.mdx";
  slug: "ducky";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2020-12-22-javascript-html-templating.mdx": {
	id: "2020-12-22-javascript-html-templating.mdx";
  slug: "javascript-html-templating";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-10-24-open-source-break.mdx": {
	id: "2021-10-24-open-source-break.mdx";
  slug: "2021-10-24-open-source-break";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2021-11-08-abandoning-amp.mdx": {
	id: "2021-11-08-abandoning-amp.mdx";
  slug: "abandoning-amp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-05-17-nine-years-sober.mdx": {
	id: "2022-05-17-nine-years-sober.mdx";
  slug: "nine-years-sober";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-06-04-custom-wedding-website-part-1.mdx": {
	id: "2022-06-04-custom-wedding-website-part-1.mdx";
  slug: "custom-wedding-website-part-1";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-06-04-custom-wedding-website.mdx": {
	id: "2022-06-04-custom-wedding-website.mdx";
  slug: "custom-wedding-website";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-08-29-shootings.mdx": {
	id: "2022-08-29-shootings.mdx";
  slug: "shootings";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-09-26-hacking-express-nodejs-timeout-middleware.mdx": {
	id: "2022-09-26-hacking-express-nodejs-timeout-middleware.mdx";
  slug: "hacking-express-nodejs-timeout-middleware";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-10-11-diy-photobooth.mdx": {
	id: "2022-10-11-diy-photobooth.mdx";
  slug: "diy-photobooth";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-10-12-new-site-who-dis.mdx": {
	id: "2022-10-12-new-site-who-dis.mdx";
  slug: "new-site-who-dis";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-10-13-custom-wedding-website-part-2.mdx": {
	id: "2022-10-13-custom-wedding-website-part-2.mdx";
  slug: "custom-wedding-website-part-2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-10-14-tech-design-template.mdx": {
	id: "2022-10-14-tech-design-template.mdx";
  slug: "tech-design-template";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-10-18-current-tool-chest.mdx": {
	id: "2022-10-18-current-tool-chest.mdx";
  slug: "current-tool-chest";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-10-26-diy-photobooth-nerdy-details.mdx": {
	id: "2022-10-26-diy-photobooth-nerdy-details.mdx";
  slug: "diy-photobooth-nerdy-details";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-11-03-inhumanity-of-twitter-management.mdx": {
	id: "2022-11-03-inhumanity-of-twitter-management.mdx";
  slug: "inhumanity-of-twitter-management";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-11-04-mourning-twitter.mdx": {
	id: "2022-11-04-mourning-twitter.mdx";
  slug: "mourning-twitter";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-11-09-the-case-for-astro.mdx": {
	id: "2022-11-09-the-case-for-astro.mdx";
  slug: "the-case-for-astro";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-11-10-css-box-sizing-border-box.mdx": {
	id: "2022-11-10-css-box-sizing-border-box.mdx";
  slug: "css-box-sizing-border-box";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-11-21-client-hint-headers-for-dark-mode-theme.mdx": {
	id: "2022-11-21-client-hint-headers-for-dark-mode-theme.mdx";
  slug: "client-hint-headers-for-dark-mode-theme";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-11-22-my-biggest-technical-mistakes.mdx": {
	id: "2022-11-22-my-biggest-technical-mistakes.mdx";
  slug: "my-biggest-technical-mistakes";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-11-28-lessons-learned-how-i-would-rebuild-twitter-today.mdx": {
	id: "2022-11-28-lessons-learned-how-i-would-rebuild-twitter-today.mdx";
  slug: "lessons-learned-how-i-would-rebuild-twitter-today";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2022-12-19-healthy-meetings-in-tech.mdx": {
	id: "2022-12-19-healthy-meetings-in-tech.mdx";
  slug: "healthy-meetings-in-tech";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2023-01-20-javascript-and-frontend-things-to-see-in-2023.mdx": {
	id: "2023-01-20-javascript-and-frontend-things-to-see-in-2023.mdx";
  slug: "javascript-and-frontend-things-to-see-in-2023";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2023-03-13-why-we-do-not-write-web-components.mdx": {
	id: "2023-03-13-why-we-do-not-write-web-components.mdx";
  slug: "why-we-do-not-write-web-components";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2023-03-24-a-clean-codebase-is-a-happy-codebase.mdx": {
	id: "2023-03-24-a-clean-codebase-is-a-happy-codebase.mdx";
  slug: "a-clean-codebase-is-a-happy-codebase";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2023-08-14-the-line-between-writing-functions-yourself-and-using-open-source-modules.mdx": {
	id: "2023-08-14-the-line-between-writing-functions-yourself-and-using-open-source-modules.mdx";
  slug: "the-line-between-writing-functions-yourself-and-using-open-source-modules";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2023-08-29-import-path-aliasing-is-a-crutch-for-poor-architecture.mdx": {
	id: "2023-08-29-import-path-aliasing-is-a-crutch-for-poor-architecture.mdx";
  slug: "import-path-aliasing-is-a-crutch-for-poor-architecture";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2023-09-14-we-use-type-safety-not-on-preference-but-because-we-want-to-make-money.mdx": {
	id: "2023-09-14-we-use-type-safety-not-on-preference-but-because-we-want-to-make-money.mdx";
  slug: "we-use-type-safety-not-on-preference-but-because-we-want-to-make-money";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"2023-11-27-apps-tools-for-2023.mdx": {
	id: "2023-11-27-apps-tools-for-2023.mdx";
  slug: "apps-tools-for-2023";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"desktop-organization-and-workflow.mdx": {
	id: "desktop-organization-and-workflow.mdx";
  slug: "desktop-organization-and-workflow";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"solidjs-is-what-react-should-have-become.mdx": {
	id: "solidjs-is-what-react-should-have-become.mdx";
  slug: "solidjs-is-what-react-should-have-become";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"why-and-how-of-monorepos.mdx": {
	id: "why-and-how-of-monorepos.mdx";
  slug: "why-and-how-of-monorepos";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"why-tailwindcss.mdx": {
	id: "why-tailwindcss.mdx";
  slug: "why-tailwindcss";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
};
"labs": {
"move-fast-with-confidence.mdx": {
	id: "move-fast-with-confidence.mdx";
  slug: "move-fast-with-confidence";
  body: string;
  collection: "labs";
  data: InferEntrySchema<"labs">
} & { render(): Render[".mdx"] };
"react-component-benchmark.mdx": {
	id: "react-component-benchmark.mdx";
  slug: "react-component-benchmark";
  body: string;
  collection: "labs";
  data: InferEntrySchema<"labs">
} & { render(): Render[".mdx"] };
"remove-import-aliasing.mdx": {
	id: "remove-import-aliasing.mdx";
  slug: "remove-import-aliasing";
  body: string;
  collection: "labs";
  data: InferEntrySchema<"labs">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
