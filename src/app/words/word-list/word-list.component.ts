import { Component, DestroyRef, inject, OnInit} from '@angular/core';
import { WordService } from '../../services/word/word.service'
import { Word } from '../../model/word/word.model';


@Component({
  selector: 'app-word-list',
  imports: [],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.css'
})

export class WordListComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  words: Word[] = [];

  constructor(private wordService: WordService) {}

  ngOnInit(): void {
    const subscription = this.wordService.getAll().subscribe(page => {
      this.words = page.content;
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();

    });
  }
}