import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Category } from '../model/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // جلب كل التصنيفات
  getAllCategories(): Observable<Category[]> {
    return this.http.get<{ data: Category[] }>(`${this.apiUrl}categories/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب تصنيف واحد بالـ id
  getCategoryById(id: string): Observable<Category | undefined> {
    return this.getAllCategories().pipe(
      map(categories => categories.find(c => c.id === id))
    );
  }

  // جلب تصنيف واحد بالاسم
  getCategoryByName(name: string): Observable<Category | undefined> {
    return this.getAllCategories().pipe(
      map(categories => categories.find(c => c.name === name))
    );
  }
}
