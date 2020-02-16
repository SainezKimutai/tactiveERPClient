import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { dev } from '../dev/dev';

@Injectable({
  providedIn: 'root'
})
export class SalesNoteService {
 // tslint:disable: variable-name

 _url = `${dev.connect}api/salesNotes/`;


  private socket;



  header = new HttpHeaders().set(
    'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
  );


  constructor( private http: HttpClient ) {  }



    createNote( notes: any ) {
      return this.http.post<any>(this._url + 'create', notes, {headers : this.header});
    }


    // listNotes() {
    //   return Observable.create((observer) => {
    //     this.socket.on('/listSalesNotes', data => {
    //       observer.next(data);
    //     });
    //   });
    // }


    getAllNotes() {
      return this.http.get<any>(this._url + 'getAll/', {headers : this.header});
    }


    getOneNote(id) {
      return this.http.get<any>(this._url + 'getOne/' + id, {headers : this.header});
    }


    updateNote(id, data: any) {
      return this.http.put<any>(this._url + 'update/' + id, data, {headers : this.header});
    }


    deleteNote(id) {
      return this.http.delete<any>(this._url + 'delete/' + id, {headers : this.header});
    }


}
