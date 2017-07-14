import { NgModule }            from '@angular/core';
import { RouterModule }        from '@angular/router';

import { AuthGuard } from '../_guards/index';
import { UserProfileComponent }    from './user-profile.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] }
  ])],
  exports: [RouterModule]
})
export class UserProfileRoutingModule {}