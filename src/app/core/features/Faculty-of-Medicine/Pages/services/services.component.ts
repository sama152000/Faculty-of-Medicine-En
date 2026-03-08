import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceDetail } from '../../model/service.model';
import { ServiceService } from '../../Services/service.service';
import { CleanHtmlPipe } from '../../../../pipes/clean-html.pipe';
import { SafeHtmlPipe } from '../../../../pipes/safe-html.pipe';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe, SafeHtmlPipe],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ServicesComponent implements OnInit {
  service?: ServiceDetail;
  services: ServiceDetail[] = [];
  isListView: boolean = false;
  activeTab: string = 'departments';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.isListView = false;
        this.loadServiceData(slug);
      } else {
        this.isListView = true;
        this.loadServices();
      }
    });
  }

  private loadServiceData(slug: string): void {
    this.serviceService.getBySlug(slug).subscribe({
      next: (serviceDetail) => {
        this.service = serviceDetail;
      },
      error: (error) => {
        console.error('Error loading service:', error);
        this.service = undefined;
      }
    });
  }

  private loadServices(): void {
    this.serviceService.getAll().subscribe({
      next: (services) => {
        this.services = services.filter(s => s.isActive);
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.services = [];
      }
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  trackByFn(index: number, item: ServiceDetail): any {
    return item.id;
  }

  // onServiceClick(service: ServiceDetail): void {
  //   if (service) {
  //     // navigate using slug if available, otherwise slugify title
  //     const slug = slugify(service.slug || service.title || '');
  //     this.router.navigate(['/services', slug]);
  //   }
  // }
}
