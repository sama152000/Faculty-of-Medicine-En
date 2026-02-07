import { Injectable } from '@angular/core';
import { MenuTab } from '../model/menu.model';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceService } from './service.service';
import { CentersService } from './centers.service';
import { UnitsService } from './units.service';
import { ProgramsService } from './programs.service';
import { DepartmentsService } from './departments.service';
import { SectorsService } from './sector.service';
import { slugify } from '../../../../utils/slugify';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private serviceService: ServiceService,
    private centersService: CentersService,
    private unitsService: UnitsService,
    private programsService: ProgramsService,
    private departmentsService: DepartmentsService,
    private sectorsService: SectorsService
  ) {}

  private buildMenuTabs(
    services: any[],
    centers: any[],
    units: any[],
    programs: any[],
    departments: any[],
    sectors: any[]
  ): MenuTab[] {
    return [
      {
        id: 1,
        title: 'Home',
        target: '/',
        isActive: true
      },
      {
        id: 2,
        title: 'About the Faculty',
        target: '/about',
        isActive: false,
      },
      {
        id: 3,
        title: 'Departments',
        isActive: false,
        type: 'columns',
        childs: this.buildDepartmentColumns(departments)
      },
      {
        id: 31,
        title: 'Programs',
        isActive: false,
        type: 'menu',
        childs: programs.map(program => ({
          id: parseInt(program.id),
          title: program.pageTitle,
          target: `/programs/${slugify(program.pageTitle)}`,
          isActive: false
        }))
      },
      {
        id: 4,
        title: 'Sectors',
        isActive: false,
        type: 'menu',
        childs: sectors.map(sector => ({
          id: parseInt(sector.id),
          title: sector.name,
          target: `/sectors/${slugify(sector.name)}`,
          isActive: false
        }))
      },
      {
        id: 5,
        title: 'Centers',
        isActive: false,
        type: 'menu',
        childs: centers.map(center => ({
          id: parseInt(center.id),
          title: center.centerName,
          target: `/centers/${slugify(center.centerName)}`,
          isActive: false
        }))
      },
      {
        id: 9,
        title: 'Units',
        isActive: false,
        type: 'menu',
        childs: units.map(unit => ({
          id: parseInt(unit.id),
          title: unit.unitTitle,
          target: `/units/${slugify(unit.unitTitle)}`,
          isActive: false
        }))
      },
      {
        id: 6,
        title: 'Services',
        target: '/services',
        isActive: false,
        type: 'menu',
        childs: services.map(service => ({
          id: parseInt(service.id),
          title: service.title,
          target: `/services/${slugify(service.title)}`,
          isActive: false
        }))
      },
      {
        id: 7,
        title: 'Faculty News',
        target: '/news',
        isActive: false
      },
      {
        id: 8,
        title: 'Contact Us',
        target: '/contact',
        isActive: false
      }
    ];
  }


  private buildDepartmentColumns(departments: any[]): MenuTab[] {
    const academicDept: any[] = [];
    const clinicalDept: any[] = [];

    // تقسيم الأقسام بناءً على departmentType
    departments.forEach(department => {
      if (department.departmentType === 'AcademicDepartments') {
        academicDept.push(department);
      } else if (department.departmentType === 'ClinicalDepartments') {
        clinicalDept.push(department);
      }
    });

    const columns: MenuTab[] = [];

    if (academicDept.length > 0) {
      columns.push({
        id: 100,
        title: 'Academic Departments',
        isActive: false,
        childs: academicDept.map(department => ({
          id: parseInt(department.id),
          title: department.name,
          target: `/departments/${slugify(department.name)}`,
          isActive: false
        }))
      });
    }

    if (clinicalDept.length > 0) {
      columns.push({
        id: 101,
        title: 'Clinical Departments',
        isActive: false,
        childs: clinicalDept.map(department => ({
          id: parseInt(department.id),
          title: department.name,
          target: `/departments/${slugify(department.name)}`,
          isActive: false
        }))
      });
    }

    return columns;
  }

  getMenuTabs(): Observable<MenuTab[]> {
    return forkJoin({
      services: this.serviceService.getAll(),
      centers: this.centersService.getAllCenters(),
      units: this.unitsService.getAllUnits(),
      programs: this.programsService.getAllPrograms(),
      departments: this.departmentsService.getAllDepartments(),
      sectors: this.sectorsService.getAllSectors()
    }).pipe(
      map(({ services, centers, units, programs, departments, sectors }) =>
        this.buildMenuTabs(services, centers, units, programs, departments, sectors)
      )
    );
  }

  getMenuTabById(id: number): Observable<MenuTab | undefined> {
    return this.getMenuTabs().pipe(
      map(tabs => tabs.find(tab => tab.id === id))
    );
  }

  updateActiveTab(id: number): Observable<MenuTab[]> {
    return this.getMenuTabs().pipe(
      map(tabs => {
        this.deactivateAll(tabs);
        this.findAndActivate(tabs, id);
        return tabs;
      })
    );
  }

  private deactivateAll(tabs: MenuTab[]): void {
    tabs.forEach(tab => {
      tab.isActive = false;
      if (tab.childs) {
        this.deactivateAll(tab.childs);
      }
    });
  }

  private findAndActivate(tabs: MenuTab[], id: number, parent?: MenuTab): boolean {
    for (let tab of tabs) {
      if (tab.id === id) {
        tab.isActive = true;
        if (parent) {
          parent.isActive = true;
        }
        return true;
      }
      if (tab.childs && this.findAndActivate(tab.childs, id, tab)) {
        return true;
      }
    }
    return false;
  }
}
