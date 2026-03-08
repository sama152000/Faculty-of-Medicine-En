import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ FormsModule عشان ngModel
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NewsService } from '../../Services/news.service';
import { CategoriesService } from '../../Services/categories.service';
import { News } from '../../model/news.model';
import { Category } from '../../model/category.model';
import { slugify } from '../../../../../utils/slugify';
import { CleanHtmlPipe } from '../../../../pipes/clean-html.pipe';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe, FormsModule],
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {
  allNews: News[] = [];
  filteredNews: News[] = [];
  paginatedNews: News[] = [];
  categories: Category[] = [];   // ✅ التصنيفات من الـ API

  activeFilter = 'all';
  searchTerm: string = '';       // ✅ متغير البحث
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  constructor(
    private newsService: NewsService,
    private categoriesService: CategoriesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const filter = params['filter'];
      if (filter) {
        this.activeFilter = filter;
      }
      this.loadNews();
      this.loadCategories(); // ✅ تحميل التصنيفات
    });
  }

  private loadNews(): void {
    this.newsService.getAllNews().subscribe(news => {
      this.allNews = news;
      this.applyFilter();
    });
  }

  private loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  filterNews(filter: string): void {
    this.activeFilter = filter;
    this.currentPage = 1;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.activeFilter === 'all') {
      this.filteredNews = [...this.allNews];
    } else {
      this.filteredNews = this.allNews.filter(n =>
        n.postCategories.some(c => c.categoryName === this.activeFilter)
      );
    }
    this.applySearch(); // ✅ بعد الفلترة طبق البحث
    this.calculatePagination();
  }

  applySearch(): void {
    // Start from allNews and apply filter first, then search
    let result = [...this.allNews];
    
    // Apply category filter
    if (this.activeFilter !== 'all') {
      result = result.filter(n =>
        n.postCategories.some(c => c.categoryName === this.activeFilter)
      );
    }
    
    // Apply search filter
    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(n =>
        n.title.toLowerCase().includes(term) ||
        n.content.toLowerCase().includes(term)
      );
    }
    
    this.filteredNews = result;
    this.calculatePagination();
  }

  private calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredNews.length / this.itemsPerPage);
    this.updatePaginatedNews();
  }

  private updatePaginatedNews(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedNews = this.filteredNews.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedNews();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getCategoryBadgeClass(categoryName: string): string {
    if (categoryName === 'الأخبار') return 'badge-primary';
    if (categoryName.includes('مؤتمرات')) return 'badge-success';
    if (categoryName.includes('فعاليات') || categoryName.includes('احداث')) return 'badge-warning';
    return 'badge-secondary';
  }

  goToNewsDetails(news: News): void {
    this.router.navigate(['/news', slugify(news.title)]);
  }
}
