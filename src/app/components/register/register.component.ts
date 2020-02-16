import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router, ParamMap} from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TeamsService } from 'src/app/shared/services/teams.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit, OnDestroy {



  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private teamService: TeamsService,
    private notifyService: NotificationService,
    private spinnerServcice: SpinnerService
  ) {}
// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand

  // Variables

  @ViewChild('myForm') formValues;
  public registrationForm: FormGroup;
  public submitted = false;
  public registrationError;
  public togglePassword: string;
  public showPasswordIcon: boolean;
  public hidePasswordIcon: boolean;
  public isDisabled: boolean;
  public Teams: any = [];
  public InvitedEmail: any;
  public InvitedToken: any;

  public ImprintLoader = false;







  ngOnInit() {

    // window.localStorage.setItem('ActiveNav', 'users');
    this.submitted = false;
    this.showPasswordIcon = false;
    this.hidePasswordIcon = true;
    this.togglePassword = 'password';
    this.isDisabled = false;


    // Get all Teams
    this.teamService.getAllTeams().subscribe(
      data => {
        this.Teams = data;
      },
      error => {
        console.log('Error');
      }
    );


    this.route.paramMap.subscribe((params: ParamMap) => {
      this.InvitedEmail = params.get('email');
      this.InvitedToken = params.get('token');
      window.localStorage.setItem('invitedUserToken', params.get('token'));
    });

    this.registrationForm = this.formBuilder.group({

      name: ['', Validators.required],
      email: this.InvitedEmail,
      role: ['user', Validators.required],
      department: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],

    });




  }// ngOnInit

   // conveniently get the values from the form fields
   get form() {return this.registrationForm.controls; }





  // Form Submit Function
  onSubmit() {

    this.submitted = true;
    // stop here if the form is invalid
    if (this.registrationForm.invalid) {
      return;
    }

    this.isDisabled = true;

    this.ImprintLoader = true;
    // console.log(this.registrationForm.value)

    this.userService.registerUser(this.registrationForm.value).subscribe(

        data => {
            this.ImprintLoader = false;
            this.isDisabled = false;
            this.notifyService.showSuccess(`User ${data.name} has been added`, 'Success');
            setTimeout(() => {
            // login
            let loginCredentials = {
              email: this.registrationForm.value.email,
              password: this.registrationForm.value.password,
            };

            this.userService.loginUser(loginCredentials).subscribe(
              loginData => {
                this.ImprintLoader = false;
                this.formValues.resetForm();
                this.isDisabled = false;
                window.localStorage.setItem('loggedUserToken', loginData.token);
                window.localStorage.setItem('loggedUserName', loginData.name);
                window.localStorage.setItem('loggedUserEmail', loginData.email);
                window.localStorage.setItem('loggedUserID', loginData._id);


                return  loginData.role === 'admin' ?
                            (window.localStorage.setItem('permissionStatus', 'isAdmin') , this.router.navigate(['home/main_dashboard'])) :

                            loginData.role === 'manager' ?
                            (window.localStorage.setItem('permissionStatus', 'isManager') , this.router.navigate(['home/sales_board'])) :

                            (window.localStorage.setItem('permissionStatus', 'isUser') , this.router.navigate(['home/sales_board']));
              },
              error => {
                this.ImprintLoader = false;
                this.notifyService.showError(error.error.message, 'Access Restricted..');
              }
            );

          }, 1000);


        },
        error => {
            this.ImprintLoader = false;
            this.notifyService.showError(error.error.msg, 'Failed...');
            this.isDisabled = false;

        }

    );

  }





// Hide and Show Password Functions
  showPassword() {
    this.showPasswordIcon = true;
    this.hidePasswordIcon = false;
    this.togglePassword = 'text';
  }

  hidePassword() {
    this.showPasswordIcon = false;
    this.hidePasswordIcon = true;
    this.togglePassword = 'password';
  }

  ngOnDestroy() {
    localStorage.removeItem('invitedUserToken');
  }

}
