import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './notFound.component.html',
  styleUrls: ['./notFound.component.sass']
})

export class NotFoundComponent {

  constructor( private router: Router ) { }

  // tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand

  backToLogin() { this.router.navigate(['/login']); }

}
