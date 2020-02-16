import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import 'dhtmlx-gantt';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-gantt',
  // templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.sass'],
  template: `<div #gantt_here class='gantt-chart'></div>`,

})
export class GanttComponent implements OnInit {


  constructor(
    private projectsService: ProjectsService,
    private notifyService: NotificationService
  ) { gantt.config.columns = []; }

// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand





@ViewChild('gantt_here') ganttContainer: ElementRef;
public oppennedProject;






  ngOnInit() {



    gantt.init(this.ganttContainer.nativeElement);

    Promise.all([this.projectsService.getGanttProject(window.localStorage.getItem('projectOnEditId')), this.projectsService.getLink()])
          .then(([data, links]) => {
            gantt.parse({data, links});
    });



// ---
  }







// ====
}
