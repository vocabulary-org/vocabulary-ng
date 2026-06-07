import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-learn-deutsch-hub',
  standalone: true,
  imports: [RouterLink, TranslocoModule],
  templateUrl: './learn-deutsch-hub.component.html',
})
export class LearnDeutschHubComponent {}
