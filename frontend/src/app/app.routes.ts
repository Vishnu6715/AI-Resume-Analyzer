import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./history/history').then(m => m.History)
  }
];