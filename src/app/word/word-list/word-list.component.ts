import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordService } from '../../shared/service/word/word.service';
import { Word } from '../../shared/model/word.model';
import { RouterLink } from '@angular/router';
import { LANGUAGE_FLAGS } from '../../shared/model/flag';

@Component({
  selector: 'app-word-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.css',
})

export class WordListComponent implements OnInit {
  public words: Word[] = [];
  public page: any;
  public pageSize = 10;
  public loading = false;
  public error?: string;
  public readonly flags = LANGUAGE_FLAGS;
  public currentPage = 0;
  private readonly wordService = inject(WordService);

  ngOnInit() {
    this.loadWords();
  }

  public loadWords(page: number = 0): void {
    this.loading = true;
    this.wordService.listWords(page, this.pageSize).subscribe({
      next: (pageData) => {
        this.page = pageData;
        this.words = pageData.content;
        this.currentPage = pageData.page.number;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error while loading words';
        this.loading = false;
      },
    });
  }

  public goToPage(page: number): void {
    if (page < 0 || (this.page && page >= this.page.page.totalPages)) {
      return;
    }
    this.loadWords(page);
  }

  public onDelete(word: Word): void {
    const confirmed = confirm(
      `Do you really want to delete "${word.sentence}"?`
    );
    if (!confirmed) {
      return;
    }

    this.wordService.delete(word.uuid).subscribe({
      next: () => {
        // reload current page after deletion
        this.loadWords(this.currentPage);
      },
      error: () => {
        this.error = 'Error while deleting word';
      },
    });
  }
}
