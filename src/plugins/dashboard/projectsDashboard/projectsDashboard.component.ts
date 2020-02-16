import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'app-projects-dashboard',
    templateUrl: './projectsDashboard.component.html',
    styleUrls: ['./projectsDashboard.component.sass']
  })
export class ProjectsDashboardComponent implements OnInit {


  constructor(
    private router: Router,
  ) { }



ngOnInit() {
  window.localStorage.setItem('ActiveNav', 'dashboard');
}


toMainDashboard() {
  this.router.navigate(['/home/main_dashboard']);
}

toSalesDashboard() {
  this.router.navigate(['/home/sales_dashboard']);
}


}// End of class ProjectsDashboardComponent
