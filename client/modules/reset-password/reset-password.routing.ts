import { Routes, RouterModule }  from '@angular/router';

import { ResetPassword } from './reset-password.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: 'reset/:token',
    component: ResetPassword
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
