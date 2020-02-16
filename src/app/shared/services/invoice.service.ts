import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { dev } from '../dev/dev';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
 // tslint:disable: variable-name

  _url = `${dev.connect}api/invoice/`;

  fileUrl = `${dev.connect}api/invoice/`;
  private socket;



  header = new HttpHeaders().set(
    'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
  );



  constructor( private http: HttpClient ) { }



    createInvoice( inv: any ) {
      return this.http.post<any>(this._url + 'create', inv, {headers : this.header});
    }


    // listInvoices() {
    //   return Observable.create((observer) => {
    //     this.socket.on('/listInvoices', data => {
    //       observer.next(data);
    //     });
    //   });
    // }


    getAllInvoices() {
      return this.http.get<any>(this._url + 'getAll/', {headers : this.header});
    }


    getOneInvoice(id) {
      return this.http.get<any>(this._url + 'getOne/' + id, {headers : this.header});
    }


    updateInvoice(id, data: any) {
      return this.http.put<any>(this._url + 'update/' + id, data, {headers : this.header});
    }


    deleteInvoice(id) {
      return this.http.delete<any>(this._url + 'delete/' + id, {headers : this.header});
    }

    sendInvoice( data: any ) {
      return this.http.post<any>(this._url + 'sendInvoice/', data, {headers : this.header});
    }

    uploadItineraryImage( data: any ) {
      return this.http.post<any>(this.fileUrl + 'upload/', data, {headers : this.header});
    }

    removeItineraryImage(name) {
      return this.http.delete<any>(this.fileUrl + 'remove/' + name, {headers : this.header});
    }
}
