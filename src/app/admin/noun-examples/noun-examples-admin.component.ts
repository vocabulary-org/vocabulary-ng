import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NounExamplesAdminService } from '../noun-examples-admin.service';

type Status = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-noun-examples-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './noun-examples-admin.component.html',
})
export class NounExamplesAdminComponent {
  private readonly svc = inject(NounExamplesAdminService);

  readonly langs = [
    { code: 'it', label: 'Italiano' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
  ];

  selectedLang = 'it';
  limit: number | null = null;
  status: Status = 'idle';

  generate(): void {
    this.status = 'loading';
    this.svc.generateExamples(this.selectedLang, this.limit ?? undefined).subscribe({
      next: () => { this.status = 'success'; },
      error: () => { this.status = 'error'; },
    });
  }
}
