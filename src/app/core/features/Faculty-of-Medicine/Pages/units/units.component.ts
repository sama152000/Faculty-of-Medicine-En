import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UnitsService } from '../../Services/units.service';
import { Unit, UnitDetail, UnitMember } from '../../model/unit.model';
import { CleanHtmlPipe } from '../../../../pipes/clean-html.pipe'; // ✅ استدعاء الـ Pipe


@Component({
  selector: 'app-units',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe],
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
  unit?: Unit;
  unitDetail?: UnitDetail;
  unitMembers: UnitMember[] = [];

  activeTab = 'about';
  activeAboutSection = 'overview';

  constructor(
    private route: ActivatedRoute,
    private unitsService: UnitsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug']; // نقرأ الـ slug بدل الـ id
      if (slug) {
        this.loadUnitData(slug);
      }
    });
  }

  private loadUnitData(slug: string): void {
    // بيانات الوحدة الأساسية بالـ slug
    this.unitsService.getUnitBySlug(slug).subscribe(unit => {
      if (unit) {
        this.unit = unit;

        const unitId = unit.id; // نستخدم الـ id الداخلي لجلب باقي التفاصيل

        // تفاصيل الوحدة
        this.unitsService.getUnitDetailsByUnitId(unitId).subscribe(detail => {
          this.unitDetail = detail;
        });

        // أعضاء الوحدة
        this.unitsService.getUnitMembersByUnitId(unitId).subscribe(members => {
          this.unitMembers = members;
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
