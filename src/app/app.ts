import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { DisclaimerComponent } from "./disclaimer/disclaimer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, DisclaimerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'vocabulary-ng';
}
