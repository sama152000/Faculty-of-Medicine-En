export interface PostCategory {
  id: string;
  postId: string;
  categoryId: string;
  categoryName: string;
}

export interface PostAttachment {
  id: string;
  fileName: string;
  isPublic: boolean;
  relativePath: string;
  folderName: string;
  url: string;
  postId: string;
}

export interface PostTag {
  postId: string;
  index: number;
  id: string;
  name: string;
}

/** عداد المشاهدات الفردي — يُرجَع من الـ API ضمن مصفوفة newsViewCounters */
export interface NewsViewCounter {
  count: number;
}

export interface News {
  id: string;
  title: string;
  urlTitleEn: string;
  content: string;
  status: string;
  type: string | number;
  /** قد يكون null إذا لم يُحدَّد تاريخ نشر */
  publishedDate: string | null;
  featuredImagePath: string;
  pageId: string;
  pageTittle: string;
  createdDate: string;
  postCategories: PostCategory[];
  postAttachments: PostAttachment[];
  tags: PostTag[];
  /** مصفوفة عدادات المشاهدات الفردية من الـ API */
  newsViewCounters: NewsViewCounter[];
  /** مجموع المشاهدات — يُحسَب في الـ backend ويُرجَع جاهزاً */
  totalViewCount: number;
  slug?: string;
  categoryName?: string;
}

/** Alias so components can use either name */
export type Post = News;

export interface PagedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}
