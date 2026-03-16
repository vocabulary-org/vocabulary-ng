import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '../../shared/service/word/translate.service';
import { TranslateRequest } from '../../shared/model/translate-request.model';

export type AutoTranslationInput = {
  sentence: string;
  fromCode: string | null;
  toCode: string | null;
};


@Component({
  selector: 'app-word-translation',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './auto-translation.component.html',
})
export class AutoTranslationComponent {
  private readonly translateService = inject(TranslateService);
  translation = input.required<AutoTranslationInput>();

  translated = output<string>();

  isTranslating = false;
  isQuotaReached = false;
  message: string | null = null;

  ngOnInit(): void {
    this.translateService.isQuotaReached().subscribe({
      next: (v) => (this.isQuotaReached = v),
      error: () => (this.isQuotaReached = true),
    });
  }

  canTranslate(): boolean {
    return !!this.translation().sentence.trim() && !!this.translation().fromCode && !!this.translation().toCode && !this.isQuotaReached && !this.isTranslating;
  }

  autoTranslate(): void {
    if (!this.canTranslate()) return;

    const req: TranslateRequest = {
      text: this.translation().sentence.trim(),
      from: this.translation().fromCode!,
      to: [this.translation().toCode!],
    };

    this.isTranslating = true;

    this.translateService.translate(req).subscribe({
      next: (res) => {
        const text = res.translations?.[0]?.text ?? '';
        this.translated.emit(text);
      },
      error: (err) => {
        console.error('Translate failed', err);
        const body = err.error;

        this.message =
          body && body.message ? body.message : '❌ Something went wrong.';
      },
      complete: () => (this.isTranslating = false),
    });
  }
}
