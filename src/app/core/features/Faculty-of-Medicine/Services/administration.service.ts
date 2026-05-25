import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Management, ManagementDetail, ManagementMember } from '../model/administration.model';
import { slugify } from '../../../../utils/slugify';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // جلب كل الإدارات
  getAllManagements(): Observable<Management[]> {
    return this.http.get<{ data: Management[] }>(`${this.apiUrl}management/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب تفاصيل الإدارات
  getAllManagementDetails(): Observable<ManagementDetail[]> {
    return this.http.get<{ data: ManagementDetail[] }>(`${this.apiUrl}managementdetail/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب أعضاء الإدارات
  getAllManagementMembers(): Observable<ManagementMember[]> {
    return this.http.get<{ data: ManagementMember[] }>(`${this.apiUrl}managementmember/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب إدارة واحدة بالـ id
  getManagementById(id: string): Observable<Management | undefined> {
    return this.getAllManagements().pipe(
      map(managements => managements.find(m => m.id === id))
    );
  }

  // جلب إدارة واحدة بالـ slug
  getManagementBySlug(slug: string): Observable<Management | undefined> {
    return this.getAllManagements().pipe(
      map(managements => {
        const normalizedSlug = slug?.toLowerCase().trim();
        // 1. Exact match on management's own slug field
        return managements.find(m => m.slug === slug)
          // 2. Case-insensitive match on slug field
          ?? managements.find(m => m.slug?.toLowerCase().trim() === normalizedSlug)
          // 3. Match against slugified English title (same logic the menu uses for URL building)
          ?? managements.find(m => slugify(m.managementTitleEn ?? '') === normalizedSlug)
          // 4. Match against slugified Arabic title as last resort
          ?? managements.find(m => slugify(m.managementTitle ?? '') === normalizedSlug);
      })
    );
  }

  // جلب تفاصيل إدارة واحدة بالـ managementId
  getManagementDetailsByManagementId(managementId: string): Observable<ManagementDetail | undefined> {
    return this.getAllManagementDetails().pipe(
      map(details => details.find(d => d.managementId === managementId))
    );
  }

  // جلب أعضاء إدارة واحدة بالـ managementId
  getManagementMembersByManagementId(managementId: string): Observable<ManagementMember[]> {
    return this.getAllManagementMembers().pipe(
      map(members => members.filter(m => m.managementId === managementId))
    );
  }
}
