import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../../Services/news.service';
import { News } from '../../../model/news.model';
import { CleanHtmlPipe } from '../../../../../pipes/clean-html.pipe';

@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe],
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.css']
})
export class NewsDetailsComponent implements OnInit {
  news?: News;
  relatedNews: News[] = [];
  previousNews?: News;
  nextNews?: News;
  newsNotFound = false;
  isLoading = true;
  currentSlideIndex = 0;
  /** All slide URLs: featuredImagePath first, then postAttachments (deduped) */
  sliderImages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadNewsDetails(id);
      }
    });
  }

  private loadNewsDetails(id: string): void {
    this.isLoading = true;
    this.newsNotFound = false;

    this.newsService.getNewsById(id).subscribe({
      next: news => {
        this.news = news;
        this.currentSlideIndex = 0;
        this.buildSliderImages(news);
        this.isLoading = false;
        this.loadRelatedData(news.id);
      },
      error: () => {
        this.newsNotFound = true;
        this.isLoading = false;
      }
    });
  }

  private loadRelatedData(newsId: string): void {
    this.newsService.getAllNews().subscribe(allNews => {
      // أخبار ذات صلة بنفس التصنيف
      if (this.news?.postCategories?.length) {
        const categoryId = this.news.postCategories[0].categoryId;
        this.relatedNews = allNews
          .filter(
            n =>
              n.id !== newsId &&
              n.postCategories.some(c => c.categoryId === categoryId)
          )
          .slice(0, 5);
      }

      // ترتيب الأخبار حسب التاريخ للتنقل بين الأخبار
      const sorted = [...allNews].sort(
        (a, b) =>
          new Date(a.publishedDate ?? a.createdDate).getTime() -
          new Date(b.publishedDate ?? b.createdDate).getTime()
      );
      const index = sorted.findIndex(n => n.id === newsId);

      this.previousNews = index > 0 ? sorted[index - 1] : undefined;
      this.nextNews = index < sorted.length - 1 ? sorted[index + 1] : undefined;
    });
  }

  getCategoryBadgeClass(categoryName: string): string {
    if (categoryName === 'News') return 'badge-primary';
    if (categoryName.includes('Conferences')) return 'badge-success';
    if (categoryName.includes('Events') || categoryName.includes('Activities')) return 'badge-warning';
    return 'badge-secondary';
  }

  goToNewsDetails(news: News): void {
    this.router.navigate(['/news', news.id]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  goToNewsList(): void {
    this.router.navigate(['/news']);
  }

  // Slider helpers
  private buildSliderImages(news: News): void {
    const attachmentUrls = (news.postAttachments ?? []).map(a => a.url);
    if (news.featuredImagePath) {
      // Prepend featuredImagePath only if it's not already in attachments
      const alreadyIncluded = attachmentUrls.some(
        url => url === news.featuredImagePath
      );
      this.sliderImages = alreadyIncluded
        ? attachmentUrls
        : [news.featuredImagePath, ...attachmentUrls];
    } else {
      this.sliderImages = attachmentUrls;
    }
  }

  prevSlide(): void {
    if (!this.sliderImages.length) return;
    this.currentSlideIndex =
      (this.currentSlideIndex - 1 + this.sliderImages.length) %
      this.sliderImages.length;
  }

  nextSlide(): void {
    if (!this.sliderImages.length) return;
    this.currentSlideIndex =
      (this.currentSlideIndex + 1) % this.sliderImages.length;
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }
}
