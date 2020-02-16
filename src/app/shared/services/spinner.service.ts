import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})


export class SpinnerService {


  constructor( private spinner: NgxSpinnerService ) { }


spinStart() {
    this.spinner.show();
}

spinStop() {
    this.spinner.hide();
}



}
