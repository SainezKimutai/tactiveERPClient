import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';



@Component({
    selector: 'app-inventory-stock',
    templateUrl: './inventory-stock.component.html',
    styleUrls: ['./inventory-stock.component.sass']
})
export class InventoryStockComponent implements OnInit {



  constructor(
    private router: Router,
  ) { }
// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand



ngOnInit() {

  window.localStorage.setItem('ActiveNav', 'inventory');


}// ngOnInit




}// Class InventoryBoardComponent
