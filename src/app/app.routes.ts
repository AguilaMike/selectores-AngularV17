import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'selector', loadChildren: () => import('./countries/country.routing').then(m => m.routes) },
  { path: '**', redirectTo: 'selector' },
];
