import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CentersService } from '../../Services/centers.service';
import { Center, CenterDetail, CenterMember } from '../../model/center.model';
import { CleanHtmlPipe } from '../../../../pipes/clean-html.pipe'; // ✅ استدعاء الـ Pipe


@Component({
  selector: 'app-centers',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe],
  templateUrl: './centers.component.html',
  styleUrls: ['./centers.component.css']
})
export class CentersComponent implements OnInit {
  center?: Center;
  centerDetail?: CenterDetail;
  centerMembers: CenterMember[] = [];

  activeTab = 'about';
  activeAboutSection = 'overview';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private centersService: CentersService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug']; // نقرأ الـ slug بدل الـ id
      if (slug) {
        this.loadCenterData(slug);
      }
    });
  }

  private loadCenterData(slug: string): void {
    // بيانات المركز الأساسية بالـ slug
    this.centersService.getBySlug(slug).subscribe(center => {
      if (center) {
        this.center = center;

        const centerId = center.id; // نستخدم الـ id الداخلي لجلب باقي التفاصيل

        // تفاصيل المركز
        this.centersService.getDetailsByCenterId(centerId).subscribe(detail => {
          this.centerDetail = detail;
        });

        // أعضاء المركز
        this.centersService.getMembersByCenterId(centerId).subscribe(members => {
          this.centerMembers = members;
        });
      }
    });
  }

  switchTab(tabName: string): void {
    this.activeTab = tabName;
  }

  switchAboutSection(sectionName: string): void {
    this.activeAboutSection = sectionName;
  }
}
