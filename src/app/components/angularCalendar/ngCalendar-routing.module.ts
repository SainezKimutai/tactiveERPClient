import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgCalendarComponent } from './ngCalendar.component';

const routes: Routes = [

    { path: '', component: NgCalendarComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NgCalendarRoutingModule { }
