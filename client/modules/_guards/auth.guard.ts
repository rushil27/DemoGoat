import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { UserActions } from '../../redux/actions/user/user.actions';
import { UserService } from '../../modules/core/services/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    @select('user') user$: Observable<any>;
    constructor(private router: Router, private userActions: UserActions,
        private userService: UserService) { }

    canActivate() {

        if (Cookie.get('token')) {
            // First change the state to fetching
            this.userActions.fetchUser();
            // subscribe to the service and wait for a response
            this.userService.getMe().subscribe(user => {
                // once a response comes change the state to reflect user info
                return true;
            }, err => {
                this.userActions.invalidateUser(err);
                this.router.navigate(['/login']);
                return false
            });
            return true;
        } else {

            // not logged in so redirect to login page
            this.router.navigate(['/login']);
            return false;
        }
    }
}