import { Component, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { UserActions } from '../../redux/actions/user/user.actions';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';


@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPassword {

  public form: FormGroup;
  public email: AbstractControl;
  public isMailSent: boolean = false;
  public user: any;
  public staticAlertClosed = true;
  public errMsg: string = '';
  public submitted: boolean = false;

  constructor(fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private userActions: UserActions) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });

    this.email = this.form.controls['email'];
  }

  onSubmit(values: Object) {
    this.isMailSent = false;
    this.submitted = true;
    if (this.form.valid) {
      this.userActions.forgotPass(this.form).subscribe(res => {
        if (res.data) {
          this.user = res.data;
          this.isMailSent = true;
        } else {
          this.staticAlertClosed = false;
          alert(this.staticAlertClosed);
          this.errMsg = res.err;
        }
        this.ref.detectChanges();
      }, err => {
        console.log('in component Error', err);
      });
    }
  }
}
