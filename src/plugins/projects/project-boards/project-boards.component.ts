import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TeamsService } from 'src/app/shared/services/teams.service';

@Component({
  selector: 'app-project-boards',
  templateUrl: './project-boards.component.html',
  styleUrls: ['./project-boards.component.sass']
})
export class ProjectBoardsComponent implements OnInit {

  constructor(
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    private projectsService: ProjectsService,
    private teamsService: TeamsService,
    private router: Router,
    private notifyService: NotificationService
  ) { }
// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand


  @ViewChild('localProjectModal') public localProjectModal: ModalDirective;

  public Projects: any = [];
  public Teams: any = [];
  public newProjectForm: FormGroup;






  ngOnInit() {

    window.localStorage.setItem('ActiveNav', 'projects');
    this.projectsService.getAllProject().subscribe(
      data => {
        this.Projects = data.reverse();

        this.Projects.forEach(Proj => {
           // converting Project's Date to NgbDate
          let convertingToNgbDate = new Date(Proj.projectStartDate);
          Proj.projectStartDate = new NgbDate(convertingToNgbDate.getUTCFullYear(),
          convertingToNgbDate.getUTCMonth() + 1, convertingToNgbDate.getUTCDate());
          Proj.projectEndDate = this.calendar.getNext(Proj.projectStartDate, 'd', Proj.projectDuration);
        });

      },
      error => {
        console.log('Could get all Projects');
      }
    );

    this.teamsService.getAllTeams().subscribe(
      data => {
          this.Teams = data;
      },
      error => {
        console.log('Cannot get all teams');
      }
    );

    this.newProjectForm = this.formBuilder.group({
              projectName : '',
      });


  }




get formNewProject() { return this.newProjectForm.controls; }





toModifyCard(id) {
  window.localStorage.setItem('projectOnEditId', id);
  this.router.navigate(['home/project_update']);
}


openAddLocalProjectModal() {
  this.localProjectModal.show();
}

addLocalProject() {
  this.localProjectModal.hide();

  let newProject = {
    clientName: 'Internal Project',
    projectName: this.newProjectForm.value.projectName,
    projectManager: '',
    task : [{
      taskName: '',
      assignedTeam: this.Teams[0].name,
      assignedUser: '',
      taskStatus: 'checked',
      taskDuration: null,
      taskStartDate: null,
      taskEndDate: null
    }],
    revenue: null,
    priority: null,
    projectStatus : 'active',
    progress: 0,
    projectDuration: null,
    projectStartDate: null,
    projectEndDate: null,
    createdOn: new Date(),
  };

  this.projectsService.addProject(newProject).subscribe(
    data => {

        window.localStorage.setItem('projectOnEditId', data._id);
        this.router.navigate(['home/project_edit']);

    },
    error => {

    }
  );

}



}// end of class
