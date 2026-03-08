import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Center, CenterDetail, CenterMember } from '../model/center.model';
import { slugify } from '../../../../utils/slugify';

@Injectable({
  providedIn: 'root'
})
export class CentersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // جلب كل المراكز
  getAllCenters(): Observable<Center[]> {
    return this.http.get<{data: Center[]}>(`${this.apiUrl}center/getall`).pipe(
      map(res => res.data)
    );
  }

  // جلب تفاصيل المراكز
  getCenterDetails(): Observable<CenterDetail[]> {
    return this.http.get<{data: CenterDetail[]}>(`${this.apiUrl}centerdetail/getall`).pipe(
      map(res => res.data)
    );
  }

  // جلب أعضاء المراكز
  getCenterMembers(): Observable<CenterMember[]> {
    return this.http.get<{data: CenterMember[]}>(`${this.apiUrl}centermember/getall`).pipe(
      map(res => res.data)
    );
  }

  // جلب مركز واحد بالـ id (قديمة)
  getById(id: string): Observable<Center | undefined> {
    return this.getAllCenters().pipe(
      map(centers => centers.find(c => c.id === id))
    );
  }

  // جلب مركز واحد بالـ slug (جديدة)
  getBySlug(slug: string): Observable<Center | undefined> {
    return this.getAllCenters().pipe(
      map(centers => centers.find(c => slugify(c.slug || '') === slug))
    );
  }

  // جلب تفاصيل مركز واحد بالـ centerId
  getDetailsByCenterId(centerId: string): Observable<CenterDetail | undefined> {
    return this.getCenterDetails().pipe(
      map(details => details.find(d => d.centerId === centerId))
    );
  }

  // جلب أعضاء مركز واحد بالـ centerId
  getMembersByCenterId(centerId: string): Observable<CenterMember[]> {
    return this.getCenterMembers().pipe(
      map(members => members.filter(m => m.centerId === centerId))
    );
  }
}
