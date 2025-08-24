import { Routes } from '@angular/router';



import { canActivateAuthRole } from './guards/auth-role.guard';
import { HeaderComponent } from './header/header.component';
import { WordListComponent } from './word/word-list/word-list.component';

export const routes: Routes = [
  { path: '', component: HeaderComponent },
  {
    path: 'words',
    component: WordListComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'USER' }
  }

];
