export interface PageAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize?: string;
  fileType?: string;
}

export interface DecisionPage {
  id: number;
  subTitle?: string;
  content?: string;
  pageAttachments?: PageAttachment[];
}