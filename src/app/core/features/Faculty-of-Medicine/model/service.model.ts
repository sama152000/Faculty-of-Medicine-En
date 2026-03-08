// تفاصيل الخدمة
export interface ServiceDetail {
  id: string;
  title: string;
  slug:string;
  description: string;
  iconPath: string;
  isActive: boolean;
  steps?: string[];
}
