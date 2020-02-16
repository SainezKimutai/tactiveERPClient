import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { dev } from '../dev/dev';

@Injectable({
  providedIn: 'root'
})


export class ClientService {
  // tslint:disable: variable-name


  _url = `${dev.connect}api/clients/`;


  private socket;


  header = new HttpHeaders().set(
    'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
  );


  constructor( private http: HttpClient ) {}



  createClient( data: any ) {
    return this.http.post<any>(this._url + 'create', data, {headers : this.header});
  }


  // listClients() {
  //   return Observable.create((observer) => {
  //     this.socket.on('/listClients', data => {
  //       observer.next(data);
  //     });
  //   });
  // }



  getAllClients() {
    return this.http.get<any>(this._url + 'getAll/', {headers : this.header});
  }



  getOneClient(id) {
    return this.http.get<any>(this._url + 'getOne/' + id, {headers : this.header});
  }


  getOneByName(name) {
    return this.http.get<any>(this._url + 'getByName/' + name, {headers : this.header});
  }


  updateClient(id, data: any) {
    return this.http.put<any>(this._url + 'update/' + id, data, {headers : this.header});
  }



  deleteClient(id) {
    return this.http.delete<any>(this._url + 'delete/' + id, {headers : this.header});
  }


  sendMail( data: any ) {
    return this.http.post<any>(this._url + 'sendMail', data, {headers : this.header});
  }


}
