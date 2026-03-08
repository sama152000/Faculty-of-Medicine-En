// الهدف (Goal) الخاص بالقطاع
export interface SectorGoal {
  id: string;
  index: number;
  goalName: string;
  aboutId: string;
}

// المرفقات الخاصة بالقطاع
export interface SectorAttachment {
  id?: string;
  fileName?: string;
  isPublic?: boolean;
  relativePath?: string;
  folderName?: string;
  url?: string;
  isFeatured?: boolean;
  sectorId?: string;
}

// الموديل الأساسي للقطاع
export interface Sector {
  id: string;
  name: string;
  subTitle: string;
  pageId: string;
  pageTitle: string;
  slug: string;
  aboutId: string;
  about: string;
  mission: string;
  vision: string;
  goals: SectorGoal[];
  sectorAttachments: SectorAttachment[];
}

// تفاصيل إضافية للقطاع
export interface SectorDetail {
  id: string;
  title: string;
  content: string;
  sectorId: string;
  sectorName: string;
}

// أعضاء القطاع
export interface SectorMember {
  id: string;
  isLeader: boolean;
  sectorId: string;
  sectorName: string;
  memberId: string;
  memberName: string;
}

// منشورات القطاع
export interface SectorPost {
  id: string;
  sectorId: string;
  sectorName: string;
  postId: string;
  postName: string;
}

// البرامج التابعة للقطاع
export interface SectorProgram {
  id: string;
  name: string;
  sectorId: string;
  sectorName: string;
  programId: string;
  programName?: string | null;
  slug: string;
}

// المرفقات الخاصة بالخدمة
export interface SectorServiceAttachment {
  id: string;
  fileName: string;
  isPublic: boolean;
  relativePath: string;
  folderName: string;
  url: string;
  isFeatured: boolean;
  sectorServiceId: string;
}

// الخدمات التابعة للقطاع
export interface SectorService {
  id: string;
  name: string;
  details: string;
  duration: string;
  applicationUrl: string;
  downloadUrl: string;
  isOnline: boolean;
  category: string;
  fees: number;
  contactPerson: string;
  contactPhone: string;
  sectorId: string;
  sectorName: string;
  sectorServiceAttachments?: SectorServiceAttachment[];
}


// الوحدات التابعة للقطاع
export interface SectorUnit {
  id: string;
  unitName: string;
  unitDescriptionAr?: string | null;
  email?: string;
  employeesCount?: number;
  location?: string;
  unitPhone?: string;
  memberId?: string;
  memberName?: string;
  unitId?: string;
  managementId?: string;
  managementName?: string;
  sectorId: string;
  sectorName: string;
  slug: string;
}
