import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { dev } from '../dev/dev';

@Injectable({
  providedIn: 'root'
})


export class SalesService {
 // tslint:disable: variable-name

 _url = `${dev.connect}api/opps/`;


private socket;


header = new HttpHeaders().set(
  'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
);

constructor( private http: HttpClient ) {  }


addOppProject( oppProjectsData: any ) {
  return this.http.post<any>(this._url + 'create', oppProjectsData, {headers : this.header});
}


// listOppProject() {
//   return Observable.create((observer) => {
//     this.socket.on('/listOppProjects', data => {
//       observer.next(data);
//     });
//   });
// }


getAllOppProject() {
  return this.http.get<any>(this._url + 'getAll/', {headers : this.header});
}


getOppProject(id) {
  return this.http.get<any>(this._url + 'getOne/' + id, {headers : this.header});
}


updateOppProject(id, data: any) {
  return this.http.put<any>(this._url + 'update/' + id, data, {headers : this.header});
}


deleteOppProject(id) {
  return this.http.delete<any>(this._url + 'delete/' + id, {headers : this.header});
}


}
