import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NewsService } from '../../../Services/news.service';
import { News } from '../../../model/news.model';
import { CleanHtmlPipe } from '../../../../../pipes/clean-html.pipe';

@Component({
  selector: 'app-conference-upcoming',
  standalone: true,
  imports: [CommonModule, RouterModule, CleanHtmlPipe],
  templateUrl: './conferences.component.html',
  styleUrls: ['./conferences.component.css']
})
export class ConferenceUpcomingComponent implements OnInit {
  @Input() sectionTitle = 'Upcoming Conferences'; // ✅ ترجمة العنوان

  conferences: News[] = [];

  constructor(private newsService: NewsService, private router: Router) {}

  ngOnInit(): void {
    this.loadUpcomingConferences();
  }

  private loadUpcomingConferences(): void {
    // جلب الأخبار المصنفة كـ "مؤتمرات وفعاليات" من الـ API
    this.newsService.getPagedNews(1, 3, { categoryName: ' Conferences' }).subscribe(result => {
      // إذا لم يرجع الفلتر نتائج، نجلب آخر الأخبار ونفلترها محلياً
      if (result.items.length > 0) {
        this.conferences = result.items;
      } else {
        this.newsService.getAllNews().subscribe((allNews: News[]) => {
          this.conferences = allNews
            .filter(n =>
              n.postCategories.some(c =>
                c.categoryName.includes('Conferences') || c.categoryName.includes('Events')
              )
            )
            .slice(0, 3);
        });
      }
    });
  }

  goToConferenceDetails(conference: News): void {
    this.router.navigate(['/news', conference.id]);
  }

  goToNewsPage(): void {
    this.router.navigate(['/news'], { queryParams: { filter: 'Conferences' } });
  }
}
