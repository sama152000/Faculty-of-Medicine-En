// مرفقات الصفحة
export interface PageAttachment {
  id: string;
  fileName: string;
  isPublic: boolean;
  relativePath: string;
  folderName: string;
  url: string;
  pageId: string;
}

export interface CustomPage {
  id: string;
  pageId: string;
  pageTitle: string;  // Maps from slug in API response
  slug: string;
  titleEn?: string;  // English title for matching
  pageType: string;
  subTitle: string;
  content: string;
  status: string;
  publishedDate: string;
  featuredImagePath: string;
  pageAttachments: PageAttachment[];
}
