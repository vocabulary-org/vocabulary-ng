import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  private readonly keycloak = inject(Keycloak);

  login() {
    this.keycloak.login();
  }
}
