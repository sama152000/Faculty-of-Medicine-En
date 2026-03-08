// أهداف الكلية
export interface AboutGoal {
  id: string;
  index: number;
  goalName: string;
  aboutId: string;
}

// الموديل الأساسي لصفحة "عن الكلية"
export interface AboutUniversity {
  id: string;
  content: string;
  mission: string;
  vision: string;
  history: string;
  goals: AboutGoal[];
  pageId: string;
  pageType: string;   // "AboutUniversity"
  pageName: string;
  pageNameEn: string;
}

// مرفقات عضو هيئة التدريس (صور شخصية)
export interface MemberAttachment {
  id: string;
  fileName: string;
  isPublic: boolean;
  relativePath: string;
  folderName: string;
  url: string;
  memberId: string;
}

// عضو هيئة التدريس
export interface Member {
  id: string;
  isPresident: boolean;
  fullName: string;
  position: string;
  specialization: string;
  pageId: string;
  memberType: string; // President, Sector, Center, Unit, Program, Department
  memberAttachments: MemberAttachment[];
}


