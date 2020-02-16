import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { calendarEvent } from '../models/calendarEvent';
import { dev } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class CalendarEventService {
// tslint:disable: variable-name

_url = `${dev.connect}api/calenderEvents/`;

private socket;



header = new HttpHeaders().set(
  'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
);



  constructor( private http: HttpClient ) { }




addCalenderEvent( event: calendarEvent ) {
  return this.http.post<any>(this._url + 'create', event, {headers : this.header});
}


// listCalenderEvent() {
//   return Observable.create((observer) => {
//     this.socket.on('/listCalenderEvents', data => {
//       observer.next(data);
//     });
//   });
// }



getAllCalenderEvent() {
  return this.http.get<any>(this._url + 'getAll/', {headers : this.header});
}


getOneCalenderEvent(id) {
  return this.http.get<any>(this._url + 'getOne/' + id, {headers : this.header});
}


updateCalenderEvent(id, data: any) {
  return this.http.put<any>(this._url + 'update/' + id, data, {headers : this.header});
}


deleteCalenderEvent(id) {
  return this.http.delete<any>(this._url + 'delete/' + id, {headers : this.header});
}


}
