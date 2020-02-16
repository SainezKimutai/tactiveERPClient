import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarModule } from 'ng-sidebar';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { ChartsModule } from 'ng2-charts';
import { ModalModule, BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';
import { HomeRoutingModule } from './home-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { QuillModule } from 'ngx-quill';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AmazingTimePickerModule } from 'amazing-time-picker';


import { HomeComponent } from './home.component';

// Plugins
import { MainDashboardComponent } from 'src/plugins/dashboard/mainDashboard/mainDashboard.component';
import { SalesDashboardComponent } from 'src/plugins/dashboard/salesDashboard/salesDashboard.component';
import { ProjectsDashboardComponent } from 'src/plugins/dashboard/projectsDashboard/projectsDashboard.component';
import { DocumentBoardComponent } from 'src/plugins/document/document-board/document-board.component';
import { DocumentPadComponent } from 'src/plugins/document/document-pad/document-pad.component';
import { ProjTaskTeamComponent } from 'src/plugins/editorial/proj-task-team/proj-task-team.component';
import { CustomServiceEditComponent } from 'src/plugins/editorial/custom-service-edit/custom-service-edit.component';
import { InvoiceBoardComponent } from 'src/plugins/invoice/invoice-board/invoice-board.component';
import { SalesBoardComponent } from 'src/plugins/sales/sales-board/sales-board.component';
import { SalesEditComponent } from 'src/plugins/sales/sales-edit/sales-edit.component';
import { EditProjectComponent } from 'src/plugins/projects/edit-project/edit-project.component';
import { ProjectBoardsComponent } from 'src/plugins/projects/project-boards/project-boards.component';
import { ProjectDetailsComponent } from 'src/plugins/projects/project-details/project-details.component';
import { UpdateProjectComponent } from 'src/plugins/projects/update-project/update-project.component';
import { UsersComponent } from '../users/users.component';
import { NgCalendarComponent } from '../angularCalendar/ngCalendar.component';
import { InventoryStockComponent } from 'src/plugins/inventory/inventory-stock/inventory-stock.component';
import { InventoryPurchaseOrderComponent } from 'src/plugins/inventory/inventory-purchaseOrder/inventory-purchaseOrder.component';
import { InventoryOrderComponent } from 'src/plugins/inventory/inventory-order/inventory-order.component';
import { GanttComponent } from 'src/plugins/projects/project-details/gantt/gantt.component';

import { SanitizeHtmlPipe } from 'src/app/shared/pipe/safePipe';


// tslint:disable: max-line-length
@NgModule({

declarations: [
    HomeComponent, MainDashboardComponent, SalesDashboardComponent, ProjectsDashboardComponent, DocumentBoardComponent, DocumentPadComponent,
    ProjTaskTeamComponent, CustomServiceEditComponent, InvoiceBoardComponent, SalesBoardComponent, SalesEditComponent, EditProjectComponent, ProjectBoardsComponent, ProjectDetailsComponent,
    UpdateProjectComponent, UsersComponent, NgCalendarComponent, InventoryStockComponent, InventoryPurchaseOrderComponent, InventoryOrderComponent, GanttComponent,
    SanitizeHtmlPipe
        ],

  imports: [
    CommonModule,
    HomeRoutingModule,
    AngularFontAwesomeModule,
    FontAwesomeModule,
    SidebarModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ChartsModule,
    NgxSpinnerModule,
    FilterPipeModule,
    QuillModule.forRoot(),
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
    }),
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    AmazingTimePickerModule,

  ]

})

export class HomeModule {}

