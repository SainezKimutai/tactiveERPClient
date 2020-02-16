import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { dev } from '../dev/dev';

@Injectable({
  providedIn: 'root'
})

export class ProjectsService {
 // tslint:disable: variable-name

 _url = `${dev.connect}api/projects/`;


  private socket;



  header = new HttpHeaders().set(
    'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
  );


  constructor( private http: HttpClient ) {  }



  addProject( ProjectsData: any ) {
    return this.http.post<any>(this._url + 'create', ProjectsData, {headers : this.header});
  }


  // listProject() {
  //   return Observable.create((observer) => {
  //     this.socket.on('/listProjects', data => {
  //       observer.next(data);
  //     });
  //   });
  // }




  getAllProject() {
    return this.http.get<any>(this._url + 'getAll/', {headers : this.header});
  }


  getProject(id) {
    return this.http.get<any>(this._url + 'getOne/' + id, {headers : this.header} );
  }



  updateProject(id, data: any) {
    return this.http.put<any>(this._url + 'update/' + id, data, {headers : this.header});
  }



  getGanttProject(id): Promise<any> {
    return this.http.get<any>(this._url + 'oneToGantt/' + id, {headers : this.header})
        .toPromise()
        .catch();
  }

  // Structure Gantt Chart data
  getLink(): Promise<any> {
      return Promise.resolve([
          {id: 1, source: 1, target: 2, type: '0'}
      ]);
  }


  deleteProject(id) {
    return this.http.delete<any>(this._url + 'delete/' + id, {headers : this.header});
  }


    // End
}
