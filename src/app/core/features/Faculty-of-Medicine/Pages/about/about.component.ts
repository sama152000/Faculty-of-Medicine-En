import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutService } from '../../Services/about.service';
import { AboutUniversity, Member } from '../../model/about.model';
import { CustomPageService } from '../../Services/custom-page.service';
import { CustomPage } from '../../model/custom-page.model';
import { CleanHtmlPipe } from '../../../../pipes/clean-html.pipe';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  about?: AboutUniversity;
  president?: Member;
  members: Member[] = [];
  paginatedMembers: Member[] = [];

  // ✅ الصفحات المخصصة حسب النوع
  decisionsPages: CustomPage[] = [];

  activeTab: string = 'about';
  activeAboutSection: string = 'overview';

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  constructor(
    private aboutService: AboutService,
    private customPageService: CustomPageService
  ) {}

  ngOnInit(): void {
    this.loadAboutData();
    this.loadDecisionsPages();
  }

  private loadAboutData(): void {
    // بيانات عن الكلية
    this.aboutService.getAboutUniversity().subscribe(aboutList => {
      this.about = aboutList[0];
    });

    // عميد الكلية
    this.aboutService.getPresident().subscribe(president => {
      this.president = president;
    });

    // باقي أعضاء الكلية
    this.aboutService.getAllMembers().subscribe(allMembers => {
      this.members = allMembers.filter(m => !m.isPresident);
      this.updatePagination();
    });
  }

  // ✅ جلب الصفحات حسب النوع (مثلاً AboutUniversity)
  private loadDecisionsPages(): void {
    this.customPageService.getByPageType('AboutUniversity').subscribe(pages => {
      this.decisionsPages = pages;
    });
  }

  switchTab(tabName: string): void {
    this.activeTab = tabName;
  }

  switchAboutSection(sectionName: string): void {
    this.activeAboutSection = sectionName;
  }

  // Pagination methods
  private updatePagination(): void {
    this.totalPages = Math.ceil(this.members.length / this.itemsPerPage);
    if (this.totalPages < 1) this.totalPages = 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    if (this.currentPage < 1) this.currentPage = 1;
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMembers = this.members.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
