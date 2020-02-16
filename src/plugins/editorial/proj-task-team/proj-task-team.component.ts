import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TeamsService } from 'src/app/shared/services/teams.service';
import { CustomaryService } from 'src/app/shared/services/customary.service';
import { SalesCategoryService } from 'src/app/shared/services/sales-category.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { HomeComponent } from 'src/app/components/home/home.component';

@Component({
  selector: 'app-proj-task-team',
  templateUrl: './proj-task-team.component.html',
  styleUrls: ['./proj-task-team.component.sass']
})


export class ProjTaskTeamComponent implements OnInit, OnDestroy {

  // Constructor
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private homeComponent: HomeComponent,
    private notifyService: NotificationService,
    private teamsService: TeamsService,
    private customService: CustomaryService,
    private salesCategoryService: SalesCategoryService,
    private spinnerService: SpinnerService
  ) { }
// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand

// permisions
public toAdmin = false;


// Modal
@ViewChild('editTeamModal') public editTeamModal: ModalDirective;
@ViewChild('deleteTeamModal') public deleteTeamModal: ModalDirective;
@ViewChild('editSalesCatModal') public editSalesCatModal: ModalDirective;
@ViewChild('deleteSalesCatModal') public deleteSalesCatModal: ModalDirective;


// Status Variables
public previewSectionStatus: boolean;
public customServiceSectionStatus: boolean;
public customServiceFormStatus: boolean;
public addTaskSectionStatus: boolean;
public defineTaskFormStatus: boolean;
public listAddTeamStatus: boolean;
public listAddSalesCategoryStatus: boolean;
public listStatus: boolean;

// Form Variables

@ViewChild('myAddTeamForm') myAddTeamFormValues;
@ViewChild('myAddSalesCategoryForm') myAddSalesCategoryFormValues;
@ViewChild('myCustomServiceForm') myCustomServiceFormValues;
@ViewChild('mydefineTaskForm') mydefineTaskFormValues;
@ViewChild('customServiceInput') customServiceInputField: ElementRef;
@ViewChild('taskDefineInput') taskField: ElementRef;
@ViewChild('assignTeamToTask') assignTeamToTask: ElementRef;


public addNewTeamForm: FormGroup;
public addSalesCategoryForm: FormGroup;
public customServiceForm: FormGroup;
public defineTaskForm: FormGroup;
public editServiceForm: FormGroup;
public editTeamForm: FormGroup;
public editSalesCatForm: FormGroup;




// Binded Variables
public Teams: any = [];
public SalesCategorys: any = [];
public namedCustomService: string;
public namedTargetRevenue: number;
public Tasks: any = [];
public Services: any = [];




// Edit Variables
public serviceTobeEdited;
public teamToBeEdited;
public teamToBeDeleted;
public salesCategoryToBeEdited;
public salesCategoryToBeDeleted;

public myInterval: any;





  ngOnInit() {

          if (window.localStorage.getItem('permissionStatus') === 'isUser') {
            this.router.navigate(['/sales']);
          }
          if (window.localStorage.getItem('permissionStatus') === 'isAdmin') {
            this.toAdmin = true;
          }
          window.localStorage.setItem('ActiveNav', 'editorial');

            // status
          this.previewSectionStatus = false;
          this.customServiceSectionStatus = true;
          this.customServiceFormStatus = true;
          this.addTaskSectionStatus = false;
          this.defineTaskFormStatus = false;
          this.listAddSalesCategoryStatus = false;
          this.listAddTeamStatus = false;
          this.listStatus = true;



          // load
          this.teamsService.getAllTeams().subscribe(
            data => {
                this.Teams = data;
            },
            error => {
              console.log('Cannot get all teams');
            }
          );

          this.salesCategoryService.getAllSalesCategories().subscribe(
            data => {
                this.SalesCategorys = data;
            },
            error => {
              console.log('Cannot get all Categoris');
            }
          );

          this.customService.getAllServices().subscribe(
            data => {
                this.Services = data;
            },
            error => {
              console.log('Cannot get all Services');
            }
          );



          // Add new Team
          this.addNewTeamForm = this.formBuilder.group({
            teamName: ['', Validators.required]
          });






          // Add Sales Category
          this.addSalesCategoryForm = this.formBuilder.group({
            name: ['', Validators.required]
          });



          // Add new Custom Service Form
          this.customServiceForm = this.formBuilder.group({
            customServiceName: ['', Validators.required],
            targetRevenue: [null, Validators.required]
          });

          // define Tasks
          this.defineTaskForm = this.formBuilder.group({
            taskName: ['', Validators.required],
            assignedTeam: ['', Validators.required]
          });



          this.editServiceForm = this.formBuilder.group({
            serviceName: ['', Validators.required],
            targetRevenue: ['', Validators.required],
            task: {
              taskName: ['', Validators.required],
              assignedTeam: ['', Validators.required]
            }
          });

          this.editTeamForm = this.formBuilder.group({
            name: ['', Validators.required]
          });

          this.editSalesCatForm = this.formBuilder.group({
            name: ['', Validators.required]
          });

          this.myInterval = setInterval(() => {
            this.updatePage();
          }, 10000); // 10 sec


  }// ngOnInit -end


 // conveniently get the values from the form fields
get formAddNewTeam() {return this.addNewTeamForm.controls; }
get formAddSalesCategory() {return this.addSalesCategoryForm.controls; }
get formCustomService() {return this.customServiceForm.controls; }
get formAddTask() { return this.defineTaskForm.controls; }
get formEditService() { return this.editServiceForm.controls; }
get formEditTeam() { return this.editTeamForm.controls; }
get formSalesCatTeam() { return this.editSalesCatForm.controls; }









updatePage() {

    // Update Teams
    this.teamsService.getAllTeams().subscribe(
      data => {
          this.Teams = data;
      },
      error => {
        console.log(error);
      }
    );


      // List Sales category
    this.salesCategoryService.getAllSalesCategories().subscribe(
    data => {
        this.SalesCategorys = data;
    },
    error => {
      console.log(error);
    }
  );


  // List custom services
    this.customService.getAllServices().subscribe(
    data => {
        this.Services = data;
    },
    error => {
      console.log(error);
    }
  );

}













// Open Team Form
openTeamForm() {

  this.previewSectionStatus = false;
  this.customServiceSectionStatus = false;
  this.customServiceFormStatus = false;
  this.addTaskSectionStatus = false;
  this.defineTaskFormStatus = false;
  this.listAddTeamStatus = !this.listAddTeamStatus;
  this.listAddSalesCategoryStatus = false;
  this.listStatus = false;
  setTimeout(() => { this.listStatus = true; }, 1000);

}









// Add Team
addTeam() {

  this.previewSectionStatus = false;
  this.customServiceSectionStatus = false;
  this.customServiceFormStatus = false;
  this.addTaskSectionStatus = false;
  this.defineTaskFormStatus = false;
  this.listAddTeamStatus = true;
  this.listAddSalesCategoryStatus = false;
  this.listStatus = false;
  setTimeout(() => { this.listStatus = true; }, 1000);

  let convertedData = {
                      name: this.addNewTeamForm.value.teamName
                    };
  this.homeComponent.loadStart();
  this.teamsService.createTeam(convertedData).subscribe(
    data => {
      setTimeout(() => {
      this.homeComponent.loadStop();
      this.updatePage();
      this.notifyService.showSuccess(`Team ${data.name} has been added`, 'Success');
      this.myAddTeamFormValues.resetForm();
      }, 1500);
    },
    error => {
      setTimeout(() => {
      this.homeComponent.loadStop();
      this.notifyService.showError(error.error.message, 'Failed...');
      }, 1500);
    }
  );

}









// Open Sales Cat Foem
openSalesCatForm() {

  this.previewSectionStatus = false;
  this.customServiceSectionStatus = false;
  this.customServiceFormStatus = false;
  this.addTaskSectionStatus = false;
  this.defineTaskFormStatus = false;
  this.listAddTeamStatus = false;
  this.listAddSalesCategoryStatus = !this.listAddSalesCategoryStatus;
  this.listStatus = false;
  setTimeout(() => { this.listStatus = true; }, 1000);

}










// Add Sales Category
addSalesCategory() {

  this.previewSectionStatus = false;
  this.customServiceSectionStatus = false;
  this.customServiceFormStatus = false;
  this.addTaskSectionStatus = false;
  this.defineTaskFormStatus = false;
  this.listAddTeamStatus = false;
  this.listAddSalesCategoryStatus = true;
  this.listStatus = false;
  setTimeout(() => { this.listStatus = true; }, 1000);

  let convertedData = {
                      name: this.addSalesCategoryForm.value.name,
                      totalLeads: 0,
                      totalRevenue: 0
                    };
  this.homeComponent.loadStart();
  this.salesCategoryService.addSalesCategory(convertedData).subscribe(
    data => {
      setTimeout(() => {
      this.homeComponent.loadStop();
      this.updatePage();
      this.notifyService.showSuccess(`Category ${data.name} has been added`, 'Success');
      this.myAddSalesCategoryFormValues.resetForm();
    }, 1500);
    },
    error => {
      setTimeout(() => {
      this.homeComponent.loadStop();
      this.notifyService.showError(error.error.message, 'Failed...');
      }, 1500);
    }
  );

}











// Add New Customary Service
openCustomServiceForm() {
  this.previewSectionStatus = false;
  this.customServiceSectionStatus = !this.customServiceSectionStatus;
  this.customServiceFormStatus = !this.customServiceFormStatus;
  this.addTaskSectionStatus = false;
  this.defineTaskFormStatus = false;
  this.listAddTeamStatus = false;
  this.listAddSalesCategoryStatus = false;
  this.listStatus = false;
  this.customServiceInputField.nativeElement.focus();
  setTimeout(() => { this.listStatus = true; }, 1000);

}






// Move to task Form
moveToTaskForm() {

  this.previewSectionStatus = false;
  this.customServiceSectionStatus = false;
  this.customServiceFormStatus = false;
  this.addTaskSectionStatus = true;
  this.defineTaskFormStatus = true;
  this.listAddTeamStatus = false;
  this.listAddSalesCategoryStatus = false;
  this.listStatus = false;

  this.namedCustomService = this.customServiceForm.value.customServiceName;
  this.namedTargetRevenue = this.customServiceForm.value.targetRevenue;
  this.myCustomServiceFormValues.resetForm();
  this.taskField.nativeElement.focus();

  setTimeout(() => { this.listStatus = true; }, 1000);


}




// Save add another tasks
addAnotherTask() {

  this.previewSectionStatus = true;
  this.customServiceSectionStatus = false;
  this.customServiceFormStatus = false;
  this.addTaskSectionStatus = true;
  this.defineTaskFormStatus = true;
  this.listAddTeamStatus = false;
  this.listAddSalesCategoryStatus = false;
  this.listStatus = false;

  this.Tasks.push(this.defineTaskForm.value);
  // this.mydefineTaskFormValues.resetForm();
  this.taskField.nativeElement.value = '';
  this.taskField.nativeElement.focus();

  setTimeout(() => { this.listStatus = true; }, 1000);

}


moveToRevenueInput() {
  this.assignTeamToTask.nativeElement.focus();
}




// Save and close Project Form
saveAndClose() {

  this.previewSectionStatus = false;
  this.customServiceSectionStatus = false;
  this.customServiceFormStatus = false;
  this.addTaskSectionStatus = false;
  this.defineTaskFormStatus = false;
  this.listAddTeamStatus = false;
  this.listAddSalesCategoryStatus = false;
  this.listStatus = false;
  setTimeout(() => { this.listStatus = true; }, 1000);

  this.Tasks.push(this.defineTaskForm.value);

  let convertedData = {
    serviceName : this.namedCustomService,
    task: this.Tasks,
    targetRevenue: this.namedTargetRevenue

  };

  this.mydefineTaskFormValues.resetForm();
  this.homeComponent.loadStart();
  this.customService.createService(convertedData).subscribe(
    data => {
      setTimeout(() => {
      this.homeComponent.loadStop();
      this.updatePage();
      this.notifyService.showSuccess(`Service ${data.serviceName} has been added`, 'Success');
      this.Tasks = [];
      }, 1500);
    },
    error => {
      setTimeout(() => {
      this.homeComponent.loadStop();
      this.notifyService.showError(error.error.message, 'Failed...');
      }, 1500);
    }

  );

}







// Edit Custom Service
editCustomService(id) {

  window.localStorage.setItem('IdServiceTobeEdited', id);
  this.router.navigate(['home/edit_editorial']);


}


identifyTeamToBeEdited(team) {
  this.teamToBeEdited = team;
}


editTeam() {

  let data = this.editTeamForm.value.name;

  this.teamsService.updateTeam(this.teamToBeEdited._id, {name: data}).subscribe(
    dataUpdatedTem => {
      this.updatePage();
      this.notifyService.showSuccess('Team Updated', 'Success');
    },
    error => {
      this.notifyService.showError('Not Updated..', 'Error');
    }

  );
}



identifyTeamToBeDeleted(team) {
  this.teamToBeDeleted = team;
}


deleteTeam() {

  this.teamsService.deleteTeam(this.teamToBeDeleted._id).subscribe(
    data => {
      this.updatePage();
      this.notifyService.showSuccess('Team Delete', 'Success');
    },
    error => {
      this.notifyService.showError('Not Deleted..', 'Error');
    }

  );

}





identifySalesCatBeEdited(salesCat) {
  return Number(salesCat.totalLeads) > 0 ?
    this.notifyService.showWarning('Ensure this stage has no cards for you to edit', `${salesCat.totalLeads} card(s) in this Stage`) :
      (this.salesCategoryToBeEdited = salesCat, this.editSalesCatModal.show());
}


editSalesCategory() {

  let data = this.editSalesCatForm.value.name;

  this.salesCategoryService.updateSaleCategory(this.salesCategoryToBeEdited._id, {name: data}).subscribe(
    dataUpdatedSalCat => {
      this.updatePage();
      this.notifyService.showSuccess('Sales Category Updated', 'Success');
    },
    error => {
      this.notifyService.showError('Not Updated..', 'Error');
    }

  );
}



identifySalesCatToBeDeleted(salesCat) {
  return Number(salesCat.totalLeads) > 0 ?
  this.notifyService.showWarning('Ensure this stage has no cards for you to Delete', `${salesCat.totalLeads} card(s) in this Stage`) :
    (  this.salesCategoryToBeDeleted = salesCat, this.deleteSalesCatModal.show());
}


deleteSalesCategory() {

  this.salesCategoryService.deleteSaleCategory(this.salesCategoryToBeDeleted._id).subscribe(
    data => {
      this.updatePage();
      this.notifyService.showSuccess('Sales Category Delete', 'Success');
    },
    error => {
      this.notifyService.showError('Not Deleted..', 'Error');
    }

  );

}




ngOnDestroy() {
  clearInterval(this.myInterval);
}



}// === End;
