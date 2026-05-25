import { Routes } from '@angular/router';
import { HomeComponent } from './core/features/Faculty-of-Medicine/Pages/Home/Home.component';
import { FacultyOfMedicineComponent } from './core/features/Faculty-of-Medicine/Faculty-of-Medicine.component';
import { SectorsComponent } from './core/features/Faculty-of-Medicine/Pages/sectors/sectors.component';
import { NewsListComponent } from './core/features/Faculty-of-Medicine/Pages/news-list/news-list.component';
import { NewsDetailsComponent } from './core/features/Faculty-of-Medicine/Pages/news-list/news-details/news-details.component';
import { DepartmentsComponent } from './core/features/Faculty-of-Medicine/Pages/departments/departments.component';
import { ProgramsComponent } from './core/features/Faculty-of-Medicine/Pages/programs/programs.component';
import { ContactComponent } from './core/features/Faculty-of-Medicine/Pages/contact/contact.component';
import { CentersComponent } from './core/features/Faculty-of-Medicine/Pages/centers/centers.component';
import { UnitsComponent } from './core/features/Faculty-of-Medicine/Pages/units/units.component';
import { ServicesComponent } from './core/features/Faculty-of-Medicine/Pages/services/services.component';
import { AboutComponent } from './core/features/Faculty-of-Medicine/Pages/about/about.component';
import { CustomPageTemplateComponent } from './core/features/Faculty-of-Medicine/Pages/shared/custom-page-template/custom-page-template.component';
import { AdministrationComponent } from './core/features/Faculty-of-Medicine/Pages/administration/administration.component';

export const routes: Routes = [
  {
    path: '',
    component: FacultyOfMedicineComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    //  { path: 'sectors', component: SectorsComponent },
      { path: 'sectors/:slug', component: SectorsComponent },
      { path: 'news', component: NewsListComponent },
      { path: 'news/:id', component: NewsDetailsComponent },
      { path: 'departments/:slug', component: DepartmentsComponent },
            // { path: 'departments', component: DepartmentsComponent },

      { path: 'programs/:slug', component: ProgramsComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'centers/:slug', component: CentersComponent },
      { path: 'units/:slug', component: UnitsComponent },
      { path: 'services/:slug', component: ServicesComponent },
      { path: 'about', component: AboutComponent },
       { path: 'custom', component: CustomPageTemplateComponent },
      { path: 'custom/:slug', component: CustomPageTemplateComponent },
         { path: 'administrations', component: AdministrationComponent },
      { path: 'administrations/:slug', component: AdministrationComponent },

    ]
  }
];
