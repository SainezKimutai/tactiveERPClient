import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { TeamsService } from 'src/app/shared/services/teams.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { GanttComponent } from './gantt/gantt.component';





@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.sass']
})



export class ProjectDetailsComponent implements OnInit {





  constructor(
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    private projectsService: ProjectsService,
    private teamsService: TeamsService,
    private router: Router,
    private notifyService: NotificationService,
    // private gantt: GanttComponent
  ) { }
  // tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand

@ViewChild(GanttComponent) gantt;


public oppennedProject;







  ngOnInit() {

     // ckeck if project exists
     if (window.localStorage.getItem('projectOnEditId')) {

      window.localStorage.setItem('ActiveNav', 'projects');



        // load the Project on Initialization
      this.projectsService.getProject(window.localStorage.getItem('projectOnEditId')).subscribe(
          data => {
            this.gantt.ngOnInit();
            this.oppennedProject = data;

            // converting Project's Date to NgbDate
            let convertingToNgbDate = new Date(data.projectStartDate);
            this.oppennedProject.projectStartDate = new NgbDate(convertingToNgbDate.getUTCFullYear(),
             convertingToNgbDate.getUTCMonth() + 1, convertingToNgbDate.getUTCDate());
            this.oppennedProject.projectEndDate = this.calendar.getNext(data.projectStartDate, 'd', data.projectDuration);

            // converting task dates to NgbDate
            this.oppennedProject.task.forEach((task) => {

              let taskStartDates = new Date(task.taskStartDate);
              task.taskStartDate = new NgbDate(taskStartDates.getUTCFullYear(), taskStartDates.getUTCMonth()
               + 1, taskStartDates.getUTCDate());
              task.taskEndDate = this.calendar.getNext(task.taskStartDate, 'd', task.taskDuration);

            });

          },
          error => {
            console.log('Error');
          }
        );




     } else {
      this.router.navigate(['home/projects']);
    }

// ----
  }





moveBackToTeams() {
  this.router.navigate(['home/project_update']);
}

toEditProject() {
  this.router.navigate(['home/project_edit']);
}








// === END ==
}
