import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/service/auth.service';

@Component({
  selector: 'app-privacy',
  imports: [RouterLink],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent {
  readonly auth = inject(AuthService);
}
