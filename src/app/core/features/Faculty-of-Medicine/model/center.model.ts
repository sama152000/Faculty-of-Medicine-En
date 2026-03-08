// الهدف (Goal) الخاص بالمركز
export interface CenterGoal {
  id: string;
  index: number;
  goalName: string;
  aboutId: string;
}

// المرفقات الخاصة بالمركز (لو فيه ملفات أو صور)
export interface CenterAttachment {
  id?: string;
  filePath?: string;
}

// الموديل الأساسي للمركز
export interface Center {
  id: string;
  subTitle: string;
  slug:string;
  place: string;
  pageId: string;
  centerName: string;
  centerNameEn: string;
  aboutId: string;
  about: string;
  mission: string;
  vision: string;
  goals: { id: string; index: number; goalName: string; aboutId: string }[];
  centerAttachments: any[];
}

export interface CenterDetail {
  id: string;
  title: string;
  description: string;
  content: string;
  centerId: string;
  center: string;
}

export interface CenterMember {
  id: string;
  isLeader: boolean;
  centerId: string;
  centerName: string;
  memberId: string;
  memberName: string;
  memberImageUrl?: string;
}
