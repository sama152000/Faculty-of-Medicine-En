// هدف (Goal) الخاص بالإدارة
export interface ManagementGoal {
  id: string;
  index: number;
  goalName: string;
  aboutId: string;
}

// مرفقات الإدارة
export interface ManagementAttachment {
  id?: string;
  filePath?: string;
}

// الموديل الأساسي للإدارة
export interface Management {
  id: string;
  pageId: string;
  managementTitle: string;
  managementTitleEn: string;
  slug: string;
  aboutId: string;
  content: string;
  mission: string;
  vision: string;
  history?: string | null;
  goals: ManagementGoal[];
  managementAttachments: ManagementAttachment[];
}

// تفاصيل إضافية للإدارة
export interface ManagementDetail {
  id: string;
  title: string;
  description: string;
  content: string;
  managementId: string;
  managementTitle: string;
}

// أعضاء الإدارة
export interface ManagementMember {
  id: string;
  isLeader: boolean;
  managementId: string;
  managementTitle: string;
  memberId: string;
  memberName: string;
  memberPhoto: string | null;
}
