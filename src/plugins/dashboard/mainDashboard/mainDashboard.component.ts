import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faProjectDiagram, faUsers, faEdit, faChartLine, faDollarSign, faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { SalesService } from 'src/app/shared/services/sales.service';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { SalesCategoryService } from 'src/app/shared/services/sales-category.service';
import { TeamsService } from 'src/app/shared/services/teams.service';
import { CustomaryService } from 'src/app/shared/services/customary.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-maindashboard',
  templateUrl: './mainDashboard.component.html',
  styleUrls: ['./mainDashboard.component.sass']
})
export class MainDashboardComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private salesService: SalesService,
    private projectsService: ProjectsService,
    private userService: UserService,
    private salesCategoryService: SalesCategoryService,
    private teamsService: TeamsService,
    private customService: CustomaryService,
  ) { }
// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand

public mainDashboard;
public salesDashboard;
public projectsDashboard;



  // Icons
public faProjectDiagram = faProjectDiagram;
public faUsers = faUsers;
public faEdit = faEdit;
public faChartLine = faChartLine;
public faDollarSign = faDollarSign;
public faCloudDownloadAlt = faCloudDownloadAlt;



radioModel = 'Month';
public myInterval: any;

// data Variables
public SalesCategorys: Array<any>;
public Opportunitys: Array<any>;
public Projects: Array<any>;
public TotalProjectsRevenue;
public CustomServices: Array<any>;
public Teams: Array<any>;
public Users: Array<any>;


// Sales Chart Variables
public salesType: string;
public salesLabels: Array<any>;
public salesDatasets: Array<any>;
public salesOptions: any;

// Projects Chart Variables
public projectsType: string;
public projectsLabels: Array<any>;
public projectsDatasets: Array<any>;
public projectsOptions: any;

// Revenue Chart Variables
public revenueType: string;
public revenueLabels: Array<any>;
public revenueDatasets: Array<any>;
public revenueOptions: any;

// Clients Chart Variables
public clientsType: string;
public clientsLabels: Array<any>;
public clientsDatasets: Array<any>;
public clientsOptions: any;

// Clients Chart Variables
public targetsType: string;
public targetsLabels: Array<any>;
public targetsDatasets: Array<any>;
public targetsOptions: any;



public MyCustomerCategory;
// Customer Covertion Rate
public CustomerConvertionRate = [];
public ServicesProgressBar = [];
public TeamsScale = [];












  ngOnInit() {

    if (window.localStorage.getItem('permissionStatus') !== 'isAdmin') {
      this.router.navigate(['/sales']);
    }

    window.localStorage.setItem('ActiveNav', 'dashboard');

    this.salesCategoryService.getAllSalesCategories().subscribe(
          categoryData => {this.SalesCategorys = categoryData;
                          let newSalesCategory = this.SalesCategorys.filter(() => true).map(e => e);
                          let reverseSaleaCategory = newSalesCategory.reverse();
                          this.MyCustomerCategory = reverseSaleaCategory[0].name;

                           this.salesService.getAllOppProject().subscribe(
              oppData => {this.Opportunitys = oppData;

                          this.projectsService.getAllProject().subscribe(
                  projectData => {this.Projects = projectData;

                                  this.customService.getAllServices().subscribe(
                      servicesData => {this.CustomServices = servicesData;

                                       this.teamsService.getAllTeams().subscribe(
                            teamsData => {this.Teams = teamsData;
                                       this.userService.getAllUsers().subscribe(
                                      usersData => {this.Users = usersData;

                                          this.salesChartFunction();
                                          this.projectsChartFunction();
                                          this.revenueChartFunction();
                                          this.clientsChartFunction();
                                          this.targetsChartFunction();
                                          this.findCustomerConvertionRate();
                                          this.findOurServicesProgress();
                                          this.findTeamsWeighingScale();

                                          this.TotalProjectsRevenue = this.Projects.reduce((previous, current) =>
                                          previous + current.revenue, 0);



                                  },
                                  error => console.log('Error Getting Users')
                                );
                            },
                            error => console.log('Error Getting Teams')
                          );
                      },
                      error => console.log('Error Getting CustomServices')
                    );

                  },
                  error => console.log('Error Getting Projects')
                );

              },
              error => console.log('Error Getting Opportunities')
            );
          },
          error => console.log('Error Getting SalesCategories')
          );

  }// ngOnInit


  toSalesDashboard() {
    this.router.navigate(['/home/sales_dashboard']);
  }

  toProjectDashboard() {
    this.router.navigate(['/home/projects_dashboard']);
  }





salesChartFunction() {

  this.salesType = 'line';

  this.salesLabels = this.SalesCategorys.filter(() => true).map((e) => e.name);

  this.salesDatasets = [{
      label: 'Opportunty',
      data: this.SalesCategorys.filter(() => true).map((e) => e.totalLeads),
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 0.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'white',
      pointHoverBorderColor: getStyle('--dark')
    }];

  this.salesOptions = {
    title: {
      display: false,
      text: 'Sales',
      fontSize: 25
    },
    legend: {
      display: false,
      position: 'right',
      labels: {
            fontColor: '#00e676'
          }
    },
    layout: {
      padding: 10
    },
    tooltips: {
        enabled: true
    },
    scales: {
      yAxes: [{
          display: false,
          gridLines: {
              drawBorder: false,
              display: false
          },
          stacked: true,
          ticks: {
              beginAtZero: true
          }
      }],
      xAxes: [{
          display: false,
          stacked: true,
          gridLines: {
              drawBorder: true,
              display: false
          },
          ticks: {
            beginAtZero: false
          }
      }]
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: Math.round,
            font: { weight: 'bold'}
        }
    }
  };

}






projectsChartFunction() {

  this.projectsType = 'line';

  this.projectsLabels = this.CustomServices.filter(() => true).map((e) => e.serviceName);
  this.projectsLabels.push('Internal Project');

  let ourData = [];

  this.projectsLabels.forEach(service => {
    let getNumber = this.Projects.filter(project => {
        return (project.projectName === service || project.clientName === service) ? true : false;
    }).map(e => e).length;

    ourData.push(getNumber);
  });

  this.projectsDatasets = [{
      label: 'Clients',
      data: ourData,
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 0.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'white',
      pointHoverBorderColor: getStyle('--dark')
    }];

  this.projectsOptions = {
    title: {
      display: false,
      text: 'Sales',
      fontSize: 25
    },
    legend: {
      display: false,
      position: 'right',
      labels: {
            fontColor: '#00e676'
          }
    },
    layout: {
      padding: 10
    },
    tooltips: {
        enabled: true
    },
    scales: {
      yAxes: [{
          display: false,
          gridLines: {
              drawBorder: false,
              display: false
          },
          stacked: true,
          ticks: {
              beginAtZero: true
          }
      }],
      xAxes: [{
          display: false,
          stacked: true,
          gridLines: {
              drawBorder: true,
              display: false
          },
          ticks: {
            beginAtZero: false
          }
      }]
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: Math.round,
            font: { weight: 'bold'}
        }
    }
  };




}
// --






revenueChartFunction() {

  this.revenueType = 'line';

  this.revenueLabels = this.CustomServices.filter(() => true).map((e) => e.serviceName);

  let ourData = [];

  this.projectsLabels.forEach(service => {
    let getProjects = this.Projects.filter(project => {
        return project.projectName === service ? true : false;
    }).map(e => e);

    let getTotalRevenue = getProjects.reduce((previous, current) => previous + current.revenue, 0);

    ourData.push(getTotalRevenue);
  });


  this.revenueDatasets = [{
      label: 'Revenue',
      data: this.SalesCategorys.filter(() => true).map((e) => e.totalRevenue),
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 0.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'white',
      pointHoverBorderColor: getStyle('--dark')
    }];

  this.revenueOptions = {
    title: {
      display: false,
      text: 'Sales',
      fontSize: 25
    },
    legend: {
      display: false,
      position: 'right',
      labels: {
            fontColor: '#00e676'
          }
    },
    layout: {
      padding: 10
    },
    tooltips: {
        enabled: true
    },
    scales: {
      yAxes: [{
          display: false,
          gridLines: {
              drawBorder: false,
              display: false
          },
          stacked: true,
          ticks: {
              beginAtZero: true
          }
      }],
      xAxes: [{
          display: false,
          stacked: true,
          gridLines: {
              drawBorder: true,
              display: false
          },
          ticks: {
            beginAtZero: false
          }
      }]
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: Math.round,
            font: { weight: 'bold'}
        }
    }
  };


}
// ---


clientsChartFunction() {

  this.clientsType = 'bar';

  // Get Get Clients
  let getOurClients =  this.Opportunitys.filter((opp) => opp.projectStatus === this.MyCustomerCategory).map(e => e.clientName);

  this.clientsLabels = Array.from(new Set(getOurClients));

  let ourData = [];

  this.clientsLabels.forEach(client => {
    let getOpp = this.Opportunitys.filter(opp => {
        return (opp.clientName === client && opp.projectStatus === this.MyCustomerCategory) ? true : false;
    }).map(e => e);

    let getTotalRevenue = getOpp.reduce((previous, current) => previous + current.revenue, 0);

    ourData.push(getTotalRevenue);
  });


  this.clientsDatasets = [{
      label: 'Revenue',
      data: ourData,
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'white',
      borderWidth: 0.5,
      hoverBackgroundColor: 'rgba(255,255,255,.2)',
      hoverBorderColor: getStyle('--dark')
    }];

  this.clientsOptions = {
    title: {
      display: false,
      text: 'Sales',
      fontSize: 25
    },
    legend: {
      display: false,
      position: 'right',
      labels: {
            fontColor: '#00e676'
          }
    },
    layout: {
      padding: 10
    },
    tooltips: {
        enabled: true
    },
    scales: {
      yAxes: [{
          display: false,
          gridLines: {
              drawBorder: false,
              display: false
          },
          stacked: true,
          ticks: {
              beginAtZero: true
          }
      }],
      xAxes: [{
          display: false,
          stacked: true,
          gridLines: {
              drawBorder: true,
              display: false
          },
          ticks: {
            beginAtZero: true
          }
      }]
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: Math.round,
            font: { weight: 'bold'}
        }
    }
  };

}
// --







targetsChartFunction() {

  this.targetsType = 'line';


  this.targetsLabels = this.CustomServices.filter(() => true).map((e) => e.serviceName);

  let ourProjectNumberData = [];

  this.targetsLabels.forEach(service => {
    let getNumber = this.Projects.filter(project => {
        return project.projectName === service ? true : false;
    }).map(e => e).length;

    ourProjectNumberData.push(getNumber);
  });


  let ourProjectRevenueData = [];

  this.targetsLabels.forEach(service => {
    let getProjects = this.Projects.filter(project => {
        return project.projectName === service ? true : false;
    }).map(e => e);

    let getTotalRevenue = getProjects.reduce((previous, current) => previous + current.revenue, 0);

    ourProjectRevenueData.push(getTotalRevenue);
  });


  let ourTargetRevenueData = this.CustomServices.filter(() => true).map((e) => e.targetRevenue);

  this.targetsDatasets = [

    {
      label: 'Total Rev',
      data: ourProjectRevenueData,
      backgroundColor: hexToRgba(getStyle('--success'), 70),
      borderColor: getStyle('--light'),
      borderWidth: 1,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: getStyle('--primary'),
      pointBorderColor: getStyle('--primary'),
      pointHoverBorderColor: getStyle('--dark')
    }

  ];

  this.targetsOptions = {
    title: {
      display: false,
      text: 'Sales',
      fontSize: 25
    },
    legend: {
      display: false,
      position: 'right',
      labels: {
            fontColor: '#00e676'
          }
    },
    layout: {
      padding: 10,
    },
    tooltips: {
      enabled: true
    },
    scales: {
      yAxes: [{
          display: false,
          gridLines: {
              drawBorder: false,
              display: false
          },
          stacked: false,
          ticks: {
              beginAtZero: false
          }
      }],
      xAxes: [{
          display: true,
          stacked: false,
          gridLines: {
              drawBorder: true,
              display: false
          },
          ticks: {
            beginAtZero: false
          }
      }]
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: Math.round,
            font: { weight: 'bold'}
        }
    }
  };

}









findCustomerConvertionRate() {

  let CategoryNumber = this.SalesCategorys.length;
  let IncrementalNumber = 100 / Number(CategoryNumber);

  this.Opportunitys.forEach(Opp => {
    let oppRate = 0;
    for (let x = 0; x < CategoryNumber; x++) {
      oppRate += IncrementalNumber;
      if (Opp.projectStatus === this.SalesCategorys[x].name) {
        let dataToSend = {
          clientName: Opp.clientName,
          projectName: Opp.projectName,
          rate: oppRate
          };
        this.CustomerConvertionRate.push(dataToSend);
      }
    }

  });


  this.CustomerConvertionRate.sort((a, b) =>  a.rate - b.rate);

}




findOurServicesProgress() {

  this.CustomServices.forEach(service => {
    let serviceDeals = this.Opportunitys.filter(opp => (opp.projectStatus === this.MyCustomerCategory && opp.projectName === service.serviceName) ).map(e => e);
    let serviceRevenue = serviceDeals.reduce((previous, current) => previous + current.revenue, 0);
    let serviceNumber = serviceDeals.length;
    let dataToPush = {
      name: service.serviceName,
      number: serviceNumber,
      revenue: serviceRevenue
    }
    this.ServicesProgressBar.push(dataToPush);
  });

  this.ServicesProgressBar.sort((a, b) =>  b.revenue - a.revenue);
}








findTeamsWeighingScale() {
  this.Users.forEach(user => {
    
    let UserProjects = this.Projects.filter(prj => prj.projectManager === user.name).map(e => e);

    if (UserProjects.length !== 0) {
      let dataToPush = {
        name: user.name,
        department: user.department,
        number: UserProjects.length
      }

      this.TeamsScale.push(dataToPush);
    }

  });


this.TeamsScale.sort((a, b) =>  b.number - a.number);
}











// On Destroy
ngOnDestroy() {
  clearInterval(this.myInterval);
}



// === end
}
// ======









