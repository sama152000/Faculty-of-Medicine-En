import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DepartmentsService } from '../../../../Faculty-of-Medicine/Services/departments.service';
import { Department } from '../../../model/department.model';
import { slugify } from '../../../../../../utils/slugify';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
  @Input() sectionTitle = 'Departments';
  @Input() showAllServicesButton = true;
  @Input() allServicesText = 'All Departments';
  @Input() allServicesUrl = '/departments';
  
  @Output() departmentClicked = new EventEmitter<Department>();

  departments: Department[] = [];
  academicDepartments: Department[] = [];
  clinicalDepartments: Department[] = [];

  constructor(
    private departmentService: DepartmentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  trackByFn(index: number, item: Department): any {
    return item.id;
  }

  private loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe(departments => {
      this.departments = departments;

      // فلترة الأقسام حسب النوع
      this.academicDepartments = departments
        .filter(d => d.departmentType === 'AcademicDepartments')
        .slice(0, 3);

      this.clinicalDepartments = departments
        .filter(d => d.departmentType === 'ClinicalDepartments')
        .slice(0, 3);
    });
  }

  onDepartmentClick(department: Department): void {
    this.departmentClicked.emit(department);
    this.router.navigate(['/departments', slugify(department.pageTitle)]);
  }
}
