import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProgramsService } from '../../Services/programs.service';
import { Program, ProgramDetail, ProgramMember } from '../../model/program.model';
import { CleanHtmlPipe } from '../../../../pipes/clean-html.pipe'; // ✅ استدعاء الـ Pipe


@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe], // ✅ أضفنا الـ Pipe هنا
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit {
  program?: Program;
  programDetail?: ProgramDetail;
  programMembers: ProgramMember[] = [];

  activeTab = 'about';
  activeAboutSection = 'overview';

  constructor(
    private route: ActivatedRoute,
    private programsService: ProgramsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug']; // نقرأ الـ slug بدل الـ id
      if (slug) {
        this.loadProgramData(slug);
      }
    });
  }

  private loadProgramData(slug: string): void {
    // بيانات البرنامج الأساسية بالـ slug
    this.programsService.getProgramBySlug(slug).subscribe(program => {
      if (program) {
        this.program = program;

        const programId = program.id; // نستخدم الـ id الداخلي لجلب باقي التفاصيل

        // تفاصيل البرنامج
        this.programsService.getProgramDetailsByProgramId(programId).subscribe(detail => {
          this.programDetail = detail;
        });

        // أعضاء البرنامج
        this.programsService.getProgramMembersByProgramId(programId).subscribe(members => {
          this.programMembers = members;
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
