import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../shared/service/user/user.service';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-user.component.html',
})
export class DeleteUserComponent {

  private readonly userService = inject(UserService);
  private readonly keycloak = inject(Keycloak);
  private readonly router = inject(Router);

  readonly confirming = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  requestDelete(): void {
    this.error.set(null);
    this.confirming.set(true);
  }

  cancel(): void {
    this.confirming.set(false);
  }

  confirmDelete(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.deleteUser().subscribe({
      next: () => {
        this.loading.set(false);
        this.confirming.set(false);

        // After deleting himself you usually:
        this.keycloak.logout();
        // - redirect to home/login
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ??
          'Failed to delete account. Please try again.'
        );
      }
    });
  }
}
