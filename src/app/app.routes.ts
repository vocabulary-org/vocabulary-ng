import { Routes } from '@angular/router';



import { canActivateAuthRole } from './guards/auth-role.guard';

import { WordListComponent } from './word/word-list/word-list.component';
import { WordCreateComponent } from './word/word-create/word-create.component';
import { LandingComponent } from './landing/landing.component';
import { WordDetailComponent } from './word/word-detail/word-detail.component';
import { RolesComponent } from './roles/roles.component';

export const routes: Routes = [

    {
    path: '',
    component: LandingComponent
  },

  {
    path: 'word/list',
    component: WordListComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'USER' }
  },

  {
    path: 'word/new-word',
    component: WordCreateComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'USER' }
  },

  {
    path: 'word/:uuid',
    component: WordDetailComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'USER' }
  },

    {
    path: 'roles',
    component: RolesComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'USER' }
  }


];
