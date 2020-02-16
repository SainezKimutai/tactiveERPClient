import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, OnDestroy {




  @ViewChild('myForm') formValues;

  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public loginError: string;

  public email;
  public togglePassword = 'password';
  public showPasswordIcon;
  public hidePasswordIcon;
  public ImprintLoader = false;


  // constructor
  constructor(

    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private notifyService: NotificationService,
    private spinnerService: SpinnerService

  ) {}

  // tslint:disable: prefer-const
  // tslint:disable: object-literal-shorthand












  ngOnInit() {
    this.checkIfAlreadyLoggedIn()
    this.showPasswordIcon = false;
    this.hidePasswordIcon = true;
    this.togglePassword = 'password';

    this.loginForm = this.formBuilder.group({
      email: ['', [ Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

    // Comment this after set Up
    // this.createSuperUserOne();
    // this.createSuperUserTwo();

  }





  get form() {return this.loginForm.controls; }








  checkIfAlreadyLoggedIn() {
    if (localStorage.getItem('loggedUserToken')) {
        this.ImprintLoader = true;
        localStorage.getItem('permissionStatus') === 'isAdmin' ? this.router.navigate(['home/main_dashboard']) :
            localStorage.getItem('permissionStatus') === 'isManager' ? this.router.navigate(['home/sales_dashboard']) : this.router.navigate(['home/sales_dashboard']);
    }
  }


  

  onSubmit() {

    this.ImprintLoader = true;


    this.userService.loginUser(this.loginForm.value).subscribe(
      data => {

        window.localStorage.setItem('loggedUserToken', data.token);
        window.localStorage.setItem('loggedUserName', data.name);
        window.localStorage.setItem('loggedUserEmail', data.email);
        window.localStorage.setItem('loggedUserID', data._id);


        return  data.role === 'admin' ?
                    (window.localStorage.setItem('permissionStatus', 'isAdmin') , this.router.navigate(['home/main_dashboard'])) :

                data.role === 'manager' ?
                    (window.localStorage.setItem('permissionStatus', 'isManager') , this.router.navigate(['home/sales_dashboard'])) :

                    (window.localStorage.setItem('permissionStatus', 'isUser') , this.router.navigate(['home/sales_dashboard']));

      },
      error => {
        // this.spinnerService.spinStop();
        this.ImprintLoader = false;
        this.notifyService.showError(error.error.message, 'Access Restricted..');
      }
    );



    }



// Password Toogle Functions
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






// Comment this after set Up
// createSuperUserOne() {
//   let superUser = {
//     name: 'Kimutai',
//     email: 'kimutai@imprintaf.com',
//     role: 'admin',
//     department: 'Dev Team',
//     password: 'kimutai',
//   };
//   this.userService.registerUser(superUser).subscribe(
//     data => {
//       this.notifyService.showSuccess('SuperUser Kimutai Created', 'Success');
//     },
//     error => {
//       this.notifyService.showError('Did not create Super User', 'Failed');
//     }
//   );

// }


// createSuperUserTwo() {
//   let superUser = {
//     name: 'Geofrey',
//     email: 'geofrey@imprintaf.com',
//     role: 'admin',
//     department: 'Dev Team',
//     password: 'geofrey',
//   };
//   this.userService.registerUser(superUser).subscribe(
//     data => {
//       this.notifyService.showSuccess('SuperUser Geofrey Created', 'Success');
//     },
//     error => {
//       this.notifyService.showError('Did not create Super User', 'Failed');
//     }
//   );
// }



ngOnDestroy() {
  this.ImprintLoader = false;
}


}// End of Main Class
