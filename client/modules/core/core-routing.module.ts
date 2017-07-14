import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/index';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: 'login',
    redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: 'forgotPassword',
    redirectTo: '/forgotPassword', pathMatch: 'full'
  },
  {
    path: 'reset/:token',
    redirectTo: '/reset/:token', pathMatch: 'full'
  },
  { path: 'register', redirectTo: '/register', pathMatch: 'full' },
  { path: 'profile', redirectTo: '/profile', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/PageNotFound', pathMatch: 'full', canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }