

import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../shared/service/word/translate.service';
import { TranslateRequest } from '../../shared/model/translate-request.model';

@Component({
  selector: 'app-word-translation-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auto-translation.component.html',
})
export class AutoTranslationComponent {
  private readonly translateService = inject(TranslateService);

  @Input({ required: true }) sentence = '';
  @Input({ required: true }) fromCode: string | null = null;
  @Input({ required: true }) toCode: string | null = null;

  @Output() translated = new EventEmitter<string>();

  isTranslating = false;
  isQuotaReached = false;
  message: string | null = null;

  ngOnInit(): void {
    this.translateService.isQuotaReached().subscribe({
      next: (v) => (this.isQuotaReached = v),
      error: () => (this.isQuotaReached = true), // fail-safe
    });
  }

  canTranslate(): boolean {
    return !!this.sentence?.trim() && !!this.fromCode && !!this.toCode && !this.isQuotaReached && !this.isTranslating;
  }

  autoTranslate(): void {
    if (!this.canTranslate()) return;

    const req: TranslateRequest = {
      text: this.sentence.trim(),
      from: this.fromCode!,
      to: [this.toCode!],
    };

    this.isTranslating = true;

    this.translateService.translate(req).subscribe({
      next: (res) => {
        const text = res.translations?.[0]?.text ?? '';
        this.translated.emit(text);
      },
      error: (err) => {
        console.error('Translate failed', err);
        const body = err.error; // could be string (text/plain) or object (application/json)

        this.message =
          body && body.message ? body.message : '❌ Something went wrong.';
      },
      complete: () => (this.isTranslating = false),
    });
  }
}

