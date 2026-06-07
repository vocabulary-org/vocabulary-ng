import { Routes } from '@angular/router';

import { canActivateAuthRole } from './shared/guards/auth-role.guard';

import { WordListComponent } from './word/word-list/word-list.component';
import { WordCreateUpdateComponent } from './word/word-create-update/word-create-update.component';
import { LandingComponent } from './landing/landing.component';
import { WordDetailComponent } from './word/word-detail/word-detail.component';
import { FlashcardComponent } from './flashcard/flashcard.component';

import { NewUserComponent } from './user/new-user/new-user.component';
import { RolesComponent } from './settings/roles/roles.component';

import { SettingsUserLanguagesComponent } from './settings/settings-user-languages/settings-user-languages.component';
import { DeleteUserComponent } from './user/delete-user/delete-user.component';
import { PrivacyComponent } from './legal/privacy/privacy.component';
import { TermsComponent } from './legal/terms/terms.component';
import { CookiesComponent } from './legal/cookies/cookies.component';
import { AboutComponent } from './about/about.component';
import { DemoFlashcardComponent } from './demo-flashcard/demo-flashcard.component';
import { LearnDeutschComponent } from './learn-deutsch/learn-deutsch.component';
import { LearnDeutschHubComponent } from './learn-deutsch-hub/learn-deutsch-hub.component';
import { LearnDeutschStoriesComponent } from './learn-deutsch-stories/learn-deutsch-stories.component';
import { AdminLayoutComponent } from './admin/admin-layout.component';
import { NounExamplesAdminComponent } from './admin/noun-examples/noun-examples-admin.component';
import { NounTranslationsAdminComponent } from './admin/noun-translations/noun-translations-admin.component';
import { StoriesAdminComponent } from './admin/stories/stories-admin.component';

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
    path: 'flashcard',
    component: FlashcardComponent,
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
    path: 'demo',
    component: DemoFlashcardComponent,
  },

  {
    path: 'learn-deutsch',
    component: LearnDeutschHubComponent,
  },

  {
    path: 'learn-deutsch/practice',
    component: LearnDeutschComponent,
  },

  {
    path: 'learn-deutsch/stories',
    component: LearnDeutschStoriesComponent,
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'ADMIN' },
    children: [
      { path: '', redirectTo: 'noun-examples', pathMatch: 'full' },
      { path: 'noun-examples', component: NounExamplesAdminComponent },
      { path: 'noun-translations', component: NounTranslationsAdminComponent },
      { path: 'stories', component: StoriesAdminComponent },
    ],
  },

  {
    path: 'register',
    component: NewUserComponent,
  },

  {
    path: 'privacy',
    component: PrivacyComponent,
  },
  {
    path: 'terms',
    component: TermsComponent,
  },
  {
    path: 'cookies',
    component: CookiesComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
];
