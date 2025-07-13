import { Component, OnInit} from '@angular/core';
import { WordService } from '../../services/word/word.service'
import { Word } from '../../model/word/word.model';


@Component({
  selector: 'app-word-list',
  imports: [],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.css'
})

export class WordListComponent implements OnInit {
  words: Word[] = [];

  constructor(private wordService: WordService) {}

  ngOnInit(): void {
    this.wordService.getAll().subscribe(page => {
      this.words = page.content;
    });
  }
}