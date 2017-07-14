import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ErrorHandlerActions } from '../../redux/actions/error/errorHandler.actions';
import { UserFormActions } from '../../redux/actions/userForm/userForm.actions';
import { UserActions } from '../../redux/actions/user/user.actions';
import { SEOActions } from '../../redux/actions/seo/seo.actions';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss']
})
export class ResetPassword {

  public form: FormGroup;
  public password: AbstractControl;
  public repeatPassword: AbstractControl;
  public passwords: FormGroup;

  public submitted: boolean = false;
  private sub: any;
  private token: string;

  constructor(fb: FormBuilder,
    public userActions: UserActions, private route: ActivatedRoute) {

    this.sub = this.route.params.subscribe(params => {
      this.token = params['token']; // (+) converts string 'id' to a number
      console.log(this.token);
      // In a real app: dispatch action to load the details here.
    });

    this.form = fb.group({
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, { validator: EqualPasswordsValidator.validate('password', 'repeatPassword') })
    });

    this.passwords = <FormGroup>this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      this.userActions.resetPass(this.token ,this.form);
    }
  }
}
