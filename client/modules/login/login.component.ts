import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ErrorHandlerActions } from '../../redux/actions/error/errorHandler.actions';
import { UserFormActions } from '../../redux/actions/userForm/userForm.actions';
import { UserActions } from '../../redux/actions/user/user.actions';
import { SEOActions } from '../../redux/actions/seo/seo.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;
  public staticAlertClosed = true;

  constructor(fb: FormBuilder,
    public userActions: UserActions, private router: Router) {

    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      this.userActions.login(this.form).subscribe(x => {
        this.router.navigate(['/profile']);
      }, err => {
        setTimeout(() => { console.log('Here 1', this.staticAlertClosed);this.staticAlertClosed = true; console.log('Here', this.staticAlertClosed);}, 2000);
        this.staticAlertClosed = false;
      });
    }
  }
}
