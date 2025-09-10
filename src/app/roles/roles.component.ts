// roles.component.ts
import { Component, OnInit } from '@angular/core';
import { RolesService } from '../service/roles.service';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {
  roles: string[] = [];
  error?: string;

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.rolesService.getRoles().subscribe({
      next: (roles) => this.roles = roles,
      error: (err) => this.error = 'Failed to load roles'
    });
  }
}
