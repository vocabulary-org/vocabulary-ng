import { Component, inject, OnInit } from '@angular/core';
import { WordService } from '../../service/word/word.service';
import { Word } from '../../model/word.model';

@Component({
  selector: 'app-word-list',
  imports: [],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.css'
})
export class WordListComponent implements OnInit  {
  words: Word[] = [];
  private readonly bookService = inject(WordService);

  
  ngOnInit() {
    this.bookService.listBooks().subscribe((data) => {
      this.words = data.content;
    });
  }
}
