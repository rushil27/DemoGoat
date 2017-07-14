import { Component } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

import { PaUserInfoService } from './paUserInfo.service';
import { UserActions } from '../../../redux/actions/user/user.actions';

@Component({
  selector: 'pa-user-info',
  providers: [PaUserInfoService],
  styleUrls: ['./paUserInfo.scss'],
  templateUrl: './paUserInfo.html'
})

export class PaUserInfoComponent {

  @select('user') user$: Observable<any>;
  public userinfo: Object[];

  constructor(private _paUserInfoService: PaUserInfoService, private userActions: UserActions) {
    this.userinfo = this._paUserInfoService.getUserInfo();
  }

}
