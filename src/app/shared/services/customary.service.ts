import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomService } from '../models/customary';
import { Observable } from 'rxjs';
import { dev } from '../dev/dev';

@Injectable({
  providedIn: 'root'
})
export class CustomaryService {
 // tslint:disable: variable-name

 _url = `${dev.connect}api/services/`;


private socket;



constructor( private http: HttpClient ) { }


header = new HttpHeaders().set(
  'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
);


createService( newCustomService: CustomService ) {
  return this.http.post<any>(this._url + 'create', newCustomService, {headers : this.header});
}


// listServices() {
//   return Observable.create((observer) => {
//     this.socket.on('/listCustomServices', data => {
//       observer.next(data);
//     });
//   });
// }


getOneService(id) {
  return this.http.get<any>(this._url + 'getOne/' + id, {headers : this.header});
}


getAllServices() {
  return this.http.get<any>(this._url + 'getAll/', {headers : this.header} );
}


updateServices(id, data: any) {
  return this.http.put<any>(this._url + 'update/' + id, data, {headers : this.header});
}


deleteService(id) {
  return this.http.delete<any>(this._url + 'delete/' + id, {headers : this.header});
}


//
}
//
