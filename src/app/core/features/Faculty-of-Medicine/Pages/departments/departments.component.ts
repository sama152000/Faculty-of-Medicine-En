import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DepartmentsService } from '../../Services/departments.service';
import { Department, DepartmentDetail, DepartmentProgram, DepartmentService, DepartmentMember } from '../../model/department.model';
import { slugify } from '../../../../../utils/slugify';
import { CleanHtmlPipe } from '../../../../pipes/clean-html.pipe'; // ✅ استدعاء الـ Pipe


@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, RouterModule, CleanHtmlPipe],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
  department?: Department;
  departmentDetail?: DepartmentDetail;
  departmentPrograms: DepartmentProgram[] = [];
  departmentServices: DepartmentService[] = [];
  departmentMembers: DepartmentMember[] = [];

  activeTab = 'about';
  activeAboutSection = 'overview';
  selectedProgram?: DepartmentProgram;
  selectedService?: DepartmentService;

  constructor(
    private route: ActivatedRoute,
    private departmentsService: DepartmentsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug']; // slug بدل id
      if (slug) {
        this.loadDepartmentData(slug);
      }
    });
  }

  private loadDepartmentData(slug: string): void {
    // Reset all data before loading new department
    this.department = undefined;
    this.departmentDetail = undefined;
    this.departmentPrograms = [];
    this.departmentServices = [];
    this.departmentMembers = [];
    this.selectedProgram = undefined;
    this.selectedService = undefined;
    
    // بيانات القسم الأساسية بالـ slug
    this.departmentsService.getDepartmentBySlug(slug).subscribe(department => {
      if (department) {
        this.department = department;

        const departmentId = department.id; // نستخدم الـ id الداخلي لجلب باقي التفاصيل

        // تفاصيل القسم
        this.departmentsService.getDepartmentDetailsById(departmentId).subscribe(detail => {
          this.departmentDetail = detail;
        });

        // برامج القسم
        this.departmentsService.getDepartmentProgramsById(departmentId).subscribe(programs => {
          this.departmentPrograms = programs;
          if (this.departmentPrograms.length > 0) {
            this.selectedProgram = this.departmentPrograms[0];
          }
        });

        // خدمات القسم
        this.departmentsService.getDepartmentServicesById(departmentId).subscribe(services => {
          this.departmentServices = services;
          if (this.departmentServices.length > 0) {
            this.selectedService = this.departmentServices[0];
          }
        });

        // أعضاء القسم
        this.departmentsService.getDepartmentMembersById(departmentId).subscribe(members => {
          this.departmentMembers = members;
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

  selectProgram(program: DepartmentProgram): void {
    this.selectedProgram = program;
  }

  selectService(service: DepartmentService): void {
    this.selectedService = service;
  }
}
