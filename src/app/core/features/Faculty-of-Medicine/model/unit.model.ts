// الهدف (Goal) الخاص بالوحدة
export interface UnitGoal {
  id: string;
  index: number;
  goalName: string;
  aboutId: string;
}

// المرفقات الخاصة بالوحدة
export interface UnitAttachment {
  id?: string;
  filePath?: string;
}

// الموديل الأساسي للوحدة
export interface Unit {
  id: string;
  pageId: string;
  unitTitle: string;
  unitTitleEn: string;
  slug: string;
  aboutId: string;
  content: string;
  mission: string;
  vision: string;
  history?: string | null;
  goals: UnitGoal[];
  unitAttachments: UnitAttachment[];
}

// تفاصيل إضافية للوحدة
export interface UnitDetail {
  id: string;
  title: string;
  content: string;
  unitPlace: string;
  unitId: string;
  unitTitle: string;
  unitAttachments: UnitAttachment[];
}

// أعضاء الوحدة
export interface UnitMember {
  id: string;
  isLeader: boolean;
  unitId: string;
  unitTitle: string;
  memberId: string;
  memberName: string;
}
