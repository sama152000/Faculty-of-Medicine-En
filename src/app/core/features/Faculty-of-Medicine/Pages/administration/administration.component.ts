import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AdministrationService } from '../../Services/administration.service';
import { Management, ManagementDetail, ManagementMember } from '../../model/administration.model';
import { CleanHtmlPipe } from '../../../../pipes/clean-html.pipe';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe],
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {
  management?: Management;
  managementDetail?: ManagementDetail;
  managementMembers: ManagementMember[] = [];

  activeTab = 'about';
  activeAboutSection = 'overview';

  constructor(
    private route: ActivatedRoute,
    private administrationService: AdministrationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadManagementData(slug);
      }
    });
  }

  private loadManagementData(slug: string): void {
    this.activeTab = 'about';
    this.activeAboutSection = 'overview';

    this.administrationService.getManagementBySlug(slug).subscribe(management => {
      console.log('[Administration] slug from URL:', slug, '| matched:', management?.slug);
      if (management) {
        this.management = management;

        // تفاصيل الإدارة
        this.administrationService.getManagementDetailsByManagementId(management.id).subscribe(detail => {
          this.managementDetail = detail;
        });

        // أعضاء الإدارة
        this.administrationService.getManagementMembersByManagementId(management.id).subscribe(members => {
          this.managementMembers = members;
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
