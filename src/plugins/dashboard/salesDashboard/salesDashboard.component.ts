import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { faDiceD6, faChartLine, faNetworkWired, faProjectDiagram, faUsers, faEdit, faShoppingCart,
  faDollarSign, faCloudDownloadAlt, faWallet } from '@fortawesome/free-solid-svg-icons';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { SalesService } from 'src/app/shared/services/sales.service';
import { SalesCategoryService } from 'src/app/shared/services/sales-category.service';
import { CustomaryService } from 'src/app/shared/services/customary.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { UserService } from 'src/app/shared/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';



@Component({
    selector: 'app-sales-dashboard',
    templateUrl: './salesDashboard.component.html',
    styleUrls: ['./salesDashboard.component.sass']
  })
export class SalesDashboardComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private salesService: SalesService,
    private salesCategoryService: SalesCategoryService,
    private customService: CustomaryService,
    private clientService: ClientService,
    private userService: UserService,
    private notifyService: NotificationService,
  ) { }

// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand
// tslint:disable: max-line-length

  // Modal
  @ViewChild('OppDetailModal') public OppDetailModal: ModalDirective;
  @ViewChild('PipeLineDetailModal') public PipeLineDetailModal: ModalDirective;
  @ViewChild('ServiceDetailModal') public ServiceDetailModal: ModalDirective;
  @ViewChild('ClientDetailModal') public ClientDetailModal: ModalDirective;

  public MyClients: any [];
  public MyCustomServices: any [];
  public OppOpenned;
  public PipeLineOppenned;
  public ServiceOppenned;
  public ClientOppenned;


// Font Awesome
public faChartLine = faChartLine;
public faDiceD6 = faDiceD6;
public faNetworkWired = faNetworkWired;
public faProjectDiagram = faProjectDiagram;
public faUsers = faUsers;
public faEdit = faEdit;
public faShoppingCart = faShoppingCart;
public faDollarSign = faDollarSign;
public faCloudDownloadAlt = faCloudDownloadAlt;
public faWallet = faWallet;



// Colors
public colorSuccess = getStyle('--success');
public colorPrimary = getStyle('--primary');
public colorInfo = getStyle('--info');
public colorWarning = getStyle('--warning');
public colorDark = getStyle('--dark');
public colorLight = getStyle('--light');
public colorSecondary = getStyle('--secondary');
public colorTransparent = 'transparent';

public brandPrimary = '#20a8d8';
public brandSecondary = '#c8ced3';
public brandSuccess = '#4dbd74';
public brandDanger = '#f86c6b';
public brandWarning = '#ffc107';
public brandInfo = '#63c2de';
public brandLight = '#f0f3f5';
public brandDark = '#2f353a';


// status
public styleSectionStatus;

// Defines DataSets Status
public definedDataSet;

// data Variables
public SalesCategorys: Array<any>;
public Opportunitys: Array<any>;
public TotalExpectedRevenue: any;
public CustomServices: Array<any>;
public Teams: Array<any>;
public Clients: any [];
public Users: any [];



// Chart Variables
public chartType: string;
public chartLabels: Array<any>;
public chartDatasets: Array<any>;
public chartOptions: any;


// Lables Variables
public labelGeneralsalesCategories;
public labelClients;
public labelCustomServices: Array<any>;
public labelOpportunitys;
public labelSalesUsers: any [];
public labelTeams: Array<any>;


// DataSet Variables
public datasetTargetRevenue;
public datasetRevenue;
public datasetOppNumberForService;
public datasetRevenueBgColorForServices = [];

public datasetOpportunitys;
public dataSetOpportunitysForSalesCat;
public dataSetOpportunityRevenueSalesCat;
public datasetOpportunityBgColorForSalesCat = [];


public dataSetOpportunityRevenueForClients;
public dataSetOpportunityNumberForClients;
public datasetOpportunityBgColorForClients = [];

public dataSetOpportunityRevenueForOpps;
public dataSetOpportunityRevenueForOppsBgColors = [];

public dataSetOpportunityRevenueForSalesUser;
public dataSetOpportunityNumberForSalesUser;
public dataSetOpportunityBgColorForSalesUser = [];

public dataSetTotalTargetRevenue;
public dataSetTotalTargetBgColor = [];
public dataSetTotalRevenue;
public dataSetTotalRevenueBgColor = [];


// Chart Data Bind
// Chart Data Bind
public backgroundColor: string;
public areaColor = this.brandLight;
public areaOpacity = 50;
public lineColor: string;
public pointBorderColor: string;
public displayX: boolean;
public stackedX: boolean;
public dispayGridLinesX: boolean;
public displayY: boolean;
public stackedY: boolean;
public dispayGridLinesY: boolean;
public displayLegend = true;
public legendPosition = 'top';
public legendColor: string;

public chartTypeValue: string;
public chartLablesValue: any;
public chartDatasetValue: any = [];



public myInterval;





// Card 1
public CardsChart = false;
public AllCardChartOptions;
public card1ChartType;
public card1ChartLabels;
public card1ChartDatasets = [];
public card2ChartType;
public card2ChartLabels;
public card2ChartDatasets = [];
public card3ChartType;
public card3ChartLabels;
public card3ChartDatasets = [];


// Stats
public MyCustomerCategory;
public TopSectionTotalRevenue;
public TopSectionTargetRevenue;
public TopSectionNewClients;
public TopSectionCurrentCustomers;
public RevenueProgress;
public SalesUserPerformance = [];





ngOnInit() {

  window.localStorage.setItem('ActiveNav', 'dashboard');

  this.clientService.getAllClients().subscribe(
    clientData => {
      this.Clients = clientData;

      this.userService.getAllUsers().subscribe(
        usersData => {
          this.Users = usersData;

          this.salesCategoryService.getAllSalesCategories().subscribe(
            categoryData => {
              this.SalesCategorys = categoryData;
              let newSalesCategory = this.SalesCategorys.filter(() => true).map(e => e);
              let reverseSaleaCategory = newSalesCategory.reverse();
              this.MyCustomerCategory = reverseSaleaCategory[0].name;

              this.salesService.getAllOppProject().subscribe(
                oppData => {
                  this.Opportunitys = oppData;

                  this.customService.getAllServices().subscribe(
                    servicesData => {
                      this.CustomServices = servicesData;

                      this.set_services_vs_revenue();

                      this.CalculateMyData();

                      this.setCardsDats();
                    },
                    error => console.log('Error listing CustomServices'));

                },
                error => console.log('Error listing Opportunitys'));
            },
            error => console.log('Error listing SalesCategorys'));
        },
        error => console.log('Error Getting Users')
      );

    },
    error => console.log('Error Getting Clients')
  );


  this.myInterval = setInterval(() => {
    this.updatePage();
  }, 120000); // 2 min


} // ngOnInit()







toMainDashboard() {
  this.router.navigate(['/home/main_dashboard']);
}

toProjectDashboard() {
  this.router.navigate(['/home/projects_dashboard']);
}






 updatePage() {
  // listing
  this.clientService.getAllClients().subscribe(
    data => {this.Clients = data; },
    error => console.log('Error getting Clients')
  );

  this.userService.getAllUsers().subscribe(
        data => {this.Users = data; },
        error => console.log('Error getting Users')
      );

  this.salesCategoryService.getAllSalesCategories().subscribe(
      categoryData => {
        this.SalesCategorys = categoryData;
        let newSalesCategory = this.SalesCategorys.filter(() => true).map(e => e);
        let reverseSaleaCategory = newSalesCategory.reverse();
        this.MyCustomerCategory = reverseSaleaCategory[0].name;
      },
      error => console.log('Error getting SalesCategorys'));

  this.salesService.getAllOppProject().subscribe(
      oppData => {this.Opportunitys = oppData; },
      error => console.log('Error getting Opportunitys'));

  this.customService.getAllServices().subscribe(
      servicesData => { this.CustomServices = servicesData; },
      error => console.log('Error getting CustomServices'));
 }// updatePage









showOppDetail(id) {
  this.Opportunitys.forEach((opp) => {
    return opp._id === id ?
    (
      this.Users.forEach((user) => {
          if (user.email === opp.createdBy) {
            opp = {...opp, createdByUsername: user.name};
            this.OppOpenned = opp;
            this.OppDetailModal.show();
          }
      })) : '';
  });
}

showCategoryDetail(id) {

  this.SalesCategorys.forEach((category) => {

    if ( category._id === id) {
      let OppInThisCategory = this.Opportunitys.filter((opp) => {
        return opp.projectStatus === category.name ? true : false;
      }).map((e) => `${e.clientName} - ${e.projectName}` );
      this.PipeLineOppenned = {
        name: category.name,
        totalDeals : category.totalLeads,
        totalRevenue : category.totalRevenue,
        deals: OppInThisCategory
      };
      this.PipeLineDetailModal.show();
    }
  });
}

showServiceDetail(id) {
  this.MyCustomServices.forEach((service) => {
    return service._id === id ? (this.ServiceOppenned = service, this.ServiceDetailModal.show()) : '';
  });

}

showClientDetail(id) {
  this.MyClients.forEach((client) => {
    return client._id === id ? (this.ClientOppenned = client, this.ClientDetailModal.show()) : '';
  });
}













CalculateMyData() {
this.MyClients = [];
this.Clients.forEach((client) => {

    let OppForThisClient = this.Opportunitys.filter((opp) => {
      return opp.clientName === client.companyName ? true : false;
    }).map((e) => e );

    let myClientData = {
      _id: client._id,
      companyName: client.companyName,
      totalRevenue: OppForThisClient.reduce( (previous, current) => previous + current.revenue, 0),
      totalDeals: OppForThisClient.length,
      deals: OppForThisClient.filter((opp) => true).map((e) => e.projectName )
    };

    this.MyClients.push(myClientData);

});

this.MyCustomServices = [];

this.CustomServices.forEach((service) => {

  let OppForThisService = this.Opportunitys.filter((opp) => {
    return opp.projectName === service.serviceName ? true : false;
  }).map((e) => e );

  let myServiceData = {
    _id: service._id,
    serviceName: service.serviceName,
    targetRevenue: service.targetRevenue,
    totalRevenue: OppForThisService.reduce( (previous, current) => previous + current.revenue, 0),
    totalDeals: OppForThisService.length,
    deals: OppForThisService.filter((opp) => true).map((e) => `${e.clientName} - ${e.projectName}` )
  };

  this.MyCustomServices.push(myServiceData);

});

}



getRandomColor() {
  let letters = '0123456789ABCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


settingData() {
return new Promise((resolve, reject) => {


// Lables
this.labelGeneralsalesCategories = this.SalesCategorys.filter(() => true).map((e) => e.name);

this.labelClients =  this.Clients.filter(() => true).map(e => e.companyName);

this.labelCustomServices = this.CustomServices.filter(() => true).map((e) => e.serviceName);

this.labelOpportunitys = this.Opportunitys.filter(() => true).map(e => `${e.clientName}-${e.projectName}`);

this.labelSalesUsers = [];
this.Users.forEach((user) => {
    this.Opportunitys.forEach((opp) => {
      if (opp.createdBy === user.email) {
        return this.labelSalesUsers.indexOf(user.name) === -1 ? this.labelSalesUsers.push(user.name) : '';
      }
    });
  });


// Service
let ourTargetRevenueData = this.CustomServices.filter(() => true).map((e) => e.targetRevenue);
this.datasetTargetRevenue = {
    label: 'Target Rev',
    data: ourTargetRevenueData,
    backgroundColor: hexToRgba(this.areaColor, this.areaOpacity),
    borderColor: this.lineColor,
    borderWidth: 1,
    pointBackgroundColor: 'transparent',
    pointHoverBackgroundColor: 'transparent',
    pointBorderColor: this.pointBorderColor,
    pointHoverBorderColor: getStyle('--dark')
  };


this.datasetOpportunitys = {
    label: 'Opportunty',
    data: this.SalesCategorys.filter(() => true).map((e) => e.totalLeads),
    backgroundColor: hexToRgba(this.areaColor, this.areaOpacity),
    borderColor: this.lineColor,
    borderWidth: 1,
    pointBackgroundColor: 'transparent',
    pointHoverBackgroundColor: 'transparent',
    pointBorderColor: this.pointBorderColor,
    pointHoverBorderColor: getStyle('--dark')

};

let OppNumberForService = [];
this.labelCustomServices.forEach(service => {
  let myOpp = this.Opportunitys.filter(project => {
      return project.projectName === service ? true : false;
  }).map(e => e);

  OppNumberForService.push(myOpp.length);
});


this.datasetOppNumberForService = {
  label: 'Opportunty',
  data: OppNumberForService,
  backgroundColor: hexToRgba(this.areaColor, this.areaOpacity),
  borderColor: this.lineColor,
  borderWidth: 1,
  pointBackgroundColor: 'transparent',
  pointHoverBackgroundColor: 'transparent',
  pointBorderColor: this.pointBorderColor,
  pointHoverBorderColor: getStyle('--dark')
};


this.datasetRevenueBgColorForServices = [];
this.labelCustomServices.forEach((e) => {
  this.datasetRevenueBgColorForServices.push(this.getRandomColor());
});

let serviceData = [];
this.labelCustomServices.forEach(service => {
  let getOpp = this.Opportunitys.filter(project => {

      return project.projectName === service ? true : false;

  }).map(e => e);

  let getTotalRevenue = getOpp.reduce((previous, current) => previous + current.revenue, 0);
  serviceData.push(getTotalRevenue);
});

this.datasetRevenue = {
    label: 'Revenue',
    data: serviceData,
    backgroundColor: hexToRgba(this.areaColor, this.areaOpacity),
    borderColor: this.lineColor,
    borderWidth: 1,
    pointBackgroundColor: 'transparent',
    pointHoverBackgroundColor: 'transparent',
    pointBorderColor: this.pointBorderColor,
    pointHoverBorderColor: getStyle('--dark')
  };






// Sales categories
let OpportunitysForSalesCat = [];
this.labelGeneralsalesCategories.forEach((category) => {

        let OppInThisCategory = this.Opportunitys.filter((opp) => {
          return opp.projectStatus === category ? true : false;
        }).map((e) => e );
        OpportunitysForSalesCat.push(OppInThisCategory.length);
});

this.dataSetOpportunitysForSalesCat = {
    label: 'Opportunity Number',
    data: OpportunitysForSalesCat,
    backgroundColor: hexToRgba(this.areaColor, this.areaOpacity),
    borderColor: this.lineColor,
    borderWidth: 1,
    pointBackgroundColor: 'transparent',
    pointHoverBackgroundColor: 'transparent',
    pointBorderColor: this.pointBorderColor,
    pointHoverBorderColor: getStyle('--dark')
};


this.datasetOpportunityBgColorForSalesCat = [];
this.labelGeneralsalesCategories.forEach((e) => {
  this.datasetOpportunityBgColorForSalesCat.push(this.getRandomColor());
});

let OpportunityRevenueSalesCat = [];
this.labelGeneralsalesCategories.forEach((category) => {

        let OppInThisCategory = this.Opportunitys.filter((opp) => {
          return opp.projectStatus === category ? true : false;
        }).map((e) => e );
        OpportunityRevenueSalesCat.push(OppInThisCategory.reduce( (previous, current) => previous + current.revenue, 0));
});

this.dataSetOpportunityRevenueSalesCat = {
  label: 'Opportunity T Revenue',
  data: OpportunityRevenueSalesCat,
  backgroundColor: hexToRgba(this.areaColor, this.areaOpacity),
  borderColor: this.lineColor,
  borderWidth: 1,
  pointBackgroundColor: 'transparent',
  pointHoverBackgroundColor: 'transparent',
  pointBorderColor: this.pointBorderColor,
  pointHoverBorderColor: getStyle('--dark')
};





// Clients vs opp number vs opp revenue
let OpportunityRevenueForClients = [];
this.labelClients.forEach((client) => {

        let OppInThisCategory = this.Opportunitys.filter((opp) => {
          return opp.clientName === client ? true : false;
        }).map((e) => e );
        OpportunityRevenueForClients.push(OppInThisCategory.reduce( (previous, current) => previous + current.revenue, 0));
});

this.datasetOpportunityBgColorForClients = [];
this.labelClients.forEach((e) => {
  this.datasetOpportunityBgColorForClients.push(this.getRandomColor());
});

this.dataSetOpportunityRevenueForClients = {
  label: 'Opp Revenue',
  data: OpportunityRevenueForClients,
  backgroundColor: hexToRgba(this.areaColor, this.areaOpacity),
  borderColor: this.lineColor,
  borderWidth: 1,
  pointBackgroundColor: 'transparent',
  pointHoverBackgroundColor: 'transparent',
  pointBorderColor: this.pointBorderColor,
  pointHoverBorderColor: getStyle('--dark')
};


let OpportunityNumberForClients = [];
this.labelClients.forEach((client) => {

        let OppInThisCategory = this.Opportunitys.filter((opp) => {
          return opp.clientName === client ? true : false;
        }).map((e) => e );
        OpportunityNumberForClients.push(OppInThisCategory.length);
});

this.dataSetOpportunityNumberForClients = {
  label: 'Opp Number',
  data: OpportunityNumberForClients,
  backgroundColor: hexToRgba(this.areaColor, this.areaOpacity),
  borderColor: this.lineColor,
  borderWidth: 1,
  pointBackgroundColor: 'transparent',
  pointHoverBackgroundColor: 'transparent',
  pointBorderColor: this.pointBorderColor,
  pointHoverBorderColor: getStyle('--dark')
};














// Opportunity
let OpportunityRevenueForOpps = this.Opportunitys.filter(() => true).map(e => e.revenue);

this.dataSetOpportunityRevenueForOppsBgColors = [];
OpportunityRevenueForOpps.forEach((e) => {
  this.dataSetOpportunityRevenueForOppsBgColors.push(this.getRandomColor());
});

this.dataSetOpportunityRevenueForOpps = {
  label: 'Opp Revenue',
  data: OpportunityRevenueForOpps,
  backgroundColor:  hexToRgba(this.areaColor, this.areaOpacity),
  borderColor: this.lineColor,
  fillColor : this.getRandomColor(),
  borderWidth: 1,
  pointBackgroundColor: 'transparent',
  pointHoverBackgroundColor: 'transparent',
  pointBorderColor: this.pointBorderColor,
  pointHoverBorderColor: getStyle('--dark')
};




let OpportunityRevenueForSalesUser = [];

this.labelSalesUsers.forEach((saleUser) => {
  this.Users.forEach((user) => {
    if (saleUser === user.name) {
      let getOpp = this.Opportunitys.filter((opp) => {
        return opp.createdBy === user.email ? true : false;
      }).map((e) => e );
      OpportunityRevenueForSalesUser.push(getOpp.reduce( (previous, current) => previous + current.revenue, 0));
    }
  });
});

this.dataSetOpportunityRevenueForSalesUser = {
  label: 'Revenue',
  data: OpportunityRevenueForSalesUser,
  backgroundColor:  hexToRgba(this.areaColor, this.areaOpacity),
  borderColor: this.lineColor,
  fillColor : this.getRandomColor(),
  borderWidth: 1,
  pointBackgroundColor: 'transparent',
  pointHoverBackgroundColor: 'transparent',
  pointBorderColor: this.pointBorderColor,
  pointHoverBorderColor: getStyle('--dark')
};


this.dataSetOpportunityBgColorForSalesUser = [];
this.labelSalesUsers.forEach((e) => {
  this.dataSetOpportunityBgColorForSalesUser.push(this.getRandomColor());
});

let OpportunityNumberForSalesUser = [];


this.labelSalesUsers.forEach((saleUser) => {
  this.Users.forEach((user) => {
      if (saleUser === user.name) {
    let getOpp = this.Opportunitys.filter((opp) => {
      return opp.createdBy === user.email ? true : false;
    }).map((e) => e );
    OpportunityNumberForSalesUser.push(getOpp.length);
  }
  });
});

this.dataSetOpportunityNumberForSalesUser = {
  label: 'Number',
  data: OpportunityNumberForSalesUser,
  backgroundColor:  hexToRgba(this.areaColor, this.areaOpacity),
  borderColor: this.lineColor,
  fillColor : this.getRandomColor(),
  borderWidth: 1,
  pointBackgroundColor: 'transparent',
  pointHoverBackgroundColor: 'transparent',
  pointBorderColor: this.pointBorderColor,
  pointHoverBorderColor: getStyle('--dark')
};







// Totals

this.dataSetTotalTargetBgColor = [];
this.dataSetTotalTargetBgColor.push(this.getRandomColor());


let TotalTargetRevenue = this.CustomServices.reduce( (previous, current) => previous + current.targetRevenue, 0);
this.dataSetTotalTargetRevenue = {
  label: 'Target',
  data: [TotalTargetRevenue],
  backgroundColor:  hexToRgba(this.areaColor, this.areaOpacity),
  borderColor: this.lineColor,
  fillColor : this.getRandomColor(),
  borderWidth: 1,
  pointBackgroundColor: 'transparent',
  pointHoverBackgroundColor: 'transparent',
  pointBorderColor: this.pointBorderColor,
  pointHoverBorderColor: getStyle('--dark')
};

this.dataSetTotalRevenueBgColor = [];
this.dataSetTotalRevenueBgColor.push(this.getRandomColor());


let TotalRevenue = this.Opportunitys.filter(opp => opp.projectStatus === this.MyCustomerCategory).map(e => e).reduce( (previous, current) => previous + current.revenue, 0);
this.dataSetTotalRevenue = {
  label: 'Revenue',
  data: [TotalRevenue],
  backgroundColor:  hexToRgba(this.areaColor, this.areaOpacity),
  borderColor: this.lineColor,
  fillColor : this.getRandomColor(),
  borderWidth: 1,
  pointBackgroundColor: 'transparent',
  pointHoverBackgroundColor: 'transparent',
  pointBorderColor: this.pointBorderColor,
  pointHoverBorderColor: getStyle('--dark')
};







resolve();

}); //

}//








chartFunction() {

this.chartType = this.chartTypeValue; // bar, horizontalBar, pie, line, doughnut, radar, polarArea


this.chartLabels = this.chartLablesValue;

this.chartDatasets = this.chartDatasetValue;

this.chartOptions = {
  title: {
    display: false,
    text: 'Sales',
    fontSize: 25
  },
  legend: {
    display: this.displayLegend,
    position: this.legendPosition,
    labels: {
          fontColor: this.legendColor
        }
  },
  layout: {
    padding: 10
  },
  tooltips: {
      enabled: true,
      callbacks: {
        label: (tooltipItem, data) => {
            return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }, },
  },
  scales: {
    yAxes: [{
        display: this.displayY,
        stacked: this.stackedY,
        gridLines: {
            drawBorder: true,
            display: this.dispayGridLinesY
        },

        ticks: {
            beginAtZero: true,
            callback: (value, index, values) => {
              return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        }
    }],
    xAxes: [{
        display: this.displayX,
        stacked: this.stackedX,
        gridLines: {
            drawBorder: true,
            display: this.dispayGridLinesX
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




// Chart Type
changeChartType(chartType) {
  this.chartTypeValue = chartType;
  this.chartFunction();
}


// Labels
setLabelServices() {
  this.displayY = true;
  this.displayX = true;
  this.chartLablesValue = this.labelCustomServices;
  this.chartFunction();
}

setLabelClients() {
  this.displayY = true;
  this.displayX = true;
  this.chartLablesValue = this.labelClients;
  this.chartFunction();
  }

setLabelSalesStages() {
  this.displayY = true;
  this.displayX = true;
  this.chartLablesValue = this.labelGeneralsalesCategories;
  this.chartFunction();
}
setLabelOpportunities() {
  this.displayY = true;
  this.displayX = true;
  this.chartLablesValue = this.labelOpportunitys;
  this.chartFunction();
}
setLabelSalesUsers() {
  this.displayY = true;
  this.displayX = true;
  this.chartLablesValue = this.labelSalesUsers;
  this.chartFunction();
}



// Dataset
setDatasetExpectedRevenue() {

  if (this.chartDatasetValue.indexOf(this.datasetTargetRevenue) === -1) {
    if ( this.chartLablesValue[0] === this.labelCustomServices[0]) {
        this.datasetTargetRevenue.backgroundColor = hexToRgba(this.areaColor, this.areaOpacity);
        this.chartDatasetValue = [ ...this.chartDatasetValue, this.datasetTargetRevenue ];
        this.chartFunction();
    } else {
      this.notifyService.showWarning('You cant form a dataset with that metric', 'Wrong Metric');
    }

  }
}


setDatasetRevenue() {

    if (this.chartLablesValue[0] === this.labelCustomServices[0]) {
      if (this.chartDatasetValue.indexOf(this.datasetRevenue) === -1) {
        this.datasetRevenue.backgroundColor = hexToRgba(this.areaColor, this.areaOpacity);
        this.chartDatasetValue = [ ...this.chartDatasetValue, this.datasetRevenue ];
        this.chartFunction();
      }
    }
    if (this.chartLablesValue[0] === this.labelClients[0]) {
      if (this.chartDatasetValue.indexOf(this.dataSetOpportunityRevenueForClients) === -1) {
      this.dataSetOpportunityRevenueForClients.backgroundColor = hexToRgba(this.areaColor, this.areaOpacity);
      this.chartDatasetValue = [ ...this.chartDatasetValue, this.dataSetOpportunityRevenueForClients ];
      this.chartFunction();
      }
    }
    if (this.chartLablesValue[0] === this.labelGeneralsalesCategories[0]) {
      if (this.chartDatasetValue.indexOf(this.dataSetOpportunityRevenueSalesCat) === -1) {
      this.dataSetOpportunityRevenueSalesCat.backgroundColor = hexToRgba(this.areaColor, this.areaOpacity);
      this.chartDatasetValue = [ ...this.chartDatasetValue, this.dataSetOpportunityRevenueSalesCat ];
      this.chartFunction();
      }
    }
    if (this.chartLablesValue[0] === this.labelOpportunitys[0]) {
      if (this.chartDatasetValue.indexOf(this.dataSetOpportunityRevenueForOpps) === -1) {
      this.dataSetOpportunityRevenueForOpps.backgroundColor = hexToRgba(this.areaColor, this.areaOpacity);
      this.chartDatasetValue = [ ...this.chartDatasetValue, this.dataSetOpportunityRevenueForOpps ];
      this.chartFunction();
      }
    }
    if (this.chartLablesValue[0] === this.labelSalesUsers[0]) {
      if (this.chartDatasetValue.indexOf(this.dataSetOpportunityRevenueForSalesUser) === -1) {
      this.dataSetOpportunityRevenueForSalesUser.backgroundColor = hexToRgba(this.areaColor, this.areaOpacity);
      this.chartDatasetValue = [ ...this.chartDatasetValue, this.dataSetOpportunityRevenueForSalesUser ];
      this.chartFunction();
      }
    }

}


setDatasetOpportunities() {

  if (this.chartLablesValue[0] === this.labelCustomServices[0]) {
    if (this.chartDatasetValue.indexOf(this.datasetOppNumberForService) === -1) {
      this.datasetOppNumberForService.backgroundColor = hexToRgba(this.areaColor, this.areaOpacity);
      this.chartDatasetValue = [ ...this.chartDatasetValue, this.datasetOppNumberForService ];
      this.chartFunction();
    }
  }
  if (this.chartLablesValue[0] === this.labelClients[0]) {
    if (this.chartDatasetValue.indexOf(this.dataSetOpportunityNumberForClients) === -1) {
    this.dataSetOpportunityNumberForClients.backgroundColor = hexToRgba(this.areaColor, this.areaOpacity);
    this.chartDatasetValue = [ ...this.chartDatasetValue, this.dataSetOpportunityNumberForClients ];
    this.chartFunction();
    }
  }
  if (this.chartLablesValue[0] === this.labelGeneralsalesCategories[0]) {
    if (this.chartDatasetValue.indexOf(this.dataSetOpportunitysForSalesCat) === -1) {
    this.dataSetOpportunitysForSalesCat.backgroundColor = hexToRgba(this.areaColor, this.areaOpacity);
    this.chartDatasetValue = [ ...this.chartDatasetValue, this.dataSetOpportunitysForSalesCat ];
    this.chartFunction();
    }
  }
  if (this.chartLablesValue[0] === this.labelOpportunitys[0]) {
    this.notifyService.showWarning('You cant form a dataset with that metric', 'Wrong Metric');
  }
  if (this.chartLablesValue[0] === this.labelSalesUsers[0]) {
    if (this.chartDatasetValue.indexOf(this.dataSetOpportunityNumberForSalesUser) === -1) {
    this.dataSetOpportunityNumberForSalesUser.backgroundColor = hexToRgba(this.areaColor, this.areaOpacity);
    this.chartDatasetValue = [ ...this.chartDatasetValue, this.dataSetOpportunityNumberForSalesUser ];
    this.chartFunction();
    }
  }
}




removeAllDataSets() {
this.chartDatasetValue = [];
this.chartLablesValue = [];
this.definedDataSet = 0;
this.displayY = false;
this.displayX = false;
this.chartFunction();
}



// Predifined
set_services_vs_revenue() {
  this.settingData();
  this.chartTypeValue = 'bar';
  this.backgroundColor = this.brandLight;
  this.displayY = true;
  this.displayX = true;
  this.stackedX = false;
  this.stackedY = false;
  this.displayLegend = true;
  this.legendColor = this.brandDark;
  this.chartLablesValue = this.labelCustomServices;
  this.datasetTargetRevenue.backgroundColor = this.datasetRevenueBgColorForServices;
  this.datasetRevenue.backgroundColor = this.datasetRevenueBgColorForServices;
  this.datasetOppNumberForService.backgroundColor = this.datasetRevenueBgColorForServices;
  this.chartDatasetValue = [this.datasetRevenue ];
  this.chartFunction();
  this.definedDataSet = 1;

}
set_salesStages_vs_revenue() {
  this.settingData();
  this.chartTypeValue = 'bar';
  this.backgroundColor = this.brandLight;
  this.displayY = true;
  this.displayX = true;
  this.stackedX = false;
  this.stackedY = false;
  this.displayLegend = true;
  this.legendColor = this.brandDark;
  this.chartLablesValue = this.labelGeneralsalesCategories;
  this.dataSetOpportunityRevenueSalesCat.backgroundColor = this.datasetOpportunityBgColorForSalesCat;
  this.chartDatasetValue = [this.dataSetOpportunityRevenueSalesCat];
  this.chartFunction();
  this.definedDataSet = 2;
}
set_clients_vs_revenue() {
  this.settingData();
  this.chartTypeValue = 'line';
  this.backgroundColor = this.brandLight;
  this.displayY = true;
  this.displayX = false;
  this.stackedX = false;
  this.stackedY = false;
  this.displayLegend = false;
  this.legendColor = this.brandDark;
  this.chartLablesValue = this.labelClients;
  this.dataSetOpportunityRevenueForClients.backgroundColor = this.brandInfo;
  this.chartDatasetValue = [this.dataSetOpportunityRevenueForClients];
  this.chartFunction();
  this.definedDataSet = 3;
}
set_opportunities_vs__revenue() {
  this.settingData();
  this.chartTypeValue = 'line';
  this.backgroundColor = this.brandLight;
  this.displayY = true;
  this.displayX = false;
  this.stackedX = false;
  this.stackedY = false;
  this.displayLegend = false;
  this.legendColor = this.brandDark;
  this.chartLablesValue = this.labelOpportunitys;
  this.dataSetOpportunityRevenueForOpps.backgroundColor = this.brandWarning;
  this.chartDatasetValue = [this.dataSetOpportunityRevenueForOpps];
  this.chartFunction();
  this.definedDataSet = 4;
}
set_salesUser_vs_opportunities_and_revenue() {
  this.settingData();
  this.chartTypeValue = 'bar';
  this.backgroundColor = this.brandLight;
  this.displayY = true;
  this.displayX = true;
  this.stackedX = false;
  this.stackedY = false;
  this.displayLegend = true;
  this.legendColor = this.brandDark;
  this.chartLablesValue = this.labelSalesUsers;
  this.dataSetOpportunityNumberForSalesUser.backgroundColor = this.dataSetOpportunityBgColorForSalesUser;
  this.chartDatasetValue = [ this.dataSetOpportunityNumberForSalesUser];
  this.chartFunction();
  this.definedDataSet = 5;
}

set_totalRevenue_vs_TargetRevenue() {
  this.settingData();
  this.chartTypeValue = 'bar';
  this.backgroundColor = this.brandLight;
  this.displayY = true;
  this.displayX = true;
  this.stackedX = false;
  this.stackedY = false;
  this.displayLegend = true;
  this.legendColor = this.brandDark;
  this.chartLablesValue = ['TOTALS'];
  this.dataSetTotalRevenue.backgroundColor = this.dataSetTotalRevenueBgColor;
  this.dataSetTotalTargetRevenue.backgroundColor = this.dataSetTotalTargetBgColor;
  this.chartDatasetValue = [this.dataSetTotalRevenue, this.dataSetTotalTargetRevenue];
  this.chartFunction();
  this.definedDataSet = 6;
}



// Styling Functions
bgToPrimary() { this.backgroundColor = this.brandPrimary; }
bgToInfo() { this.backgroundColor = this.brandInfo; }
bgToWarning() { this.backgroundColor = this.brandWarning; }
bgToSuccess() { this.backgroundColor = this.brandSuccess; }
bgToDanger() { this.backgroundColor = this.brandDanger; }
bgToLight() { this.backgroundColor = this.brandLight; }
bgToSecondary() { this.backgroundColor = this.brandSecondary; }

areaToPrimary() { this.areaColor = this.brandPrimary; this.settingData().then(() => {}); }
areaToInfo() { this.areaColor = this.brandInfo; this.settingData().then(() => {}); }
areaToWarning() { this.areaColor = this.brandWarning; this.settingData().then(() => {}); }
areaToSuccess() { this.areaColor = this.brandSuccess; this.settingData().then(() => {}); }
areaToDanger() { this.areaColor = this.brandDanger; this.settingData().then(() => {}); }
areaToLight() { this.areaColor = this.brandLight; this.settingData().then(() => {}); }
areaToSecondary() { this.areaColor = this.brandSecondary; this.settingData().then(() => {}); }

areaOpacityChanged() { this.settingData().then(() => { this.chartFunction(); }); }

lineToPrimary() { this.lineColor = this.colorPrimary; this.settingData().then(() => { }); }
lineToInfo() { this.lineColor = this.colorInfo; this.settingData().then(() => { }); }
lineToWarning() { this.lineColor = this.brandWarning; this.settingData().then(() => { }); }
lineToSuccess() { this.lineColor = this.brandSuccess; this.settingData().then(() => { }); }
lineToDanger() { this.lineColor = this.brandDanger; this.settingData().then(() => { }); }
lineToLight() { this.lineColor = this.brandLight; this.settingData().then(() => { }); }
lineToSecondary() { this.lineColor = this.brandSecondary; this.settingData().then(() => { }); }

pointToPrimary() { this.pointBorderColor = this.colorPrimary; this.settingData().then(() => { }); }
pointToInfo() { this.pointBorderColor = this.colorInfo; this.settingData().then(() => { }); }
pointToWarning() { this.pointBorderColor = this.brandWarning; this.settingData().then(() => { }); }
pointToSuccess() { this.pointBorderColor = this.brandSuccess; this.settingData().then(() => { }); }
pointToDanger() { this.pointBorderColor = this.brandDanger; this.settingData().then(() => { }); }
pointToLight() { this.pointBorderColor = this.brandLight; this.settingData().then(() => { }); }
pointToSecondary() { this.pointBorderColor = this.brandSecondary; this.settingData().then(() => { }); }

displayYaxis() { this.displayY = !this.displayY; this.chartFunction(); }
stackedYaxis() { this.stackedY = !this.stackedY; this.chartFunction(); }
linegridYaxis() { this.dispayGridLinesY = !this.dispayGridLinesY; this.chartFunction(); }

displayXaxis() { this.displayX = !this.displayX; this.chartFunction(); }
stackedXaxis() { this.stackedX = !this.stackedX; this.chartFunction(); }
linegridXaxis() { this.dispayGridLinesY = !this.dispayGridLinesY; this.chartFunction(); }

displayLegendFunction() { this.displayLegend = !this.displayLegend; this.chartFunction(); }
displayLegendTop() { this.legendPosition = 'top'; this.chartFunction(); }
displayLegendRight() { this.legendPosition = 'right'; this.chartFunction(); }
displayLegendBottom() { this.legendPosition = 'bottom'; this.chartFunction(); }
displayLegendLeft() { this.legendPosition = 'left'; this.chartFunction(); }

legendToPrimary() { this.legendColor = this.brandPrimary; this.chartFunction(); }
legendToInfo() { this.legendColor = this.brandInfo; this.chartFunction(); }
legendToWarning() { this.legendColor = this.brandWarning; this.chartFunction(); }
legendToSuccess() { this.legendColor = this.brandSuccess; this.chartFunction(); }
legendToDanger() { this.legendColor = this.brandDanger; this.chartFunction(); }
legendToLight() { this.legendColor = this.brandLight; this.chartFunction(); }
legendToSecondary() { this.legendColor = this.brandSecondary; this.chartFunction(); }























// Cards

setCardsDats() {
















  let serviceData = [];
  this.labelCustomServices.forEach(service => {
    let getOpp = this.Opportunitys.filter(project => {

        return project.projectName === service ? true : false;

    }).map(e => e);

    let getTotalRevenue = getOpp.reduce((previous, current) => previous + current.revenue, 0);
    serviceData.push(getTotalRevenue);
  });

  this.card1ChartType = 'line';
  this.card1ChartLabels = this.labelCustomServices;
  this.card1ChartDatasets = [{
    label: 'Revenue',
    data: serviceData,
    backgroundColor:  hexToRgba(this.brandInfo, 100),
    borderColor: hexToRgba(this.brandInfo, 30),
    borderWidth: 1,
    pointBackgroundColor: 'transparent',
    pointHoverBackgroundColor: 'transparent',
    pointBorderColor: hexToRgba(this.brandInfo, 100),
    pointHoverBorderColor: getStyle('--dark')
  }];



  let OpportunityRevenueSalesCat = [];
  this.labelGeneralsalesCategories.forEach((category) => {

          let OppInThisCategory = this.Opportunitys.filter((opp) => {
            return opp.projectStatus === category ? true : false;
          }).map((e) => e );
          OpportunityRevenueSalesCat.push(OppInThisCategory.reduce( (previous, current) => previous + current.revenue, 0));
  });
  this.card2ChartType = 'line';
  this.card2ChartLabels = this.labelGeneralsalesCategories;
  this.card2ChartDatasets = [{
    label: 'Revenue',
    data: OpportunityRevenueSalesCat,
    backgroundColor:  hexToRgba(this.brandWarning, 100),
    borderColor: hexToRgba(this.brandWarning, 30),
    borderWidth: 1,
    pointBackgroundColor: 'transparent',
    pointHoverBackgroundColor: 'transparent',
    pointBorderColor: hexToRgba(this.brandWarning, 100),
    pointHoverBorderColor: getStyle('--dark')
  }];





  // 
  this.TopSectionTotalRevenue = this.Opportunitys.filter(opp => opp.projectStatus === this.MyCustomerCategory).map(e => e).reduce( (previous, current) => previous + current.revenue, 0);
  this.TopSectionTargetRevenue = this.CustomServices.reduce( (previous, current) => previous + current.targetRevenue, 0);

  // calculate rEvevue progress;
  this.RevenueProgress = (( this.TopSectionTotalRevenue * 100 ) / this.TopSectionTargetRevenue ).toFixed(0);

  this.card3ChartType = 'bar';
  this.card3ChartLabels = ['Current revenue', 'Target Revenue'],
  this.card3ChartDatasets = [{
    label: ['Total'],
    data: [this.TopSectionTotalRevenue, this.TopSectionTargetRevenue],
    backgroundColor:  [hexToRgba(this.brandSuccess, 100) , hexToRgba(this.brandDanger, 100)],
    borderColor: hexToRgba(this.brandDanger, 0),
    borderWidth: 1,
    pointBackgroundColor: 'transparent',
    pointHoverBackgroundColor: 'transparent',
    pointBorderColor: hexToRgba(this.brandDanger, 0),
    pointHoverBorderColor: getStyle('--dark')
  }];


  this.AllCardChartOptions = {
    title: {
      display: false,
      text: 'Sales',
      fontSize: 25
    },

    legend: {
      display: false
    },

    layout: {
      padding: 10
    },
    tooltips: {
        enabled: true,
        callbacks: {
          label: (tooltipItem, data) => {
              return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }, },
    },
    scales: {
      yAxes: [{
          display: false,
          stacked: false,
          gridLines: {
              drawBorder: true,
              display: false
          },

          ticks: {
              beginAtZero: true,
              callback: (value, index, values) => {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }
          }
      }],
      xAxes: [{
          display: false,
          stacked: false,
          gridLines: {
              drawBorder: false,
              display: this.dispayGridLinesX
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




  this.TopSectionNewClients = this.Opportunitys.filter((opp) => opp.projectStatus === this.SalesCategorys[0].name ).map(e => e);
  this.TopSectionCurrentCustomers = this.Opportunitys.filter((opp) => opp.projectStatus === this.SalesCategorys[this.SalesCategorys.length - 1].name ).map(e => e);







  this.labelSalesUsers.forEach((saleUser) => {
    this.Users.forEach((user) => {
        if (saleUser === user.name) {
      let getOpp = this.Opportunitys.filter((opp) => {
        return opp.createdBy === user.email ? true : false;
      }).map((e) => e );
      let sendData = {name: saleUser, number: getOpp.length};
      this.SalesUserPerformance.push(sendData);
    }
    });
  });








  this.CardsChart = true;












} // setCardsDats











ngOnDestroy() {
  clearInterval(this.myInterval);
}


}// End of class SalesDashboardComponent
