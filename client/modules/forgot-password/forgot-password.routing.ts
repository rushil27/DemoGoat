import { Routes, RouterModule }  from '@angular/router';

import { ForgotPassword } from './forgot-password.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: 'forgotPassword',
    component: ForgotPassword
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
