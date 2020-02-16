import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { dev } from '../dev/dev';

@Injectable({
  providedIn: 'root'
})


export class UserService {
 // tslint:disable: variable-name

_url = `${dev.connect}api/user/`;

// private socket;


header = new HttpHeaders().set(
  'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
);

registrationHeader = new HttpHeaders().set(
  'Authorization', `Bearer ${window.localStorage.getItem('invitedUserToken')}`
);

// this.socket = dev.connectToSocket;
constructor( private http: HttpClient ) { }


loginUser( loginData: any ) {
  return this.http.post<any>(this._url + 'login', loginData);
}


registerUser( registrationData: any ) {
  return this.http.post<any>(this._url + 'register', registrationData, {headers : this.registrationHeader});
}


inviteUser(inviteData: any) {
  return this.http.post<any>(this._url + 'invite', inviteData, {headers : this.header});
}


// listUsers() {
//   return Observable.create((observer) => {
//     this.socket.on('/listUsers', data => {
//       observer.next(data);
//     });
//   });
// }


getAllUsers() {
  return this.http.get<any>(this._url + 'getAll/', {headers : this.header});
}


getOneUser(id) {
  return this.http.get<any>(this._url + 'getOne/' + id, {headers : this.header});
}


updateUsers(id, data: any) {
  return this.http.put<any>(this._url + 'update/' + id, data, {headers : this.header});
}


deleteUser(id) {
  return this.http.delete<any>(this._url + 'delete/' + id, {headers : this.header});
}


//
}
//
