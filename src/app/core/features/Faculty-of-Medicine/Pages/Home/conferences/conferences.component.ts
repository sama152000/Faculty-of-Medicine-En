import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NewsService } from '../../../Services/news.service';
import { News } from '../../../model/news.model';
import { slugify } from '../../../../../../utils/slugify';

@Component({
  selector: 'app-conference-upcoming',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    // ✅ ترجمة الفئة من "مؤتمرات" → "Conferences"
    this.newsService.getLatestNewsByCategory('Conferences', 3).subscribe(conferences => {
      this.conferences = conferences;
    });
  }

  goToConferenceDetails(conference: News): void {
    // ✅ التوجيه بالـ slug بدل الـ id
    this.router.navigate(['/news', slugify(conference.title)]);
  }

  goToNewsPage(): void {
    // ✅ تعديل الفلتر للإنجليزي
    this.router.navigate(['/news'], { queryParams: { filter: 'Conferences' } });
  }
}
