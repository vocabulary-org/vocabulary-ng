import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { ListComponent } from "./word/list/list.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'vocabulary-ng';
}
