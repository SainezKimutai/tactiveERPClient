import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { dev } from '../dev/dev';

@Injectable({
  providedIn: 'root'
})
export class SalesSentEmailService {
 // tslint:disable: variable-name

 _url = `${dev.connect}api/salesSentEmail/`;


  private socket;



  header = new HttpHeaders().set(
    'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
  );


  constructor( private http: HttpClient ) { }



    createEmail( notes: any ) {
      return this.http.post<any>(this._url + 'create', notes, {headers : this.header});
    }


    // listEmail() {
    //   return Observable.create((observer) => {
    //     this.socket.on('/listSalesSentEmail', data => {
    //       observer.next(data);
    //     });
    //   });
    // }


    getAll() {
      return this.http.get<any>(this._url + 'getAll/', {headers : this.header});
    }


    getOneEmail(id) {
      return this.http.get<any>(this._url + 'getOne/' + id, {headers : this.header});
    }


    updateEmail(id, data: any) {
      return this.http.put<any>(this._url + 'update/' + id, data, {headers : this.header});
    }


    deleteEmail(id) {
      return this.http.delete<any>(this._url + 'delete/' + id, {headers : this.header});
    }


}
