import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/selectorPage/selectorPage.component').then(m => m.SelectorPageComponent) },
];
