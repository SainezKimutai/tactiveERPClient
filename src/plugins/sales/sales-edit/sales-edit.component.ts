import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SalesService } from 'src/app/shared/services/sales.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { ModalDirective } from 'ngx-bootstrap';
import { HomeComponent } from 'src/app/components/home/home.component';


@Component({
  selector: 'app-sales-edit',
  templateUrl: './sales-edit.component.html',
  styleUrls: ['./sales-edit.component.sass'],
})
export class SalesEditComponent implements OnInit, OnDestroy {


  // Constructor
  constructor(
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    private router: Router,
    private homeComponent: HomeComponent,
    private userService: UserService,
    private salesService: SalesService,
    private projectService: ProjectsService,
    private notifyService: NotificationService,
    private clientService: ClientService,
    private spinnerService: SpinnerService,
  ) {}
// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand


// Modals
@ViewChild('deleteModal') public deleteModal: ModalDirective;

// Variables
public projectManagerForm: FormGroup;
public assignedUserForm: FormGroup;
@ViewChild('myRevenuePriorForm') myRevenuePriorFormValues;
public revenuePriorForm: FormGroup;



// Status
public listClickedStatus;
public taskDetailsStatus;
public taskClickedTeamStatus;
public projectCalenderStatus;


// Binded Variables

public OpennedProject: any;
public OpennedProjectTasks: any = [];
public TaskNumber: number;
public projPriority: string;
public totalTasks: number;
public totalSelectedTasks: number;
public totalTeams: number;
public totalSelectedTeams: number;
public Users: any = [];
public totalProjectAssignedUsers: number;

// Calender Variable
public projectDuration: number;
public projectHoveredDate: NgbDate;
public projectFromDate: NgbDate;
public projectToDate: NgbDate;
public projectMinDate = this.calendar.getToday();


public taskDuration: number;
public taskHoveredDate: NgbDate;
public taskFromDate: NgbDate;
public taskToDate: NgbDate;
public taskMinDate;
public taskMaxDate;










// Initialize
  ngOnInit() {
    window.localStorage.setItem('ActiveNav', 'sales');
    this.listClickedStatus = null;
    this.taskDetailsStatus = false;

    /// set dates
    this.taskFromDate = this.calendar.getToday();
    this.taskToDate = null;


    if (window.localStorage.getItem('salesEditItemId')) {

    // Get The project For Editing
        this.salesService.getOppProject(window.localStorage.getItem('salesEditItemId')).subscribe(

          data => {


            this.setdata(data);

            // set Dates
            if (data.projectDuration === null) {
              this.projectFromDate = this.calendar.getToday();
              this.taskMinDate = this.projectFromDate;
              this.taskMaxDate = this.calendar.getNext(this.taskMinDate, 'd', 7);
              this.projectToDate = null;
            } else {
              this.convertDatesToNgbDates(data);

            }

            let clientName = data.clientName.toUpperCase();
            let projectName = data.projectName.toUpperCase();
            this.notifyService.showInfo(`${clientName} ${projectName} project is opened`, 'Info...');

          },

          error => {
            console.log(error);
          }

        );

        } else {
          this.router.navigate(['home/sales_board']);
        }


      // Pass form values
    this.revenuePriorForm = this.formBuilder.group({
        revenue: [null, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        priority: null
      });

    this.projectManagerForm = this.formBuilder.group({
        projectManager: ['', Validators.required],
      });

    this.assignedUserForm = this.formBuilder.group({
        assignedUser: ['', Validators.required],
      });


    this.userService.getAllUsers().subscribe(
        data => {
            this.Users = data;
        },
        error => {
            console.log('Error in getting Users');
        }
      );




//  -----
  }
// -----



 // conveniently get the values from the form fields
 get formProjectManager() {return this.projectManagerForm.controls; }
 get formAssignedUser() {return this.assignedUserForm.controls; }
 get formRevenuePrior() {return this.revenuePriorForm.controls; }



setdata(data) {

  this.OpennedProject = data;
  this.projPriority = data.priority;

  this.totalTasks = data.task.length;
  this.totalSelectedTasks = data.task.filter((task) => {
    return task.taskStatus === 'checked' ? true : false;
  }).map(task => task).length;


  let getInvolvedTeam =  data.task.filter(task => true).map(task => task.assignedTeam);
  this.totalTeams = Array.from(new Set(getInvolvedTeam)).length;

  let getSelectedInvolvedTeam =  data.task.filter((task) => {
    return task.taskStatus === 'checked' ? true : false;
  }).map(task => task.assignedTeam);

  this.totalSelectedTeams = Array.from(new Set(getSelectedInvolvedTeam)).length;

  let getInvolvedUsers =  data.task.filter(task => task.assignedUser === '' ? false : true).map(task => task.assignedUser);
  this.totalProjectAssignedUsers = Array.from(new Set(getInvolvedUsers)).length;

}


convertDatesToNgbDates(data) {
    this.OpennedProject = data;
    // converting project date to NgbDate
    let startdates = new Date(data.projectStartDate);
    this.projectFromDate = new NgbDate(startdates.getUTCFullYear(), startdates.getUTCMonth() + 1, startdates.getUTCDate());
    this.projectToDate = this.calendar.getNext(this.projectFromDate, 'd', data.projectDuration);
    this.OpennedProject.projectStartDate = this.projectFromDate;
    this.OpennedProject.projectEndDate = this.projectToDate;
    this.taskMinDate = this.projectFromDate;
    this.taskMaxDate = this.projectToDate;

    // converting task date to NgbDate
    this.OpennedProject.task.forEach((task) => {
      if (task.taskDuration) {
      let taskStartDates = new Date(task.taskStartDate);
      task.taskStartDate = new NgbDate(taskStartDates.getUTCFullYear(), taskStartDates.getUTCMonth() + 1, taskStartDates.getUTCDate());
      task.taskEndDate = this.calendar.getNext(task.taskStartDate, 'd', task.taskDuration);
      }
    });

}




// Toogle calender
taskDetailsToggle(id) {
  this.listClickedStatus = id;
  this.taskDetailsStatus = !this.taskDetailsStatus;

  this.OpennedProject.task.forEach(task => {
    return this.listClickedStatus === task._id ? this.taskClickedTeamStatus = task.assignedTeam : '';
  });
}









// Projects Dates Seclection functions
onProjectDateSelection(date: NgbDate) {

  this.projectFromDate = date;
  this.projectToDate = this.calendar.getNext(this.projectFromDate, 'd', this.projectDuration);

}

isProjectDateHovered(date: NgbDate) {
return this.projectFromDate && !this.projectToDate && this.projectHoveredDate && date.after(this.projectFromDate)
&& date.before(this.projectHoveredDate);
}

isProjectDateInside(date: NgbDate) {
return date.after(this.projectFromDate) && date.before(this.projectToDate);
}

isProjectDateRange(date: NgbDate) {
return date.equals(this.projectFromDate) || date.equals(this.projectToDate) || this.isProjectDateInside(date) ||
this.isProjectDateHovered(date);
}

isProjectDateBeforeMinDate(date: NgbDate) {
  return date.before(this.projectMinDate);
}






// Save Project dates and Duration
saveProjectDurationDates() {

  let dataToBeSent = {
    projectDuration: this.projectDuration,
    projectStartDate: new Date(this.projectFromDate.year, this.projectFromDate.month - 1, this.projectFromDate.day + 1),
    projectEndDate: new Date(this.projectToDate.year, this.projectToDate.month - 1, this.projectToDate.day + 1)
  };

  this.salesService.updateOppProject(window.localStorage.getItem('salesEditItemId'), dataToBeSent).subscribe(
    data => {
      this.setdata(data);
      this.convertDatesToNgbDates(data);

      this.notifyService.showSuccess('Dates Changes Saved', 'Success');
    },
    error => {
      this.notifyService.showError('No Changes are Saved', 'Error');

    }
  );
}







submitProjectManager() {

  this.salesService.updateOppProject(window.localStorage.getItem('salesEditItemId'), this.projectManagerForm.value).subscribe(
    data => {

      this.setdata(data);
      this.convertDatesToNgbDates(data);

      this.notifyService.showSuccess('Changes Saved', 'Success');
    },
    error => {
      this.notifyService.showError('Changes Not saved', 'Error !');
    }
  );

}








// Tasks Dates Seclection functions

onTaskDateSelection(date: NgbDate) {

    this.taskFromDate = date;
    this.taskToDate = this.calendar.getNext(this.taskFromDate, 'd', this.taskDuration);

}

isTaskDateHovered(date: NgbDate) {
  return this.taskFromDate && !this.taskToDate && this.taskHoveredDate && date.after(this.taskFromDate) &&
   date.before(this.taskHoveredDate);
}

isTaskDateInside(date: NgbDate) {
  return date.after(this.taskFromDate) && date.before(this.taskToDate);
}

isTaskDateRange(date: NgbDate) {
  return date.equals(this.taskFromDate) || date.equals(this.taskToDate) || this.isTaskDateInside(date) || this.isTaskDateHovered(date);
}

isTaskDateOutSide(date: NgbDate) {
  return date.before(this.taskMinDate) || date.after(this.taskMaxDate);
}






// Save Changes on Tasks
saveTasksDurationDates() {
  this.OpennedProject.task.forEach((t) => {

    if (this.listClickedStatus === t._id) {
          t.taskDuration = this.taskDuration,
          t.taskStartDate = new Date(this.taskFromDate.year, this.taskFromDate.month - 1, this.taskFromDate.day + 1);
          t.taskEndDate = new Date(this.taskToDate.year, this.taskToDate.month - 1, this.taskToDate.day + 1);
          t.taskStatus = 'checked';

    }
    if (t._id !== this.listClickedStatus && t.taskDuration) {
      t.taskStartDate = new Date(t.taskStartDate.year, t.taskStartDate.month - 1, t.taskStartDate.day + 1);
      t.taskEndDate = new Date(t.taskEndDate.year, t.taskEndDate.month - 1, t.taskEndDate.day + 1);
    }

  });


  this.salesService.updateOppProject(window.localStorage.getItem('salesEditItemId'), {task : this.OpennedProject.task}).subscribe(
    data => {

      this.setdata(data);
      this.convertDatesToNgbDates(data);

      this.notifyService.showSuccess('Task Updated', 'Success');
      this.taskDetailsStatus = !this.taskDetailsStatus;
    },
    error => {
      this.notifyService.showError('Task Not Updated', 'Error');

    }
  );

}





changeAssignedUser() {

  this.OpennedProject.task.forEach((t) => {

    if (this.listClickedStatus === t._id) {
          t.assignedUser = this.assignedUserForm.value.assignedUser;

          if (t.taskDuration) {
            t.taskStartDate = new Date(t.taskStartDate.year, t.taskStartDate.month - 1, t.taskStartDate.day + 1);
            t.taskEndDate = new Date(t.taskEndDate.year, t.taskEndDate.month - 1, t.taskEndDate.day + 1);
          }
    }
    if (t._id !== this.listClickedStatus && t.taskDuration) {
      t.taskStartDate = new Date(t.taskStartDate.year, t.taskStartDate.month - 1, t.taskStartDate.day + 1);
      t.taskEndDate = new Date(t.taskEndDate.year, t.taskEndDate.month - 1, t.taskEndDate.day + 1);
    }

  });

  this.salesService.updateOppProject(window.localStorage.getItem('salesEditItemId'), {task : this.OpennedProject.task}).subscribe(
    data => {

      this.convertDatesToNgbDates(data);

      let getInvolvedUsers =  data.task.filter(task => task.assignedUser === '' ? false : true).map(task => task.assignedUser);
      this.totalProjectAssignedUsers = Array.from(new Set(getInvolvedUsers)).length;


      this.taskDetailsStatus = !this.taskDetailsStatus;
      this.notifyService.showSuccess('Task Updated', 'Success');
    }, error => {
      this.notifyService.showError('Task Not Updated', 'Success');
    }
  );


}





// Set priority
selectPriority(num) {
  this.projPriority = num;
}





// Save Changes

saveRevenuePrioroty() {


  this.revenuePriorForm.value.priority = this.projPriority;

  this.salesService.updateOppProject(window.localStorage.getItem('salesEditItemId'), this.revenuePriorForm.value).subscribe(
    data => {
      this.notifyService.showSuccess('Changes Saved', 'Success');
    },
    error => {
      this.notifyService.showError('Changes Not saved', 'Error !');
    }
  );


}


discardChanges() {
  this.router.navigate(['home/sales_board']);
}





// Loanchproject
lauchProject() {

  this.salesService.getOppProject(window.localStorage.getItem('salesEditItemId')).subscribe(
    data => {

      let newProject = {
        clientName : data.clientName,
        projectName: data.projectName,
        projectManager: data.projectManager,
        task : data.task.filter((task) => {
                          return task.taskStatus === 'checked';
                      }).map(task => task),
        revenue: data.revenue,
        priority: data.priority,
        projectStatus : 'active',
        progress: 0,
        projectDuration: data.projectDuration,
        projectStartDate: data.projectStartDate,
        projectEndDate: data.projectEndDate,
        createdOn: new Date(),
      };


      // create Projects
      this.projectService.addProject(newProject).subscribe(
        dataAddProj => {

            this.notifyService.showSuccess('Projects Launched', 'Success');
            setTimeout(() => {
                  this.router.navigate(['home/projects']);
                }, 3000);

        },
        error => {

        }
      );

    },
    error => {
      console.log(error);
    }
  );



}


deleteProject() {

  this.deleteModal.show();

}




submitDeleted() {
  this.homeComponent.loadStart();
  let clientChecked = this.OpennedProject.clientName;
  this.salesService.deleteOppProject(window.localStorage.getItem('salesEditItemId')).subscribe(
    data => {
      this.cleanUpTheClient(clientChecked);

    },
    error => {
      this.notifyService.showError('Projects Not Deleted', 'Failled');
    }

  );

}

cleanUpTheClient(clientChecked) {

  this.salesService.getAllOppProject().subscribe(
    data => {
      let notThere = true;
      data.forEach((opp) => {
        if (opp.clientName === clientChecked) { notThere = false; }
      });
      if (notThere) {
        this.clientService.getAllClients().subscribe(
          cliData => {
            cliData.forEach((cli) => {
              if (cli.companyName === clientChecked ) {
                this.clientService.deleteClient(cli._id).subscribe(
                  resData => {
                    this.homeComponent.loadStop();
                    this.notifyService.showSuccess('Projects Deleted', 'Success');
                    this.notifyService.showInfo('Client Removed From Your Database', 'Info');
                    setTimeout(() => {
                      this.router.navigate(['home/sales_board']);
                    }, 2000);
                  },
                  error => {
                    console.log('Error');
                  }
                );
              }
            });
          },
          error => {console.log('Error'); }
        );
      }
      if (!notThere) {
        this.notifyService.showSuccess('Projects Deleted', 'Success');
        this.homeComponent.loadStop();
        setTimeout(() => {
                this.router.navigate(['home/sales_board']);
          }, 2000);
      }
    }
  );

}










ngOnDestroy() {
  window.localStorage.removeItem('salesEditItemId');
}



// === end ===
}
