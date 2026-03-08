import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Unit, UnitDetail, UnitMember } from '../model/unit.model';
import { slugify } from '../../../../utils/slugify';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // جلب كل الوحدات
  getAllUnits(): Observable<Unit[]> {
    return this.http.get<{data: Unit[]}>(`${this.apiUrl}unit/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب تفاصيل الوحدات
  getAllUnitDetails(): Observable<UnitDetail[]> {
    return this.http.get<{data: UnitDetail[]}>(`${this.apiUrl}unitdetail/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب أعضاء الوحدات
  getAllUnitMembers(): Observable<UnitMember[]> {
    return this.http.get<{data: UnitMember[]}>(`${this.apiUrl}unitmember/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب وحدة واحدة بالـ id (قديمة)
  getUnitById(id: string): Observable<Unit | undefined> {
    return this.getAllUnits().pipe(
      map(units => units.find(u => u.id === id))
    );
  }

  // جلب وحدة واحدة بالـ slug (جديدة)
  getUnitBySlug(slug: string): Observable<Unit | undefined> {
    return this.getAllUnits().pipe(
      map(units => units.find(u => {
        // slug fallback using english title or arabic title
        const effectiveSlug = slugify(u.slug || u.unitTitleEn || u.unitTitle || '');
        return effectiveSlug === slug;
      }))
    );
  }

  // جلب تفاصيل وحدة واحدة بالـ unitId
  getUnitDetailsByUnitId(unitId: string): Observable<UnitDetail | undefined> {
    return this.getAllUnitDetails().pipe(
      map(details => details.find(d => d.unitId === unitId))
    );
  }

  // جلب أعضاء وحدة واحدة بالـ unitId
  getUnitMembersByUnitId(unitId: string): Observable<UnitMember[]> {
    return this.getAllUnitMembers().pipe(
      map(members => members.filter(m => m.unitId === unitId))
    );
  }
}
