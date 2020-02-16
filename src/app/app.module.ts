import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarModule } from 'ng-sidebar';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { QuillModule } from 'ngx-quill';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AmazingTimePickerModule } from 'amazing-time-picker';

// Components
import { AppComponent } from './app.component';

// Services
import { UserService } from './shared/services/user.service';
import { NotificationService } from './shared/services/notification.service';
import { AuthGuard } from './shared/guards/auth.guard';
import { SalesService } from './shared/services/sales.service';
import { TeamsService } from './shared/services/teams.service';
import { CustomaryService } from './shared/services/customary.service';
import { SalesCategoryService } from './shared/services/sales-category.service';
import { ProjectsService } from './shared/services/projects.service';
import { UsersComponent } from './components/users/users.component';
import { UserSalesStagesService } from './shared/services/user-sales-stages.service';
import { ClientService } from './shared/services/client.service';
import { SpinnerService } from './shared/services/spinner.service';
import { CalendarEventService } from './shared/services/calendarEvent.service';
import { SalesNoteService } from './shared/services/sales-note.service';
import { DocPadService } from './shared/services/doc-pad.service';
import { InvoiceService } from './shared/services/invoice.service';
import { BrowserModule } from '@angular/platform-browser';
import { AppCustomPreloader } from './app-preload.module';





@NgModule({
  declarations: [
    AppComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    FontAwesomeModule,
    SidebarModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
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


  ],
  providers: [NotificationService, AuthGuard, UserService, SalesService, TeamsService, CustomaryService,
              SalesCategoryService, ProjectsService, UserSalesStagesService, ClientService, SpinnerService,
              CalendarEventService, SalesNoteService, DocPadService, InvoiceService, AppCustomPreloader ],
  bootstrap: [AppComponent]
})
export class AppModule { }
