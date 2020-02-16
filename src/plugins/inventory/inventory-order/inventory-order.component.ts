import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';



@Component({
    selector: 'app-inventory-order',
    templateUrl: './inventory-order.component.html',
    styleUrls: ['./inventory-order.component.sass']
})
export class InventoryOrderComponent implements OnInit {



  constructor(
    private router: Router,
  ) { }
// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand



ngOnInit() {

  window.localStorage.setItem('ActiveNav', 'inventory');


}// ngOnInit




}// Class InventoryBoardComponent
