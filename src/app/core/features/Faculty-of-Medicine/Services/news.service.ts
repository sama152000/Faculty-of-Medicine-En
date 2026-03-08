import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { News } from '../model/news.model';
import { Category } from '../model/category.model'; 
import { slugify } from '../../../../utils/slugify';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // جلب كل الأخبار
  getAllNews(): Observable<News[]> {
    return this.http.get<{data: News[]}>(`${this.apiUrl}posts/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب آخر N أخبار مرتبة حسب التاريخ
  getLatestNews(count: number = 6): Observable<News[]> {
    return this.getAllNews().pipe(
      map(news => 
        [...news]
          .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
          .slice(0, count)
      )
    );
  }

  // جلب خبر واحد بالـ id
  getNewsById(id: string): Observable<News | undefined> {
    return this.getAllNews().pipe(
      map(news => news.find(n => n.id === id))
    );
  }

  // جلب خبر واحد بالـ slug
  getNewsBySlug(slug: string): Observable<News | undefined> {
    return this.getAllNews().pipe(
      map(news => news.find(n => slugify(n.title) === slug))
    );
  }

  // فلترة الأخبار حسب التصنيف
  getNewsByCategory(categoryName: string): Observable<News[]> {
    return this.getAllNews().pipe(
      map(news => news.filter(n =>
        n.postCategories.some(c => c.categoryName === categoryName)
      ))
    );
  }

  // جلب آخر N أخبار حسب التصنيف مرتبة حسب التاريخ
  getLatestNewsByCategory(categoryName: string, count: number = 3): Observable<News[]> {
    return this.getAllNews().pipe(
      map(news => 
        [...news]
          .filter(n => n.postCategories.some(c => c.categoryName.includes(categoryName)))
          .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
          .slice(0, count)
      )
    );
  }

  // ✅ جلب كل التصنيفات من الـ API الجديد
  getAllCategories(): Observable<Category[]> {
    return this.http.get<{data: Category[]}>(`${this.apiUrl}categories/getall`).pipe(
      map(response => response.data)
    );
  }
}
