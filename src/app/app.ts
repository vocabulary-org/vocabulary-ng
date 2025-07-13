import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { WordListComponent } from "./words/word-list/word-list.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, WordListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'vocabulary-ng';
}
