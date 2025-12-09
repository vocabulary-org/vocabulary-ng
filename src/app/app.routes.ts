import { Routes } from '@angular/router';

import { canActivateAuthRole } from './shared/guards/auth-role.guard';

import { WordListComponent } from './word/word-list/word-list.component';
import { WordCreateUpdateComponent } from './word/word-create-update/word-create-update.component';
import { LandingComponent } from './landing/landing.component';
import { WordDetailComponent } from './word/word-detail/word-detail.component';
import { RolesComponent } from './roles/roles.component';
import { NewUserComponent } from './user/new-user/new-user.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },

  {
    path: 'word/list',
    component: WordListComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'USER' },
  },

  {
    path: 'word/new-word',
    component: WordCreateUpdateComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'USER' },
  },

  {
    path: 'word/:uuid',
    component: WordDetailComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'USER' },
  },

  {
    path: 'word/edit/:uuid',
    component: WordCreateUpdateComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'USER' },
  },

  {
    path: 'roles',
    component: RolesComponent,
  },

  {
    path: 'register',
    component: NewUserComponent,
  },
];
