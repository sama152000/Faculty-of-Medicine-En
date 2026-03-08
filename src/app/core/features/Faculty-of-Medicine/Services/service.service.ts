import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { ServiceDetail } from '../model/service.model';
import { slugify } from '../../../../utils/slugify';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = environment.apiUrl + 'services';

  constructor(private http: HttpClient) {}

  // جلب كل الخدمات
  getAll(): Observable<ServiceDetail[]> {
    return this.http.get<{data: ServiceDetail[]}>(`${this.apiUrl}/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب خدمة واحدة بالـ id
  getById(id: string): Observable<ServiceDetail | undefined> {
    return this.getAll().pipe(
      map(services => services.find(s => s.id === id))
    );
  }

  // جلب خدمة واحدة بالـ slug
  getBySlug(slug: string): Observable<ServiceDetail | undefined> {
    return this.getAll().pipe(
      map(services => services.find(s => {
        // build slug from property or title
        const effectiveSlug = slugify(s.slug || s.title || '');
        return effectiveSlug === slug;
      }))
    );
  }
}
