import { Component, inject, OnInit } from '@angular/core';
import { WordService } from '../../shared/service/word/word.service';
import { Word } from '../../shared/model/word.model';
import { RouterLink } from '@angular/router';
import { LANGUAGE_FLAGS } from '../../shared/model/flag';

@Component({
  selector: 'app-word-list',
  imports: [RouterLink],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.css',
})
export class WordListComponent implements OnInit {
  words: Word[] = [];
  private readonly wordService = inject(WordService);
  loading = false;
  error?: string;
  readonly flags = LANGUAGE_FLAGS;

  ngOnInit() {
    this.loadWords();
  }

  private loadWords(): void {
    this.loading = true;
    this.wordService.listWords().subscribe({
      next: (page) => {
        this.words = page.content;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error while loading words';
        this.loading = false;
      },
    });
  }

  onDelete(word: Word): void {
    const confirmed = confirm(
      `Do you really want to delete "${word.sentence}"?`
    );
    if (!confirmed) {
      return;
    }

    this.wordService.delete(word.uuid).subscribe({
      next: () => {
        // remove from list without reloading whole page
        this.words = this.words.filter((w) => w.uuid !== word.uuid);
      },
      error: () => {
        this.error = 'Error while deleting word';
      },
    });
  }
}
