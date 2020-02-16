import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TeamsService } from 'src/app/shared/services/teams.service';
import { CustomaryService } from 'src/app/shared/services/customary.service';
import { SalesCategoryService } from 'src/app/shared/services/sales-category.service';


@Component({
  selector: 'app-custom-service-edit',
  templateUrl: './custom-service-edit.component.html',
  styleUrls: ['./custom-service-edit.component.sass']
})


export class CustomServiceEditComponent implements OnInit {


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private notifyService: NotificationService,
    private teamsService: TeamsService,
    private customService: CustomaryService,
  ) { }
// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand

// Modal
@ViewChild('dangerModal') public dangerModal: ModalDirective;
@ViewChild('addTaskModal') public addTaskModal: ModalDirective;

public addTaskForm: FormGroup;

// permisions
public toAdmin = false;

public serviceNameForm: FormGroup;
public targetRevenueForm: FormGroup;
public taskForm: FormGroup;


public serviceTobeEdited;
public Teams: any = [];

public taskNameInputValue: string;
public assignedTeamInputValue: string;



  ngOnInit() {

    if (!window.localStorage.getItem('IdServiceTobeEdited')) {
      this.router.navigate(['/editorial']);
    } else if (window.localStorage.getItem('IdServiceTobeEdited')) {
      window.localStorage.setItem('ActiveNav', 'editorial');

      if (window.localStorage.getItem('permissionStatus') === 'isAdmin') {
        this.toAdmin = true;
      }


            // List Teams
      this.teamsService.getAllTeams().subscribe(
        data => {
            this.Teams = data;
        },
        error => {
          console.log(error);
        }
      );


      this.customService.getOneService(window.localStorage.getItem('IdServiceTobeEdited')).subscribe(
        data => {
            this.serviceTobeEdited = data;
            this.notifyService.showInfo(`${data.serviceName} service is openned.`, 'Info');
        },
        error => {
          console.log('Error');
          this.notifyService.showError(`Request Error`, 'Error');
        }
      );




      this.serviceNameForm = this.formBuilder.group({
        serviceName: ['', Validators.required],
      });

      this.targetRevenueForm = this.formBuilder.group({
        targetRevenue: ['', Validators.required],
      });

      this.taskForm = this.formBuilder.group({
        taskName: ['', Validators.required],
        assignedTeam: ['', Validators.required]
      });

      // Add new Team
      this.addTaskForm = this.formBuilder.group({
        taskName: ['', Validators.required],
        assignedTeam: ['', Validators.required]
      });


    }
// ---
  }




get formChangeServiceName() {return this.serviceNameForm.controls; }
get formChangeTargetRevenue() {return this.targetRevenueForm.controls; }
get formChangeTasks() {return this.taskForm.controls; }
get formAddTask() {return this.addTaskForm.controls; }





submitServiceNameChange() {

  this.customService.updateServices(window.localStorage.getItem('IdServiceTobeEdited'),
   {serviceName: this.serviceNameForm.value.serviceName}).subscribe(
    data => {
      this.serviceTobeEdited = data;
      this.notifyService.showSuccess('Servcce Name Changed', 'Success');
    },
    error => {
      this.notifyService.showError('Service Not Changed', 'Error');
    }
  );

}






submitTargetRevenueChange() {

  this.customService.updateServices(window.localStorage.getItem('IdServiceTobeEdited'),
   {targetRevenue: this.targetRevenueForm.value.targetRevenue}).subscribe(
    data => {
      this.serviceTobeEdited = data;
      this.notifyService.showSuccess('Revenue Chenged', 'Success');
    },
    error => {
      this.notifyService.showError('Revenue Not Changed', 'Error');
    }
  );

}




submitTaskNameChange(id) {
  let taskToBeUpdated = [];

  this.serviceTobeEdited.task.forEach((task) => {
    if (task._id === id) {
      task.taskName = this.taskForm.value.taskName;
    }
    let structuredDate = {
      taskName: task.taskName,
      assignedTeam: task.assignedTeam,
    };
    taskToBeUpdated.push(structuredDate);
  });

  this.customService.updateServices(window.localStorage.getItem('IdServiceTobeEdited'), {task: taskToBeUpdated}).subscribe(
    data => {
      this.serviceTobeEdited = data;
      this.notifyService.showSuccess('Task Updated', 'Success');
    },
    error => {
      this.notifyService.showError('Task Not Changed', 'Error');
    }
  );

}






submitAssignedTeamChange(id) {

  let taskToBeUpdated = [];

  this.serviceTobeEdited.task.forEach((task) => {
    if (task._id === id) {
      task.assignedTeam = this.taskForm.value.assignedTeam;
    }
    let structuredDate = {
      taskName: task.taskName,
      assignedTeam: task.assignedTeam,
    };
    taskToBeUpdated.push(structuredDate);
  });

  this.customService.updateServices(window.localStorage.getItem('IdServiceTobeEdited'), {task: taskToBeUpdated}).subscribe(
    data => {
      this.serviceTobeEdited = data;
      this.notifyService.showSuccess('Task Updated', 'Success');
    },
    error => {
      this.notifyService.showError('Task Not Changed', 'Error');
    }
  );

}





addTask() {
  this.serviceTobeEdited.task.push(this.addTaskForm.value);
  this.customService.updateServices(window.localStorage.getItem('IdServiceTobeEdited'), {task: this.serviceTobeEdited.task}).subscribe(
    data => {
      this.serviceTobeEdited = data;
      this.notifyService.showSuccess('Task Added', 'Success');
    },
    error => {
      this.notifyService.showError('Could Not Add Task', 'Error !!');
    }
  );
}




deleteService() {

  this.customService.deleteService(window.localStorage.getItem('IdServiceTobeEdited')).subscribe(
    data => {
      this.notifyService.showSuccess('Service Deleted', 'Success');
      window.localStorage.removeItem('IdServiceTobeEdited');
      setTimeout(() => {
        this.router.navigate(['/editorial']);
      }, 3000);
    },
    error => {
      this.notifyService.showError('Not Deleted', 'Error');
    }
  );

 }



// END
}
