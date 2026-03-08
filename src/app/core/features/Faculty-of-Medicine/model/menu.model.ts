import { DepartmentType } from "../../../enums/app.enums";
import { PageAttachment } from "./custom-page.model";

export interface MenuTab {
  id: number;
  title: string;
  icon?: string;
  target?: string;
  fragment?: string;
  isActive: boolean;
  type?: 'menu' | 'columns';
  childs?: MenuTab[];
}
export interface NavbarItem {
  id: string;  
  pageId: string;
  label: string;
  slug: string;
  isActive: boolean;
  type: 'menu' | 'columns' | 'custom'; // ✅ أضفنا custom
  departmentType?: DepartmentType;
  icon?: string;
  children?: NavbarItem[];
}


export interface ApiMenuItem {
  id: string;
  pageId: string;
  title: string;
  titleEn: string;
  slug: string;
  pageTemplate: string; // "Default" أو "Custome"
  icon: string;
  order: number;
  departmentType?: DepartmentType;
  parentId: string | null;
  childs: ApiMenuItem[];
}

