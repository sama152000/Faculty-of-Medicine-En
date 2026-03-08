import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Program, ProgramDetail, ProgramMember } from '../model/program.model';
import { slugify } from '../../../../utils/slugify';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // جلب كل البرامج
  getAllPrograms(): Observable<Program[]> {
    return this.http.get<{data: Program[]}>(`${this.apiUrl}program/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب تفاصيل البرامج
  getAllProgramDetails(): Observable<ProgramDetail[]> {
    return this.http.get<{data: ProgramDetail[]}>(`${this.apiUrl}programdetail/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب أعضاء البرامج
  getAllProgramMembers(): Observable<ProgramMember[]> {
    return this.http.get<{data: ProgramMember[]}>(`${this.apiUrl}programmember/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب برنامج واحد بالـ id (قديمة)
  getProgramById(id: string): Observable<Program | undefined> {
    return this.getAllPrograms().pipe(
      map(programs => programs.find(p => p.id === id))
    );
  }

  // جلب برنامج واحد بالـ slug (جديدة)
  getProgramBySlug(slug: string): Observable<Program | undefined> {
    return this.getAllPrograms().pipe(
      map(programs => programs.find(p => {
        // some items might not have a slug; fall back to pageTitle if available
        const effectiveSlug = slugify(p.slug || p.pageTitle || '');
        return effectiveSlug === slug;
      }))
    );
  }

  // جلب تفاصيل برنامج واحد بالـ programId
  getProgramDetailsByProgramId(programId: string): Observable<ProgramDetail | undefined> {
    return this.getAllProgramDetails().pipe(
      map(details => details.find(d => d.programId === programId))
    );
  }

  // جلب أعضاء برنامج واحد بالـ programId
  getProgramMembersByProgramId(programId: string): Observable<ProgramMember[]> {
    return this.getAllProgramMembers().pipe(
      map(members => members.filter(m => m.programId === programId))
    );
  }
}
