interface BlogPost {
  // required
  id: string;
  slug: string;
  permalink: string;
  publishDate: Date;
  title: string;

  // optional bellow
  updateDate?: Date;
  excerpt?: string;
  image?: ImageMetadata | string;
  category?: string;
  tags?: string[];
  author?: string;
  metadata?: MetaData;
  draft?: boolean;
  Content?: AstroComponentFactory;
  content?: string;
  readingTime?: number;
}

interface MetaDataRequired {
  title: string;
  ignoreTitleTemplate: boolean;
  canonical: string;
  robots: MetaDataRobots;
  description: string;
  openGraph: MetaDataOpenGraph;
  twitter: MetaDataTwitter;
}
interface MetaData extends Partial<MetaDataRequired> {}

interface MetaDataRobotsRequired {
  index: boolean;
  follow: boolean;
}
interface MetaDataRobots extends Partial<MetaDataRobotsRequired> {}

interface MetaDataImage {
  url: string;
  width?: number;
  height?: number;
}

interface MetaDataOpenGraphRequired {
  url: string;
  siteName: string;
  images: MetaDataImage[];
  locale: string;
  type: string;
}
interface MetaDataOpenGraph extends Partial<MetaDataOpenGraphRequired> {}

interface MetaDataTwitterRequired {
  handle: string;
  site: string;
  cardType: string;
}
interface MetaDataTwitter extends Partial<MetaDataTwitterRequired> {}

export type { BlogPost, MetaData };
