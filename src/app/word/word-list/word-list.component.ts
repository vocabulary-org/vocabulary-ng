import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { WordService } from '../../shared/service/word/word.service';
import { Word } from '../../shared/model/word.model';
import { RouterLink } from '@angular/router';
import { LANGUAGE_FLAGS } from '../../shared/model/flag';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-word-list',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.css',
})
export class WordListComponent implements OnInit, OnDestroy {
  public words: Word[] = [];
  public page: any;
  public pageSize = 10;
  public loading = false;
  public error?: string;
  public readonly flags = LANGUAGE_FLAGS;
  public currentPage = 0;

  // Search functionality
  public searchControl = new FormControl('', { nonNullable: true });
  public isSearching = false;
  public searchActive = false;

  private readonly wordService = inject(WordService);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.loadWords();
    this.setupSearchListener();
  }

  private setupSearchListener(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged(), // Only emit if value has changed
        takeUntil(this.destroy$),
      )
      .subscribe((searchTerm) => {
        if (searchTerm && searchTerm.trim().length > 0) {
          this.performSearch(searchTerm.trim());
        } else {
          // Clear search and reload normal list
          this.searchActive = false;
          this.loadWords(0);
        }
      });
  }

  private performSearch(searchTerm: string): void {
    this.isSearching = true;
    this.searchActive = true;

    // Call your search API endpoint
    // Assuming your WordService has a search method
    // If not, you'll need to add it to your service
    this.wordService.search(searchTerm, 0, this.pageSize).subscribe({
      next: (pageData) => {
        this.page = pageData;
        this.words = pageData.content;
        this.currentPage = pageData.page.number;
        this.isSearching = false;
      },
      error: () => {
        this.error = 'Error while searching words';
        this.isSearching = false;
      },
    });
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

    // If search is active, perform search with new page
    if (this.searchActive && this.searchControl.value) {
      this.performSearchPage(page);
    } else {
      this.loadWords(page);
    }
  }

  private performSearchPage(page: number): void {
    this.isSearching = true;

    this.wordService
      .search(this.searchControl.value, page, this.pageSize)
      .subscribe({
        next: (pageData) => {
          this.page = pageData;
          this.words = pageData.content;
          this.currentPage = pageData.page.number;
          this.isSearching = false;
        },
        error: () => {
          this.error = 'Error while searching words';
          this.isSearching = false;
        },
      });
  }

  public clearSearch(): void {
    this.searchControl.setValue('');
    this.searchActive = false;
    this.loadWords(0);
  }

  public onDelete(word: Word): void {
    const confirmed = confirm(
      `Do you really want to delete "${word.sentence}"?`,
    );
    if (!confirmed) {
      return;
    }

    this.wordService.delete(word.uuid).subscribe({
      next: () => {
        // reload current page after deletion
        if (this.searchActive && this.searchControl.value) {
          this.performSearchPage(this.currentPage);
        } else {
          this.loadWords(this.currentPage);
        }
      },
      error: () => {
        this.error = 'Error while deleting word';
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
