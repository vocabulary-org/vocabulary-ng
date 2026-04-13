import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/service/auth.service';

@Component({
  selector: 'app-terms',
  imports: [RouterLink],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent {
  readonly auth = inject(AuthService);
}
