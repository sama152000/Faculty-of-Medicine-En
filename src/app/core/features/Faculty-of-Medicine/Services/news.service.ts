import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { News, PostCategory } from '../model/news.model';
import { Category } from '../model/category.model';
import { environment } from '../../../../../environments/environment';
import { slugify } from '../../../../utils/slugify';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private baseUrl = environment.apiUrl + 'posts';
  private categoriesUrl = environment.apiUrl + 'categories';

  constructor(private http: HttpClient) {}

  /**
   * جلب الأخبار بالـ pagination مع فلترة
   *
   * Response shape from backend:
   * { success, data: News[], message, statusCode, ... }
   * (flat array — no items/totalCount wrapper)
   */
  getPagedNews(
    pageNumber: number,
    pageSize: number,
    filter: any = {}
  ): Observable<{ items: News[]; totalCount: number }> {
    const body: any = {
      pageNumber,
      pageSize,
      filter,
      orderByValue: [{ colId: 'publishedDate', sort: 'desc' }]
    };

    return this.http.post<any>(`${this.baseUrl}/getpaged`, body).pipe(
      map(response => {
        const raw: any[] = Array.isArray(response.data)
          ? response.data
          : response.data?.items ?? [];

        const items: News[] = raw.map((post: any) => ({
          ...post,
          // تصحيح الـ double slash في روابط الصور
          featuredImagePath: this.fixUrl(post.featuredImagePath),
          postAttachments: (post.postAttachments ?? []).map((a: any) => ({
            ...a,
            url: this.fixUrl(a.url)
          })),
          slug: slugify(post.urlTitleEn || post.title)
        }));

        const totalCount: number =
          response.totalCount ??
          response.data?.totalCount ??
          items.length;

        return { items, totalCount };
      })
    );
  }

  /** جلب كل التصنيفات */
  getCategories(): Observable<Category[]> {
    return this.http
      .get<{ success: boolean; data: Category[] }>(`${this.categoriesUrl}/getall`)
      .pipe(map(response => response.data));
  }

  /**
   * جلب خبر واحد بالـ id مباشرةً من الـ API
   */
  getNewsById(id: string): Observable<News> {
    return this.http
      .get<{ success: boolean; data: News }>(`${this.baseUrl}/get/${id}`)
      .pipe(
        map(response => ({
          ...response.data,
          featuredImagePath: this.fixUrl(response.data.featuredImagePath),
          postAttachments: (response.data.postAttachments ?? []).map(a => ({
            ...a,
            url: this.fixUrl(a.url)
          })),
          slug: slugify(response.data.urlTitleEn || response.data.title)
        }))
      );
  }

  /**
   * جلب كل الأخبار (صفحة واحدة كبيرة) — للاستخدام الداخلي
   * (الأخبار المرتبطة، التنقل بين الأخبار)
   */
  getAllNews(): Observable<News[]> {
    return this.getPagedNews(1, 200).pipe(map(result => result.items));
  }

  /** الأخبار المرتبطة بنفس التصنيف */
  getRelatedNews(newsId: string, limit: number = 4): Observable<News[]> {
    return this.getAllNews().pipe(
      map(posts => {
        const current = posts.find((p: News) => p.id === newsId);
        if (!current) return [];
        const categoryIds = current.postCategories.map((c: PostCategory) => c.categoryId);
        return posts
          .filter(
            (p: News) =>
              p.id !== newsId &&
              p.postCategories.some((c: PostCategory) => categoryIds.includes(c.categoryId))
          )
          .slice(0, limit);
      })
    );
  }

  /** جلب آخر الأخبار للـ Home */
  getLatestNews(limit: number = 4): Observable<News[]> {
    return this.getPagedNews(1, limit, { status: 'Published' }).pipe(
      map(result =>
        result.items.sort(
          (a, b) =>
            new Date(b.publishedDate ?? b.createdDate).getTime() -
            new Date(a.publishedDate ?? a.createdDate).getTime()
        )
      )
    );
  }

  /** جلب آخر الأحداث (Events) */
  getLatestEvents(limit: number = 3): Observable<News[]> {
    return this.getCategories().pipe(
      map(categories =>
        categories.find(
          c =>
            c.name === 'فاعليات' ||
            c.name === 'احداث' ||
            c.name === 'الاحداث' ||
            c.name === 'Events'||
            c.name === 'Activities'||
            c.name === 'Activity'||
            c.name === 'Event'
        )
      ),
      switchMap(category => {
        const filter: any = { status: 'Published' };
        if (category) {
          filter.categoryId = category.id;
        }
        return this.getPagedNews(1, limit, filter);
      }),
      map(result =>
        result.items.sort(
          (a, b) =>
            new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        )
      )
    );
  }

  /**
   * تصحيح الـ double slash في روابط الصور
   * مثال: https://example.com//uploads/... → https://example.com/uploads/...
   */
  private fixUrl(url: string): string {
    if (!url) return url;
    return url.replace(/([^:])\/\/+/g, '$1/');
  }
}
