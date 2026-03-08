import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Department, DepartmentDetail, DepartmentMember, DepartmentProgram, DepartmentService } from '../model/department.model';
import { slugify } from '../../../../utils/slugify';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // جلب كل الأقسام
  getAllDepartments(): Observable<Department[]> {
    return this.http.get<{data: Department[]}>(`${this.apiUrl}departments/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب تفاصيل الأقسام
  getAllDepartmentDetails(): Observable<DepartmentDetail[]> {
    return this.http.get<{data: DepartmentDetail[]}>(`${this.apiUrl}departmentdetails/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب أعضاء الأقسام
  getAllDepartmentMembers(): Observable<DepartmentMember[]> {
    return this.http.get<{data: DepartmentMember[]}>(`${this.apiUrl}departmentmembers/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب برامج الأقسام
  getAllDepartmentPrograms(): Observable<DepartmentProgram[]> {
    return this.http.get<{data: DepartmentProgram[]}>(`${this.apiUrl}departmentprograms/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب خدمات الأقسام
  getAllDepartmentServices(): Observable<DepartmentService[]> {
    return this.http.get<{data: DepartmentService[]}>(`${this.apiUrl}departmentservices/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب قسم واحد بالـ id (قديمة)
  getDepartmentById(id: string): Observable<Department | undefined> {
    return this.getAllDepartments().pipe(
      map(departments => departments.find(d => d.id === id))
    );
  }

  // جلب قسم واحد بالـ slug (جديدة)
  getDepartmentBySlug(slug: string): Observable<Department | undefined> {
    return this.getAllDepartments().pipe(
      map(departments => departments.find(d => {
        // some departments may not have a slug from the API, so use the name as a fallback
        const effectiveSlug = slugify(d.slug || d.name || '');
        return effectiveSlug === slug;
      }))
    );
  }

  // جلب تفاصيل قسم واحد بالـ departmentId
  getDepartmentDetailsById(departmentId: string): Observable<DepartmentDetail | undefined> {
    return this.getAllDepartmentDetails().pipe(
      map(details => details.find(d => d.departmentId === departmentId))
    );
  }

  // جلب أعضاء قسم واحد بالـ departmentId
  getDepartmentMembersById(departmentId: string): Observable<DepartmentMember[]> {
    return this.getAllDepartmentMembers().pipe(
      map(members => members.filter(m => m.departmentId === departmentId))
    );
  }

  // جلب برامج قسم واحد بالـ departmentId
  getDepartmentProgramsById(departmentId: string): Observable<DepartmentProgram[]> {
    return this.getAllDepartmentPrograms().pipe(
      map(programs => programs.filter(p => p.departmentId === departmentId))
    );
  }

  // جلب خدمات قسم واحد بالـ departmentId
  getDepartmentServicesById(departmentId: string): Observable<DepartmentService[]> {
    return this.getAllDepartmentServices().pipe(
      map(services => services.filter(s => s.departmentId === departmentId))
    );
  }
  // جلب الأقسام حسب النوع (أكاديمية أو كلينيكية)
getDepartmentsByType(type: 'AcademicDepartments' | 'ClinicalDepartments'): Observable<Department[]> {
  return this.getAllDepartments().pipe(
    map(departments => departments.filter(d => d.departmentType === type))
  );
}

}
