import { Injectable, inject } from '@angular/core';
import { NavbarItem, ApiMenuItem } from '../model/menu.model';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { slugify } from '../../../../utils/slugify';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, of as observableOf } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { DepartmentsService } from './departments.service';
import { DepartmentType } from '../../../enums/app.enums';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = environment.apiUrl;
  private readonly errorHandler = inject(ErrorHandlerService);

  constructor(
    private http: HttpClient,
    private departmentsService: DepartmentsService
  ) {}

  getAllMenus(): Observable<NavbarItem[]> {
    return this.http.get<{ data: ApiMenuItem[] }>(`${this.apiUrl}menus/getall`).pipe(
      switchMap((response) => {
        const menuItems = this.buildTree(response.data);

        const departmentsMenu = menuItems.find(item => item.type === 'columns');

        if (departmentsMenu?.children?.length) {
          return this.departmentsService.getAllDepartments().pipe(
            map(departments => {
              departmentsMenu.children?.forEach(child => {
                const label = child.label?.toLowerCase() || '';

                if (label.includes('أكاديمي') || label.includes('academic')) {
                  const academicDepts = departments.filter(d =>
                    d.departmentType === 'Academic' || d.departmentType === 'AcademicDepartments'
                  );
                  child.children = academicDepts.map(dept => ({
                    id: dept.id,
                    type: 'menu' as const,
                    departmentType: DepartmentType.Academic,
                    isActive: false,
                    pageId: dept.pageId,
                    label: dept.name, // يعرض بالعربي
                    slug: slugify(dept.slug),
                    children: []
                  }));
                  child.departmentType = DepartmentType.Academic;
                }
                else if (label.includes('إكليني') || label.includes('clinical')) {
                  const clinicalDepts = departments.filter(d =>
                    d.departmentType === 'Clinical' || d.departmentType === 'ClinicalDepartments'
                  );
                  child.children = clinicalDepts.map(dept => ({
                    id: dept.id,
                    type: 'menu' as const,
                    departmentType: DepartmentType.Clinical,
                    isActive: false,
                    pageId: dept.pageId,
                    label: dept.name, // يعرض بالعربي
                    slug: slugify(dept.slug),
                    children: []
                  }));
                  child.departmentType = DepartmentType.Clinical;
                }
              });

              return menuItems;
            }),
            catchError(() => observableOf(menuItems))
          );
        }

        return observableOf(menuItems);
      }),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return observableOf([]);
      }),
    );
  }

  private buildTree(items: ApiMenuItem[]): NavbarItem[] {
    const roots = items.filter((i) => !i.parentId);
    return roots
      .sort((a, b) => a.order - b.order)
      .map((item) => this.mapItem(item, ''));
  }

  private mapItem(item: ApiMenuItem, parentSlug: string): NavbarItem {
    // slug مبني من titleEn (ثابت بالإنجليزي) أو slugify(title)
    const itemSlug = item.titleEn ? slugify(item.titleEn) : slugify(item.title);
    const isCustomPage = item.pageTemplate?.trim().toLowerCase() === 'custome';

    // console.log(`Mapping item: ${item.title} - pageTemplate: ${item.pageTemplate} - isCustom: ${isCustomPage}`);

    return {
      id: item.id,
      type: isCustomPage ? 'custom' : (item.titleEn?.toLowerCase() === 'departments' ? 'columns' : 'menu'),
      departmentType: item.departmentType,
      isActive: false,
      pageId: item.pageId,
      label: item.title, // يعرض بالعربي
      icon: item.icon,
      slug: isCustomPage 
        ? `/custom/${itemSlug}` // ✅ slug مبني من titleEn أو title
        : (parentSlug ? `${parentSlug}/${itemSlug}` : `/${itemSlug}`),
      children: item.childs?.length
        ? item.childs.sort((a, b) => a.order - b.order)
          .map((child) => this.mapItem(child, parentSlug ? `${parentSlug}/${itemSlug}` : `/${itemSlug}`))
        : []
    };
  }

  updateActiveTab(id: string): Observable<NavbarItem[]> {
    return this.getAllMenus().pipe(
      map((tabs) => {
        this.deactivateAll(tabs);
        this.findAndActivate(tabs, id);
        return tabs;
      })
    );
  }

  private deactivateAll(tabs: NavbarItem[]): void {
    tabs.forEach(tab => {
      tab.isActive = false;
      if (tab.children) {
        this.deactivateAll(tab.children);
      }
    });
  }

  private findAndActivate(tabs: NavbarItem[], id: string, parent?: NavbarItem): boolean {
    for (let tab of tabs) {
      if (tab.id === id) {
        tab.isActive = true;
        if (parent) {
          parent.isActive = true;
        }
        return true;
      }
      if (tab.children && this.findAndActivate(tab.children, id, tab)) {
        return true;
      }
    }
    return false;
  }
}
