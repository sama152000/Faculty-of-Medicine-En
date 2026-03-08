import { Component, OnInit, HostListener, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../../../Services/menu.service';
import { NavbarItem } from '../../../../model/menu.model';

@Component({
  selector: 'app-medicine-menu-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medicine-menu-bar.component.html',
  styleUrls: ['./medicine-menu-bar.component.css']
})
export class MedicineMenuBarComponent implements OnInit {
  activeDropdown: string | null = null;
  activeSubDropdown: string | null = null;
  activeSubSubDropdown: string | null = null;
  isCollapsed = true;
  isMobile = false;
  navbarItems: WritableSignal<NavbarItem[]> = signal([]);
  expandedDepartmentTypes: Set<string> = new Set();

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.loadMenuItems();
    this.checkMobileView();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkMobileView();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.medicine-menu-bar')) {
      this.activeDropdown = null;
      this.activeSubDropdown = null;
      this.activeSubSubDropdown = null;
    }
  }

  trackByFn(index: number, item: NavbarItem): any {
    return item.id;
  }

  private loadMenuItems(): void {
    this.menuService.getAllMenus().subscribe({
      next: (items: NavbarItem[]) => {
        // console.log('Menu items loaded:', items);
        items.forEach((item, index) => {
          // console.log(`Menu ${index}: ${item.label} - slug: ${item.slug} - type: ${item.type} - children: ${item.children?.length ?? 0}`);
          if (item.children?.length) {
            item.children.forEach((child, cIdx) => {
              // console.log(`  └─ Child ${cIdx}: ${child.label} - slug: ${child.slug}`);
            });
          }
        });
        const deptMenu = items.find(i => i.type === 'columns');
        if (deptMenu) {
          // console.log('Department menu found:', deptMenu);
          // console.log('Department children:', deptMenu.children);
          deptMenu.children?.forEach((child, index) => {
                  // console.log(`Child ${index} (${child.label}):`, child);
                  // console.log(`  - Has ${child.children?.length ?? 0} departments`);
            child.children?.forEach((dept, deptIdx) => {
              // console.log(`    [${deptIdx}] ${dept.label}`);
            });
          });
        }
        this.navbarItems.set(items);
      },
      error: (err) => {
        // console.log('fail to load navbar items', err);
      },
    });
  }

  private checkMobileView(): void {
    this.isMobile = window.innerWidth <= 991;
    if (!this.isMobile) {
      this.isCollapsed = true;
    }
  }

  toggleMobileMenu(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onTabClick(tab: NavbarItem, event: Event): void {
    if (tab.children?.length) {
      // For dropdown items, prevent default and toggle dropdown
      event.preventDefault();
      this.activeDropdown = this.activeDropdown === tab.id ? null : tab.id;
    } else {
      // For regular links, let the router handle navigation
      // Just update state and close menu
      this.menuService.updateActiveTab(tab.id).subscribe(updatedTabs => {
        this.navbarItems.set(updatedTabs);
      });
      this.isCollapsed = true;
      this.activeDropdown = null;
      // Don't prevent default - let [routerLink] handle navigation
    }
  }

  onSubTabClick(subTab: NavbarItem, parentTab: NavbarItem, event: Event): void {
    if (subTab.children && subTab.children.length > 0) {
      // For items with children, prevent default and toggle dropdown
      event.preventDefault();
      this.activeSubDropdown = this.activeSubDropdown === subTab.id ? null : subTab.id;
      return;
    }
    // For regular links, update state and let router handle navigation
    this.menuService.updateActiveTab(subTab.id).subscribe(updatedTabs => {
      this.navbarItems.set(updatedTabs);
    });
    this.isCollapsed = true;
    this.activeDropdown = null;
    this.activeSubDropdown = null;
    // Don't prevent default - let [routerLink] handle navigation
  }

  toggleDepartmentType(departmentType: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.expandedDepartmentTypes.has(departmentType)) {
      this.expandedDepartmentTypes.delete(departmentType);
    } else {
      this.expandedDepartmentTypes.add(departmentType);
    }
  }

  isDepartmentTypeExpanded(departmentType: string): boolean {
    return this.expandedDepartmentTypes.has(departmentType);
  }

  onDepartmentClick(department: NavbarItem, event: Event): void {
    event.preventDefault();
    this.menuService.updateActiveTab(department.id).subscribe(updatedTabs => {
      this.navbarItems.set(updatedTabs);
    });
    this.isCollapsed = true;
    this.activeDropdown = null;
    this.expandedDepartmentTypes.clear();
  }

  onSubSubTabClick(subChild: NavbarItem, child: NavbarItem, parent: NavbarItem, event: Event): void {
    event.preventDefault();
    this.activeSubSubDropdown = this.activeSubSubDropdown === subChild.id ? null : subChild.id;
  }

  groupChildrenByType(children: NavbarItem[] | undefined): Record<string, NavbarItem[]> {
    if (!children) return {};
    return children.reduce((acc, child) => {
      const type = child.departmentType || 'Other';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(child);
      return acc;
    }, {} as Record<string, NavbarItem[]>);
  }

getRouterLink(item: NavbarItem): string | any[] | null {
  // If it has children, it's a dropdown menu - don't navigate
  if (item.children && item.children.length > 0) {
    return null;
  }

  // For custom pages, use slug as-is (already built clean in MenuService)
  if (item.type === 'custom' && item.slug) {
    return item.slug; // مثال: /custom/new-page أو /custom/<pageId>
  }

  // For other pages, use the slug as-is
  return item.slug;
}

  private parseQueryParams(queryString: string): any {
    const params: any = {};
    const pairs = queryString.split('&');
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) {
        params[key] = decodeURIComponent(value || '');
      }
    });
    return params;
  }
}
