import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { SectorsService } from '../../Services/sector.service';
import { NewsService } from '../../Services/news.service';
import { Sector, SectorDetail, SectorMember, SectorProgram, SectorService, SectorPost, SectorUnit } from '../../model/sector.model';
import { News } from '../../model/news.model';
 import { slugify } from '../../../../../../../src/app/utils/slugify';
  import { CleanHtmlPipe } from '../../../../pipes/clean-html.pipe'; // ✅ استدعاء الـ Pipe


@Component({
  selector: 'app-sectors',
  standalone: true,
  imports: [CommonModule, RouterModule, CleanHtmlPipe],
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.css']
})
export class SectorsComponent implements OnInit {
  sector?: Sector;
  sectorDetail?: SectorDetail;
  sectorMembers: SectorMember[] = [];
  sectorPrograms: SectorProgram[] = [];
  sectorServices: SectorService[] = [];
  sectorPosts: News[] = [];
sectorUnits: SectorUnit[] = [];
  activeTab = 'about';
  activeAboutSection = 'overview';
  selectedProgram?: SectorProgram;
  selectedService?: SectorService;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sectorsService: SectorsService,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug']; // نقرأ الـ slug بدل الـ id
      if (slug) {
        this.loadSectorData(slug);
      }
    });
  }

  private loadSectorData(slug: string): void {
    // بيانات القطاع الأساسية بالـ slug
    this.sectorsService.getSectorBySlug(slug).subscribe(sector => {
      if (sector) {
        this.sector = sector;

        const sectorId = sector.id; // نستخدم الـ id الداخلي لجلب باقي التفاصيل

        // تفاصيل القطاع
        this.sectorsService.getSectorDetailsById(sectorId).subscribe(detail => {
          this.sectorDetail = detail;
        });

        // أعضاء القطاع
        this.sectorsService.getSectorMembersById(sectorId).subscribe(members => {
          this.sectorMembers = members;
        });

        // برامج القطاع
        this.sectorsService.getSectorProgramsById(sectorId).subscribe(programs => {
          this.sectorPrograms = programs;
          if (this.sectorPrograms.length > 0) {
            this.selectedProgram = this.sectorPrograms[0];
          }
        });

        // خدمات القطاع
        this.sectorsService.getSectorServicesById(sectorId).subscribe(services => {
          this.sectorServices = services;
          if (this.sectorServices.length > 0) {
            this.selectedService = this.sectorServices[0];
          }
        });

        // منشورات القطاع
        this.sectorsService.getSectorPostsById(sectorId).subscribe(sectorPosts => {
          const postIds = sectorPosts.map(p => p.postId);
          this.newsService.getAllNews().subscribe(allNews => {
            this.sectorPosts = allNews.filter(n => postIds.includes(n.id));
          });
        });

        this.sectorsService.getSectorUnitsById(sectorId).subscribe(units => {
  this.sectorUnits = units;
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

  selectProgram(program: SectorProgram): void {
    this.selectedProgram = program;
  }

  selectService(service: SectorService): void {
    this.selectedService = service;
  }


goToPostDetails(post: News): void {
  this.router.navigate(['/news', slugify(post.title)]).then(() => {
    window.scrollTo(0, 0);
  });
}

goToProgramDetails(program: SectorProgram): void {
  this.router.navigate(['/programs',slugify(program.slug)]).then(() => {
    window.scrollTo(0, 0);
  });
}

goTounitDetails(unit: SectorUnit): void {
  this.router.navigate(['/units', slugify(unit.slug)]).then(() => {
    window.scrollTo(0, 0);
  });
}
}
