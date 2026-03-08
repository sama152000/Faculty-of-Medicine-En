// الهدف (Goal) الخاص بالقسم
export interface DepartmentGoal {
  id: string;
  index: number;
  goalName: string;
  aboutId: string;
}

// المرفقات الخاصة بالقسم
export interface DepartmentAttachment {
  id: string;
  fileName: string;
  isPublic: boolean;
  relativePath: string;
  folderName: string;
  url: string;
  isFeatured: boolean;
  departmentId: string;
}

// الموديل الأساسي للقسم
export interface Department {
  id: string;
  name: string;
  subTitle: string;
  slug: string;
  departmentType: string;
  pageId: string;
  pageTitle: string;
  aboutId: string;
  about: string;
  mission: string;
  vision: string;
  goals: DepartmentGoal[];
  departmentAttachments: DepartmentAttachment[];
}

// تفاصيل إضافية للقسم
export interface DepartmentDetail {
  id: string;
  title: string;
  content: string;
  departmentId: string;
  departmentName: string;
}

// أعضاء القسم
export interface DepartmentMember {
  id: string;
  isLeader: boolean;
  departmentId: string;
  departmentName: string;
  memberId: string;
  memberName: string;
}

// البرامج التابعة للقسم
export interface DepartmentProgram {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  programId: string;
  programName: string;
}

// الخدمات التابعة للقسم
export interface DepartmentService {
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
  departmentId: string;
  departmentName: string;
}
