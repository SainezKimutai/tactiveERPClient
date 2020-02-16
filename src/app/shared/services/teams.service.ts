import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Team } from '../models/teams';
import { Observable } from 'rxjs';
import { dev } from '../dev/dev';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
 // tslint:disable: variable-name

 _url = `${dev.connect}api/teams/`;


private socket;



header = new HttpHeaders().set(
  'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
);



constructor( private http: HttpClient ) { }



createTeam( newTeam: Team ) {
  return this.http.post<any>(this._url + 'create', newTeam, {headers : this.header});
}



// listTeams() {

//   return Observable.create((observer) => {
//     this.socket.on('/listTeams', data => {
//       observer.next(data);
//     });
//   });

// }



getAllTeams() {
  return this.http.get<any>(this._url + 'getAll/', {headers : this.header});
}



getOneTeam(id) {
  return this.http.get<any>(this._url + 'getOne/' + id , {headers : this.header});
}



updateTeam(id, data: any) {
  return this.http.put<any>(this._url + 'update/' + id, data, {headers : this.header});
}



deleteTeam(id) {
  return this.http.delete<any>(this._url + 'delete/' + id, {headers : this.header});
}


//
}
//
