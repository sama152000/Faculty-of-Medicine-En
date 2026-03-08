import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { CustomPage } from '../model/custom-page.model';
import { slugify } from '../../../../utils/slugify';

// Interface for API response
interface ApiCustomPage {
  id: string;
  pageId: string;
  slug: string;
  titleEn?: string;  // Add titleEn field
  pageType: string;
  pageTemplate: number;
  subTitle: string;
  content: string;
  status: string;
  publishedDate: string;
  featuredImagePath: string;
  pageAttachments: any[];
}

@Injectable({
  providedIn: 'root'
})
export class CustomPageService {
  private apiUrl = environment.apiUrl + 'customepages';

  constructor(private http: HttpClient) {}

  // Map API response to frontend model
  private mapApiResponse(apiPage: ApiCustomPage): CustomPage {
    return {
      id: apiPage.id,
      pageId: apiPage.pageId,
      pageTitle: apiPage.subTitle || apiPage.slug,  // ✅ استخدم subtitle لو موجود
      slug: apiPage.slug,
      titleEn: apiPage.titleEn,  // Store titleEn
      pageType: apiPage.pageType,
      subTitle: apiPage.subTitle,
      content: apiPage.content,
      status: apiPage.status,
      publishedDate: apiPage.publishedDate,
      featuredImagePath: apiPage.featuredImagePath,
      pageAttachments: apiPage.pageAttachments
    };
  }

  // جلب كل الصفحات المخصصة
  getAll(): Observable<CustomPage[]> {
    return this.http.get<{data: ApiCustomPage[]}>(`${this.apiUrl}/getall`).pipe(
      map(response => response.data.map(page => this.mapApiResponse(page)))
    );
  }

  // جلب صفحة واحدة بالـ id
  getById(id: string): Observable<CustomPage | undefined> {
    return this.http.get<{data: ApiCustomPage}>(`${this.apiUrl}/get/${id}`).pipe(
      map(response => this.mapApiResponse(response.data)),
      catchError(() => {
        return this.getAll().pipe(
          map(pages => pages.find(p => p.id === id || p.pageId === id))
        );
      })
    );
  }

  // جلب صفحة واحدة بالـ pageId
  getByPageId(pageId: string): Observable<CustomPage | undefined> {
    return this.http.get<{data: ApiCustomPage}>(`${this.apiUrl}/get/${pageId}`).pipe(
      map(response => this.mapApiResponse(response.data)),
      catchError(() => {
        return this.getAll().pipe(
          map(pages => pages.find(p => p.pageId === pageId))
        );
      })
    );
  }

  // جلب صفحة واحدة بالـ title
  getByTitle(title: string): Observable<CustomPage | undefined> {
    return this.getAll().pipe(
      map(pages => pages.find(p => p.pageTitle === title))
    );
  }

// جلب صفحة واحدة بالـ slug (يدعم العربي والإنجليزي)
getBySlug(slug: string): Observable<CustomPage | undefined> {
  return this.getAll().pipe(
    map(pages => {
      // إزالة /custom/ prefix لو موجود
      const cleanSlug = slug.startsWith('custom/') ? slug.replace('custom/', '') : slug;
      
      const found = pages.find(p => {
        // 1. Match against the original slug
        if (slugify(p.slug || '') === cleanSlug) return true;
        
        // 2. Match against subTitle (slugified)
        if (slugify(p.subTitle || '') === cleanSlug) return true;
        
        // 3. Match against pageTitle (slugified)
        if (slugify(p.pageTitle || '') === cleanSlug) return true;
        
        // 4. Match against titleEn (if available)
        if (p.titleEn && slugify(p.titleEn) === cleanSlug) return true;
        
        // 5. Direct match (no slugify)
        if (p.slug === cleanSlug) return true;
        if (p.titleEn === cleanSlug) return true;
        
        return false;
      });
      return found;
    })
  );
}


  // جلب الصفحات حسب الـ pageType
  getByPageType(pageType: string): Observable<CustomPage[]> {
    return this.getAll().pipe(
      map(pages => pages.filter(p => p.pageType === pageType))
    );
  }
}
