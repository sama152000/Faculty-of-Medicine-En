import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustomPageService } from '../../../Services/custom-page.service';
import { CustomPage } from '../../../model/custom-page.model';
import { CleanHtmlPipe } from '../../../../../pipes/clean-html.pipe';

@Component({
  selector: 'app-custom-page-template',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe],
  templateUrl: './custom-page-template.component.html',
  styleUrls: ['./custom-page-template.component.css']
})
export class CustomPageTemplateComponent implements OnInit {
  customPage?: CustomPage;
  isLoading: boolean = true;
  errorMessage: string = '';
  activeSection = 'content';

  constructor(
    private route: ActivatedRoute,
    private customPageService: CustomPageService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      const pageId = this.route.snapshot.queryParamMap.get('pageId');

      // console.log('CustomPageTemplate - slug from URL:', slug);
      // console.log('CustomPageTemplate - pageId from query:', pageId);

      if (pageId) {
        this.loadPageById(pageId);
      } else if (slug) {
        this.loadPageBySlug(slug);
      } else {
        this.errorMessage = 'Page not specified';
        this.isLoading = false;
      }
    });
  }

  private loadPageById(pageId: string): void {
    this.customPageService.getByPageId(pageId).subscribe(
      (page: CustomPage | undefined) => {
        if (page) {
          this.customPage = page;
        } else {
          this.loadPageBySlug(pageId);
        }
        this.isLoading = false;
      },
      (error: any) => {
        // console.error('Error loading custom page by ID:', error);
        this.loadPageBySlug(pageId);
      }
    );
  }

  private loadPageBySlug(slug: string): void {
    // console.log('loadPageBySlug - looking for:', slug);
    this.customPageService.getBySlug(slug).subscribe(
      (page: CustomPage | undefined) => {
        // console.log('loadPageBySlug - found page:', page);
        if (page) {
          this.customPage = page;
        } else {
          this.errorMessage = 'Requested page not available';
        }
        this.isLoading = false;
      },
      (error: any) => {
        // console.error('Error loading custom page by slug:', error);
        this.errorMessage = 'An error occurred while loading the page';
        this.isLoading = false;
      }
    );
  }

  switchSection(section: string): void {
    this.activeSection = section;
  }

  downloadAttachment(attachment: any): void {
    if (attachment.url) {
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.fileName || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  getFileIcon(fileName: string): string {
    if (!fileName) return 'fas fa-file';
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'fas fa-file-pdf';
      case 'doc':
      case 'docx': return 'fas fa-file-word';
      case 'xls':
      case 'xlsx': return 'fas fa-file-excel';
      case 'ppt':
      case 'pptx': return 'fas fa-file-powerpoint';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'fas fa-file-image';
      case 'zip':
      case 'rar': return 'fas fa-file-archive';
      default: return 'fas fa-file';
    }
  }

  hasContent(): boolean {
    return !!(this.customPage?.content);
  }

  hasAttachments(): boolean {
    return !!(this.customPage?.pageAttachments && this.customPage?.pageAttachments.length > 0);
  }
}
