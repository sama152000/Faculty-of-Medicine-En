import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeanSpeechService } from '../../../Services/dean.service';
import { DeanSpeech } from '../../../model/dean-info.model';
import { CleanHtmlPipe } from '../../../../../pipes/clean-html.pipe'; // ✅ استدعاء الـ Pipe


@Component({
  selector: 'app-dean-speech',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe],
  templateUrl: './dean-speech.component.html',
  styleUrls: ['./dean-speech.component.css']
})
export class DeanSpeechComponent implements OnInit {
  sectionTitle: string = `Dean's Speech`;
  deanSpeech: DeanSpeech | null = null;
  showFull: boolean = true;

  constructor(private deanSpeechService: DeanSpeechService) {}

  ngOnInit(): void {
    this.loadDeanSpeech();
  }

  private loadDeanSpeech(): void {
    this.deanSpeechService.getAll().subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.deanSpeech = res[0]; // أول كلمة عميد
        }
      },
      error: (err) => {
        console.error('Error loading dean speech:', err);
      }
    });
  }

  get displayedMessage(): string {
    if (!this.deanSpeech) return '';
    return this.showFull
      ? this.deanSpeech.speech
      : this.deanSpeech.speech.slice(0, 810) + '...';
  }
}
