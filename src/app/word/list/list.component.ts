import { Component, inject, OnInit } from '@angular/core';

import { NgIf, NgFor } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { WordService } from '../../service/word/word.service';
import { Word } from '../../model/word.model';

@Component({
  selector: 'app-list',
   imports: [NgIf, NgFor, MatCardModule, MatIconModule, MatListModule, MatDividerModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  words: Word[] = [];
  private readonly bookService = inject(WordService);

  ngOnInit() {
    this.bookService.listBooks().subscribe((data) => {
      console.log('num record: ' + data.content.length);
      this.words = data.content;
    });
  }
}