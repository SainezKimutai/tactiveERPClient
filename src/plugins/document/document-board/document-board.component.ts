import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-document-board',
    templateUrl: './document-board.component.html',
    styleUrls: ['./document-board.component.sass']
})
export class DocumentBoardComponent implements OnInit {


  constructor(
    private router: Router,
  ) { }
// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand


ngOnInit() {

  window.localStorage.setItem('ActiveNav', 'document');


}// ngOnInit

toNotePad() {
  this.router.navigate(['home/document/pad_document']);
}

}// Class DocumentBoardComponent
