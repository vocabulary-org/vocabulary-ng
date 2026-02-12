import { Routes } from '@angular/router';

import { canActivateAuthRole } from './shared/guards/auth-role.guard';

import { WordListComponent } from './word/word-list/word-list.component';
import { WordCreateUpdateComponent } from './word/word-create-update/word-create-update.component';
import { LandingComponent } from './landing/landing.component';
import { WordDetailComponent } from './word/word-detail/word-detail.component';

import { NewUserComponent } from './user/new-user/new-user.component';
import { RolesComponent } from './settings/roles/roles.component';

import { SettingsUserLanguagesComponent } from './settings/settings-user-languages/settings-user-languages.component';
import { DeleteUserComponent } from './user/delete-user/delete-user.component';

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
    path: 'settings/languages',
    component: SettingsUserLanguagesComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'USER' },
  },
  {
    path: 'settings/roles',
    component: RolesComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'USER' },
  },
  {
    path: 'settings/delete-user',
    component: DeleteUserComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'USER' },
  },

  {
    path: 'register',
    component: NewUserComponent,
  },
];
