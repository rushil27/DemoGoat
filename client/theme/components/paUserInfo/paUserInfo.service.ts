import { Injectable } from '@angular/core';

@Injectable()
export class PaUserInfoService {

  private _userinfo = [
    {
      uname: 'vstriker',
      fname: 'Vlad',
      lname: 'Striker',
      org: 'ABC, corp',
      ltime: '2017-06-02T19:35:05+05:00'
    },
    {
      uname: 'alew',
      fname: 'Abey',
      lname: 'Lew',
      org: 'DEF, corp',
      ltime: '2017-07-02T14:35:05+08:00'
    },
    {
      uname: 'bthorn',
      fname: 'Bob',
      lname: 'Thorn',
      org: 'XYZ, corp',
      ltime: '2017-03-30T01:35:59+05:00'
    },
  ];

  public getUserInfo(): Object[] {
    return this._userinfo;
  }
}
