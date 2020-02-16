import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SalesCategory } from '../models/salesCategory';
import { Observable } from 'rxjs';
import { dev } from '../dev/dev';

@Injectable({
  providedIn: 'root'
})
export class SalesCategoryService {
 // tslint:disable: variable-name

 _url = `${dev.connect}api/salesCategory/`;


private socket;



header = new HttpHeaders().set(
  'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
);



constructor( private http: HttpClient ) { }


addSalesCategory( salesCatData: SalesCategory ) {
  return this.http.post<any>(this._url + 'create', salesCatData, {headers : this.header} );
}



// listSalesCategory() {

//   return Observable.create((observer) => {
//     this.socket.on('/listSalesCategory', data => {
//       observer.next(data);
//     });
//   });
// }



getSaleCat(id) {
  return this.http.get<any>(this._url + 'getOne/' + id, {headers : this.header} );
}



getAllSalesCategories() {
  return this.http.get<any>(this._url + 'getAll/', {headers : this.header} );
}



updateSaleCategory(id, data: any) {
  return this.http.put<any>(this._url + 'update/' + id, data, {headers : this.header} );
}



deleteSaleCategory(id) {
  return this.http.delete<any>(this._url + 'delete/' + id, {headers : this.header} );
}



  // -----
}
