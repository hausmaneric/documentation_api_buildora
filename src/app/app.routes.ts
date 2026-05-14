import { Routes } from '@angular/router';
import { ApiReferenceComponent } from './components/api-reference/api-reference.component';
import { ApplicationsOverviewComponent } from './components/applications-overview/applications-overview.component';
import { DocsShellComponent } from './components/docs-shell/docs-shell.component';

export const routes: Routes = [
  {
    path: '',
    component: DocsShellComponent,
    children: [
      { path: '', redirectTo: 'applications', pathMatch: 'full' },
      { path: 'applications', component: ApplicationsOverviewComponent },
      { path: 'api', component: ApiReferenceComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
