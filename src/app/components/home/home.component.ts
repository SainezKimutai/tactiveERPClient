import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faProjectDiagram, faUsers, faEdit, faShoppingCart, faDollarSign, faChartLine, faBook, faFileInvoice,
  faCalendar, faWarehouse } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})




export class HomeComponent implements OnInit, OnDestroy {


  constructor(
    private router: Router
  ) {  }

// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand




// Icons
public faProjectDiagram = faProjectDiagram;
public faUsers = faUsers;
public faEdit = faEdit;
public faShoppingCart = faShoppingCart;
public faDollarSign = faDollarSign;
public faChartLine = faChartLine;
public faBook = faBook;
public faCalendar = faCalendar;
public faFileInvoice = faFileInvoice;
public faWarehouse = faWarehouse;



// Variables
public loggedUserName: string;
public sideBarStatus: boolean;




// permisions
public toAdmin = false;
public toAdminManager = false;
public toAdminManagerUser = false;



// Active side navbar status
public dashboardNavBarActive = false;
public projectsNavBarActive = false;
public salesNavBarActive = false;
public editorialNavBarActive = false;
public usersNavBarActive = false;
public documentNavBarActive = false;
public calendarNavBarActive = false;
public invoiceNavBarActive = false;
public inventoryNavBarActive = false;



public myInterval: any;
public innerWidth: any;
public ImprintLoader = false;



inventoryDropdownActive = false;
dashboardDropdownActive = false;





  ngOnInit() {
    this.checkScreenWidth();
    this.loggedUserName = window.localStorage.getItem('loggedUserName');

    if (window.localStorage.getItem('permissionStatus') === 'isAdmin') {
        this.toAdmin = true;
        this.toAdminManagerUser = true;
        this.toAdminManager = true;
    } else if (window.localStorage.getItem('permissionStatus') === 'isManager') {
        this.toAdminManager = true;
        this.toAdminManagerUser = true;
    } else if (window.localStorage.getItem('permissionStatus') === 'isUser') {
        this.toAdminManagerUser = true;
    }


    this.myInterval = setInterval(() => {
      this.CheckActiveNavBar();
    }, 700);



  } //



checkScreenWidth() {
  this.innerWidth = window.innerWidth;
  if ( this.innerWidth <= 576) {
    this.sideBarStatus = true;
    this.inventoryDropdownActive = false;
    this.dashboardDropdownActive = false;
  } else {
    this.sideBarStatus = false;
  }

}





CheckActiveNavBar() {
  this.dashboardNavBarActive = false;
  this.projectsNavBarActive = false;
  this.salesNavBarActive = false;
  this.editorialNavBarActive = false;
  this.usersNavBarActive = false;
  this.documentNavBarActive = false;
  this.calendarNavBarActive = false;
  this.invoiceNavBarActive = false;
  this.inventoryNavBarActive = false;

  if (window.localStorage.getItem('ActiveNav') === 'dashboard') {this.dashboardNavBarActive = true; }
  if (window.localStorage.getItem('ActiveNav') === 'projects') {this.projectsNavBarActive = true; }
  if (window.localStorage.getItem('ActiveNav') === 'sales') {this.salesNavBarActive = true; }
  if (window.localStorage.getItem('ActiveNav') === 'editorial') {this.editorialNavBarActive = true; }
  if (window.localStorage.getItem('ActiveNav') === 'users') {this.usersNavBarActive = true; }
  if (window.localStorage.getItem('ActiveNav') === 'document') {this.documentNavBarActive = true; }
  if (window.localStorage.getItem('ActiveNav') === 'ngcalender') {this.calendarNavBarActive = true; }
  if (window.localStorage.getItem('ActiveNav') === 'invoice') {this.invoiceNavBarActive = true; }
  if (window.localStorage.getItem('ActiveNav') === 'inventory') {this.inventoryNavBarActive = true; }

}



  // Toggle Sidebar
  toggleSideBar() {
    this.sideBarStatus = !this.sideBarStatus;
    this.inventoryDropdownActive = false;
    this.dashboardDropdownActive = false;
 }





 // Navigate
 navToDashboard() {
   this.router.navigate(['home/main_dashboard']);
 }
 navToProjects() {
  this.router.navigate(['/projects']);
 }
 navToSales() {
  this.router.navigate(['/sales']);
 }
 navToUsers() {
  this.router.navigate(['/users']);
 }
 navToProjTaskTeam() {
  this.router.navigate(['/editorial']);
 }
 navToDocument() {
  this.router.navigate(['home/document']);
 }
 navToInvoice() {
  this.router.navigate(['/invoice']);
 }
 navToCalendar() {
  this.router.navigate(['/ngCalendar']);
 }



  loadStart() {
    this.ImprintLoader = true;
  }

  loadStop() {
    this.ImprintLoader = false;
  }





  logout() {
    window.localStorage.removeItem('loggedUserToken');
    window.localStorage.removeItem('loggedUserName');
    window.localStorage.removeItem('permissionStatus');
    window.localStorage.removeItem('loggedUserID');
    this.router.navigate(['/login']);
  }






  toggleInventoryDropdown() {
    this.sideBarStatus = false;
    this.inventoryDropdownActive = !this.inventoryDropdownActive;
  }

  toggleDashboardDropdown() {
    this.sideBarStatus = false;
    this.dashboardDropdownActive = !this.dashboardDropdownActive;
  }



  ngOnDestroy() {
    clearInterval(this.myInterval);

  }





} // End of Main Class
