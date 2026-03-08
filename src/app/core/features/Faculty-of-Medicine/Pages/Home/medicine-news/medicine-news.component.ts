import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NewsService } from '../../../Services/news.service';
import { News } from '../../../model/news.model';
import { slugify } from '../../../../../../utils/slugify';

@Component({
  selector: 'app-medicine-news',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medicine-news.component.html',
  styleUrls: ['./medicine-news.component.css']
})
export class MedicineNewsComponent implements OnInit {
  @Input() showTitle = true;
  @Input() sectionTitle = 'Latest News';   // ✅ ترجمة العنوان
  @Input() itemsPerView = 6;
  @Input() isRTL = false;                  // ✅ في النسخة الإنجليزية نخلي الاتجاه LTR

  newsItems: News[] = [];
  visibleItems: News[] = [];

  constructor(private newsService: NewsService, private router: Router) {}

  ngOnInit(): void {
    this.loadNews();
  }

  trackByFn(index: number, item: News): any {
    return item.id;
  }

  private loadNews(): void {
    this.newsService.getLatestNews(this.itemsPerView).subscribe(news => {
      this.newsItems = news;
      this.visibleItems = this.newsItems;
    });
  }

  getDateParts(dateString: string): { day: string; month: string } {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString(),
      month: date.toLocaleString('en-US', { month: 'short' }) // ✅ ترجمة الشهر للإنجليزي
    };
  }

  goToNewsDetails(news: News): void {
    // ✅ التوجيه بالـ slug بدل الـ id
    this.router.navigate(['/news', slugify(news.title)]);
  }
}
