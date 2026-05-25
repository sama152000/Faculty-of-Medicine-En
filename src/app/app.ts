import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from "@angular/router";
import { LoaderComponent } from './core/features/Faculty-of-Medicine/Pages/shared/loader/loader.component';
import { LoaderService } from './core/features/Faculty-of-Medicine/Services/loader.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LogoService } from './core/features/Faculty-of-Medicine/Services/logo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {

  protected title = 'Faculty of Medicine - Luxor University';
  showScrollButton = false;

  isLoading = false;
  loadingMessage = 'Loading...';
    private logosService = inject(LogoService);
  private document = inject(DOCUMENT);
  private destroy$ = new Subject<void>();
  
  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    // Show loader automatically on page load
    this.loaderService.showForDuration(3000, 'Loading site...');

    // Subscribe to loader service
    this.loaderService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });

    this.loaderService.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => {
        this.loadingMessage = message;
      });

       // Set favicon from logo service
    this.logosService.getDefaultLogo()
      .pipe(takeUntil(this.destroy$))
      .subscribe(logo => {
        if (logo?.url) {
          const favicon = this.document.querySelector<HTMLLinkElement>('link[rel="icon"]');
          if (favicon) {
            favicon.href = logo.url;
          } else {
            const link = this.document.createElement('link');
            link.rel = 'icon';
            link.type = 'image/x-icon';
            link.href = logo.url;
            this.document.head.appendChild(link);
          }
        }
      });
  
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showLoader() {
    this.loaderService.showForDuration(4000, 'Loading...');
  }

  showLoaderWithMessage() {
    this.loaderService.showForDuration(5000, 'Loading student data...');
  }
}
