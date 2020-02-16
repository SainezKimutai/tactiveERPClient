import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';



@Component({
    selector: 'app-inventory-purchase-order',
    templateUrl: './inventory-purchaseOrder.component.html',
    styleUrls: ['./inventory-purchaseOrder.component.sass']
})
export class InventoryPurchaseOrderComponent implements OnInit {



  constructor(
    private router: Router,
  ) { }
// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand



ngOnInit() {

  window.localStorage.setItem('ActiveNav', 'inventory');


}// ngOnInit




}// Class InventoryBoardComponent
