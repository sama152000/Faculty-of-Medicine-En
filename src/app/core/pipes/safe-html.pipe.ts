import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/*
Pipe آمن لعرض HTML المُنظف مسبقاً 🛡️

الاستخدام:
<div [innerHTML]="content | cleanHtml | safeHtml"></div>

ملاحظة: يُستخدم بعد CleanHtmlPipe لضمان أمان المحتوى
*/
@Pipe({
  name: 'safeHtml',
  standalone: true,
  pure: false, // Changed to false to ensure it re-evaluates when input changes
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';
    
    // Trust the sanitized HTML content
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
