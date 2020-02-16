import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDatepickerConfig, NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.sass']
})
export class UpdateProjectComponent implements OnInit, OnDestroy {


  constructor(
    private calendar: NgbCalendar,
    private projectsService: ProjectsService,
    private router: Router,
    private notifyService: NotificationService
  ) { }
// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand

// Staust variables
public hideTeamSectionStatus;
public hideDetailSectionStatus;


// variables
public oppennedCard: any = [];
public currentProject: string;
public currentClient: string;
public currentTeam: string;
public involvedTeams: any = [];
public teamAndTasks: any = [];

public taskClickDone: boolean;
public taskClickDoneId: any = [];

public myInterval: any;




// Initialize
  ngOnInit() {

    // ckeck if project exists
    if (window.localStorage.getItem('projectOnEditId')) {

      window.localStorage.setItem('ActiveNav', 'projects');

      this.hideTeamSectionStatus = false;
      this.hideDetailSectionStatus = true;
      this.taskClickDone = false;


      // Updating the component every 0.7 seconds
      this.myInterval = setInterval(() => {
        this.UpdateComponent();
      }, 700);




        // load a specific Project on Initialization
      this.projectsService.getProject(window.localStorage.getItem('projectOnEditId')).subscribe(
        data => {

          // Get already Updated tasks
          data.task.forEach((task) => {
            return task.taskStatus === 'done' ?
                this.taskClickDoneId.push(task._id) : '';
          });
        },
        error => {
          console.log('Error');
        }
      );


      // if no project has been click navigate back
    } else {
      this.router.navigate(['home/projects']);
    }






// ---
  }
// ----



moveToDetails() {
  this.router.navigate(['home/project_details']);
}





  // Update component function
UpdateComponent()  {

  this.projectsService.getProject(window.localStorage.getItem('projectOnEditId')).subscribe(
  data => {
    this.oppennedCard = data;
    this.currentProject = data.projectName;
    this.currentClient = data.clientName;

    // converting Date to NgbDate
    let convertingToNgbDate = new Date(data.projectStartDate);
    this.oppennedCard.projectStartDate = new NgbDate(convertingToNgbDate.getUTCFullYear(), convertingToNgbDate.getUTCMonth()
     + 1, convertingToNgbDate.getUTCDate());
    this.oppennedCard.projectEndDate = this.calendar.getNext(data.projectStartDate, 'd', data.projectDuration);


    // clear to reasing values
    this.involvedTeams = [];
    this.teamAndTasks = [];

    // Get Involved teams
    let getInvolvedTeam =  data.task.filter(task => true).map(task => task.assignedTeam);
    this.involvedTeams = Array.from(new Set(getInvolvedTeam));


    // Iterate each team to all tasks
    this.involvedTeams.forEach((team) => {
      let teamsTask = data.task.filter(task => {
                                  return task.assignedTeam === team ? true : false;
                      }).map( task => task);
      let teamsTaskNumber = teamsTask.length;

      let teamCompletedTasks = teamsTask.filter(task => {
                              return task.taskStatus === 'done' ? true : false;
                        }).map(compTask => compTask);

      let completedTaskNumber = teamCompletedTasks.length;
      this.teamAndTasks.push( { team: team, task: teamsTask, taskNum: teamsTaskNumber,
         completedTask: teamCompletedTasks, compTaskNum: completedTaskNumber});
    });

    },
  error => {
        console.log('Error');
  }
);


// --
}






// To details
toDetails(clickTeam) {
  this.hideTeamSectionStatus = true;
  this.hideDetailSectionStatus = false;
  this.currentTeam = clickTeam;

}

backToTeams() {
  this.hideTeamSectionStatus = false;
  this.hideDetailSectionStatus = true;
}


// Check Task to update
clickToUpdateTasks(id) {

  return this.taskClickDoneId.indexOf(id) !== -1 ?
          this.taskClickDoneId = this.taskClickDoneId.filter(e => (e !== id)).map(e => e) :
            this.taskClickDoneId.push(id);

}






// update the project
updateProjectsTasks() {


  this.oppennedCard.task.forEach((t) => {
    return this.taskClickDoneId.indexOf(t._id) !== -1 ?
        t.taskStatus = 'done' : t.taskStatus = 'checked';
  });

  let doneTasks = this.oppennedCard.task.filter(task => task.taskStatus === 'done' ? true : false).map(e => e);
  let progress = Math.round(doneTasks.length * 100 / this.oppennedCard.task.length);

  this.projectsService.updateProject(window.localStorage.getItem('projectOnEditId'),
   {task : this.oppennedCard.task, progress: progress}).subscribe(
    data => {
      this.notifyService.showSuccess('Project Tasks Updated', 'Success');
      data.task.forEach((task) => {
        return task.taskStatus === 'done' ?
            this.taskClickDoneId.push(task._id) : '';
      });

    },
    error => {
      this.notifyService.showError('Could not update tasks', 'Error');
    }
  );





}








// On Destroy
ngOnDestroy() {
  clearInterval(this.myInterval);
}












// === End
}
// === End
