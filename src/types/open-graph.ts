export interface TemplateProps {
  title: string;
  heroImageUrl: string;
  avatarImageUrl: string;
  siteUrl: string;
}

export interface FrontmatterProps {
  title: string;
  heroImage: any; // todo: find frontmatter import prop type
  pageId: string;
}
