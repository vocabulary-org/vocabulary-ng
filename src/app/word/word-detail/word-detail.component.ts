import { Component, inject, input, OnInit } from '@angular/core';
import { WordService } from '../../shared/service/word/word.service';
import { Word } from '../../shared/model/word.model';
import { LANGUAGE_FLAGS } from '../../shared/model/flag';

@Component({
  selector: 'app-word-detail',
  imports: [],
  templateUrl: './word-detail.component.html',
  styleUrl: './word-detail.component.css',
})
export class WordDetailComponent implements OnInit {
  uuid = input.required<string>();
  private wordService = inject(WordService);
  word?: Word; // property to hold the result
  readonly flags = LANGUAGE_FLAGS;

  ngOnInit(): void {
    this.wordService.getById(this.uuid()).subscribe({
      next: (result) => (this.word = result),
      error: (err) => console.error('Error fetching word by ID', err),
    });
  }
}
