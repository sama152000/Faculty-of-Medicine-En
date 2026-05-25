import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of, forkJoin as rxForkJoin } from 'rxjs';
import { ContactService } from '../../../Services/contact.service';
import { NewsService } from '../../../Services/news.service';
import { LogoService } from '../../../Services/logo.service';
import { FooterService } from '../../../Services/footer.service';
import { DepartmentsService } from '../../../Services/departments.service';
import { CentersService } from '../../../Services/centers.service';
import { ServiceService } from '../../../Services/service.service';
import { VisitorsService } from '../../../Services/visitors.service';
import { Contact } from '../../../model/contact.model';
import { News } from '../../../model/news.model';
import { Logo } from '../../../model/logo.model';
import { Footer, QuickLink, SocialLink } from '../../../model/footer.model';
import { slugify } from '../../../../../../utils/slugify';

@Component({
  selector: 'app-medicine-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medicine-footer.component.html',
  styleUrls: ['./medicine-footer.component.css']
})
export class MedicineFooterComponent implements OnInit {
  contact?: Contact;
  logoUrl?: string;
  footer?: Footer;
  quickLinks: QuickLink[] = this.getDefaultQuickLinks();
  socialLinks: SocialLink[] = [];
  latestPosts: { slug: string; title: string; date: string; url: string }[] = [];

  // Visitors stats
  totalViews: number | null = null;
  monthViews: number | null = null;
  todayViews: number | null = null;
  visitorsLoading = true;

  constructor(
    private contactService: ContactService,
    private newsService: NewsService,
    private logoService: LogoService,
    private footerService: FooterService,
    private departmentsService: DepartmentsService,
    private centersService: CentersService,
    private serviceService: ServiceService,
    private visitorsService: VisitorsService
  ) {}

  ngOnInit(): void {
    this.loadContactInfo();
    this.loadLatestPosts();
    this.loadLogo();
    this.updateDepartmentLink();
    this.updateCentersLink();
    this.updateServicesLink();
    this.loadVisitorsStats();
  }

  trackByFn(index: number, item: any): any {
    return item.id;
  }

  private loadContactInfo(): void {
    this.contactService.getAllContacts().subscribe(contacts => {
      if (contacts && contacts.length > 0) {
        this.contact = contacts[0];
      }
    });
  }

  private loadLatestPosts(): void {
    this.newsService.getAllNews().pipe(
      map(news => news
        .sort((a, b) => {
          const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
          const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 2)
      )
    ).subscribe((news: News[]) => {
      this.latestPosts = news.map(item => ({
        slug: slugify(item.title),
        title: item.title,
        date: item.publishedDate || '',
        url: `/news/${slugify(item.title)}`
      }));
    });
  }

  private loadFooter(): void {
    this.footerService.getFooter().pipe(
      catchError(() => of(null))
    ).subscribe(footer => {
      if (footer) {
        this.footer = footer;
        this.quickLinks = footer.quickLinks && footer.quickLinks.length > 0 ? footer.quickLinks : this.getDefaultQuickLinks();
        this.socialLinks = footer.socialLinks || [];
      }
    });
  }

  private updateDepartmentLink(): void {
    this.departmentsService.getAllDepartments().subscribe(departments => {
      if (departments && departments.length > 0) {
        const firstDepartment = departments[0];
        const departmentLink = this.quickLinks.find(link => link.id === '2');
        if (departmentLink) {
          departmentLink.url = `/departments/${slugify(firstDepartment.name)}`;
        }
      }
    });
  }

  private updateCentersLink(): void {
    this.centersService.getAllCenters().subscribe(centers => {
      if (centers && centers.length > 0) {
        const firstCenter = centers[0];
        const centerLink = this.quickLinks.find(link => link.id === '3');
        if (centerLink) {
          centerLink.url = `/centers/${slugify(firstCenter.centerName)}`;
        }
      }
    });
  }

  private updateServicesLink(): void {
    this.serviceService.getAll().subscribe(services => {
      if (services && services.length > 0) {
        const firstService = services[0];
        const serviceLink = this.quickLinks.find(link => link.id === '4');
        if (serviceLink) {
          serviceLink.url = `/services/${slugify(firstService.title)}`;
        }
      }
    });
  }

  private getDefaultQuickLinks(): QuickLink[] {
    return [
      { id: '1', text: 'About the Faculty', url: '/about', icon: '→' },
      // { id: '2', text: 'الأقسام الأكاديمية', url: '/departments', icon: '→' },
      // { id: '3', text: 'المراكز', url: '/centers', icon: '→' },
      { id: '4', text: 'Services', url: '/services', icon: '→' },
      { id: '5', text: 'Contact Us', url: '/contact', icon: '→' }
    ];
  }

  private loadLogo(): void {
    this.logoService.getDefaultLogo().subscribe((logo: Logo | undefined) => {
      if (logo) {
        this.logoUrl = logo.url;
      }
    });
  }

  onLinkClick(type: string, data: any): void {
    console.log(`Footer link clicked - Type: ${type}`, data);
  }

  private loadVisitorsStats(): void {
    this.visitorsLoading = true;
    rxForkJoin({
      total: this.visitorsService.getTotalViews().pipe(catchError(() => of({ totalViews: 0 }))),
      month: this.visitorsService.getMonthViews().pipe(catchError(() => of({ monthViews: 0 }))),
      today: this.visitorsService.getTodayViews().pipe(catchError(() => of({ todayViews: 0 })))
    }).subscribe({
      next: ({ total, month, today }) => {
        this.totalViews = total.totalViews;
        this.monthViews = month.monthViews;
        this.todayViews = today.todayViews;
        this.visitorsLoading = false;
      },
      error: () => {
        this.visitorsLoading = false;
      }
    });
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
