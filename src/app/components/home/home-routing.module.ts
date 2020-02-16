import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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




// tslint:disable: max-line-length
const routes: Routes = [

    { path: '', component: HomeComponent,
      children: [
        { path: '', component: MainDashboardComponent},
        { path: 'main_dashboard', component: MainDashboardComponent},
        { path: 'sales_dashboard', component: SalesDashboardComponent},
        { path: 'projects_dashboard', component: ProjectsDashboardComponent},

        { path: 'document', component: DocumentBoardComponent},
        { path: 'notepad', component: DocumentPadComponent},

        { path: 'editorial', component: ProjTaskTeamComponent},
        { path: 'edit_editorial', component: CustomServiceEditComponent},

        { path: 'invoice', component: InvoiceBoardComponent},

        { path: 'sales_board', component: SalesBoardComponent},
        { path: 'sales_edit', component: SalesEditComponent},

        { path: 'project_edit', component: EditProjectComponent},
        { path: 'projects', component: ProjectBoardsComponent},
        { path: 'project_details', component: ProjectDetailsComponent},
        { path: 'project_update', component: UpdateProjectComponent},

        { path: 'users', component: UsersComponent},

        { path: 'ngCalendar', component: NgCalendarComponent},

        { path: 'inventoryStock', component: InventoryStockComponent},
        { path: 'inventoryPO', component: InventoryPurchaseOrderComponent},
        { path: 'inventoryOrder', component: InventoryOrderComponent},
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }






// const routes: Routes = [

//   { path: '', component: HomeComponent,
//     children: [
//       { path: '', loadChildren: 'src/plugins/dashboard/mainDashboard/mainDashboard.module#MainDashboardModule'},
//       { path: 'main_dashboard', loadChildren: 'src/plugins/dashboard/mainDashboard/mainDashboard.module#MainDashboardModule'},
//       { path: 'sales_dashboard', loadChildren: 'src/plugins/dashboard/salesDashboard/salesDashboard.module#SalesDashboardModule'},
//       { path: 'projects_dashboard', loadChildren: 'src/plugins/dashboard/projectsDashboard/projectsDashboard.module#ProjectsDashboardModule'},

//       { path: 'document', loadChildren: 'src/plugins/document/document-board/document-board.module#DocumentBoardModule'},
//       { path: 'notepad', loadChildren: 'src/plugins/document/document-pad/document-pad.module#DocumentPadModule'},

//       { path: 'editorial', loadChildren: 'src/plugins/editorial/proj-task-team/proj-task-team.module#ProjTaskTeamModule'},
//       { path: 'edit_editorial', loadChildren: 'src/plugins/editorial/custom-service-edit/custom-service-edit.module#CustomServiceEditModule'},

//       { path: 'invoice', loadChildren: 'src/plugins/invoice/invoice-board/invoice-board.module#InvoiceModule'},

//       { path: 'sales_board', loadChildren: 'src/plugins/sales/sales-board/sales-board.module#SalesBoardModule'},
//       { path: 'sales_edit', loadChildren: 'src/plugins/sales/sales-edit/sales-edit.module#SalesEditModule'},

//       { path: 'project_edit', loadChildren: 'src/plugins/projects/edit-project/edit-project.module#ProjectEditModule'},
//       { path: 'projects', loadChildren: 'src/plugins/projects/project-boards/project-boards.module#ProjectBoardModule'},
//       { path: 'project_details', loadChildren: 'src/plugins/projects/project-details/project-details.module#ProjectDetailsModule'},
//       { path: 'project_update', loadChildren: 'src/plugins/projects/update-project/update-project.module#UpdateProjectModule'},

//       { path: 'users', loadChildren: 'src/app/components/users/users.module#UsersModule' },

//       { path: 'ngCalendar', loadChildren: 'src/app/components/angularCalendar/ngCalendar.module#NgCalendarModule'},

//       { path: 'inventoryStock', loadChildren: 'src/plugins/inventory/inventory-stock/inventory-stock.module#InventoryStockModule'},
//       { path: 'inventoryPO', loadChildren: 'src/plugins/inventory/inventory-purchaseOrder/inventory-purchaseOrder.module#InventoryPurchaseOrderModule'},
//       { path: 'inventoryOrder', loadChildren: 'src/plugins/inventory/inventory-order/inventory-order.module#InventoryOrderModule'}
//     ]
// }

// ];



