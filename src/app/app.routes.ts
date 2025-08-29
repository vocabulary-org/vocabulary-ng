import { Routes } from '@angular/router';



import { canActivateAuthRole } from './guards/auth-role.guard';
import { HeaderComponent } from './header/header.component';
import { WordListComponent } from './word/word-list/word-list.component';
import { WordCreateComponent } from './word/word-create/word-create.component';

export const routes: Routes = [

  {
    path: 'words',
    component: WordListComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'USER' }
  },

    {
    path: 'new-word',
    component: WordCreateComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'USER' }
  },


];
