// الهدف (Goal) الخاص بالبرنامج
export interface ProgramGoal {
  id: string;
  index: number;
  goalName: string;
  aboutId: string;
}

// المرفقات الخاصة بالبرنامج
export interface ProgramAttachment {
  id?: string;
  filePath?: string;
}

// الموديل الأساسي للبرنامج
export interface Program {
  id: string;
  pageId: string;
  pageTitle: string;
  slug:string;
  aboutId: string;
  about: string;
  mission: string;
  vision: string;
  goals: ProgramGoal[];
  programAttachments: ProgramAttachment[];
}

// تفاصيل إضافية للبرنامج
export interface ProgramDetail {
  id: string;
  title: string;
  content: string;
  programCategory: string;
  facultyId: string;
  facultyName: string;
  programId: string;
  programName: string;
}

// أعضاء البرنامج
export interface ProgramMember {
  id: string;
  isLeader: boolean;
  programId: string;
  programName: string;
  memberId: string;
  memberName: string;
}
