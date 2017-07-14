import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/Rx';

@Injectable()
export class UserService {
  constructor(private http: Http) { }

  // Private variables that only this service can use
  private authUrl = 'auth/local';
  private userUrl = 'api/users';

  private extractToken(res: Response) {
    let body = res.json();
    Cookie.set('token', body.token);
    return body.user;
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let body = (error._body);
    console.log('handleError', error);
    if (typeof (error._body) === 'object') {
      body = JSON.parse(error._body);
    } else {
      body = (error._body);
    }
    let errMsg;

    if (body.errors) {
      errMsg = body.errors.username ? body.errors.username : body.errors.email;
    } else {
      errMsg = body ? body :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    }

    return Observable.throw({
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: errMsg.message
    });
  }

  // This is called when there is a cookie OAuth token
  // present in the browser so the user will automatically
  // sign in
  getMe(): Observable<any> {
    return this.http.get(this.userUrl + '/me')
      .map(res => res.json())
      .catch(this.handleError);
  }

  login(email: string, password: string): Observable<any> {
    let body = JSON.stringify({
      email: email,
      password: password
    });

    return this.http.post(this.authUrl, body)
      .map(this.extractToken)
      .catch(this.handleError);
  }

  signup(username: string, email: string, password: string): Observable<any> {
    let body = JSON.stringify({
      username: username,
      email: email,
      password: password
    });
    return this.http.post(this.userUrl, body)
      .map(this.extractToken)
      .catch(this.handleError);
  }


  resetPass(token: string, password: string): Observable<any> {
    let body = JSON.stringify({
      token: token,
      password: password
    });
    return this.http.post(this.userUrl + '/reset', body)
      .map(this.extract)
      .catch(this.handleError);
  }

  forgotPass(email: string): Observable<any> {
    let body = JSON.stringify({
      email: email,
    });
    return this.http.post(this.userUrl + '/forgot', body)
      .map(this.extract)
      .catch(this.handleError);
  }

  private extract(res: Response) {
    console.log('res >>>>>>>> ', res)
    return res.json();
  }
}
