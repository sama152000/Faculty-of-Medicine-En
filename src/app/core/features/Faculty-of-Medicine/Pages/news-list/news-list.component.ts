import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NewsService } from '../../Services/news.service';
import { News } from '../../model/news.model';
import { slugify } from '../../../../../utils/slugify';
import { CleanHtmlPipe } from '../../../../pipes/clean-html.pipe'; // ✅ استدعاء الـ Pipe


@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe],
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {
  allNews: News[] = [];
  filteredNews: News[] = [];
  paginatedNews: News[] = [];
  
  activeFilter = 'all';
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  constructor(
    private newsService: NewsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const filter = params['filter'];
      if (filter && ['all', 'news', 'conferences', 'events'].includes(filter)) {
        this.activeFilter = filter;
      }
      this.loadNews();
    });
  }

  private loadNews(): void {
    this.newsService.getAllNews().subscribe(news => {
      this.allNews = news;
      this.applyFilter();
    });
  }

  filterNews(filter: string): void {
    this.activeFilter = filter;
    this.currentPage = 1;
    this.applyFilter();
  }

  private applyFilter(): void {
    switch (this.activeFilter) {
      case 'news':
        this.filteredNews = this.allNews.filter(n =>
          n.postCategories.some(c => c.categoryName === 'News')
        );
        break;
      case 'conferences':
        this.filteredNews = this.allNews.filter(n =>
          n.postCategories.some(c => c.categoryName.includes('Conferences'))
        );
        break;
      case 'events':
        this.filteredNews = this.allNews.filter(n =>
          n.postCategories.some(c => c.categoryName.includes('Events'))
        );
        break;
      default:
        this.filteredNews = [...this.allNews];
    }
    
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
    if (categoryName === 'News') return 'badge-primary';
    if (categoryName.includes('Conferences')) return 'badge-success';
    if (categoryName.includes('Events')) return 'badge-warning';
    return 'badge-secondary';
  }

  goToNewsDetails(news: News): void {
    // navigate using slug instead of id
    this.router.navigate(['/news', slugify(news.title)]);
  }
}
