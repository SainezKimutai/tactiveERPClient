import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import { debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { InvoiceService } from 'src/app/shared/services/invoice.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { dev } from 'src/app/shared/dev/dev';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HomeComponent } from 'src/app/components/home/home.component';

import * as jspdf from 'jspdf';
import 'jspdf-autotable';


declare let html2canvas: any;

@Component({
    selector: 'app-invoice-board',
    templateUrl: './invoice-board.component.html',
    styleUrls: ['./invoice-board.component.sass']
})
export class InvoiceBoardComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private homeComponent: HomeComponent,
    private formBuilder: FormBuilder,
    private notifyService: NotificationService,
    private spinnerService: SpinnerService,
    private invoiceService: InvoiceService,
    private clientService: ClientService
  ) { }


get formMail() { return this.mailForm.controls; }
// tslint:disable: align
// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand
// tslint:disable: max-line-length

// icons
public faFileInvoice = faFileInvoice;



@ViewChild('deleteModal') public deleteModal: ModalDirective;
@ViewChild('mailModal') public mailModal: ModalDirective;

@ViewChild('customerNameInput') customerNameField: ElementRef;
@ViewChild('paymentTermsInput') paymentTermsField: ElementRef;
@ViewChild('invoiceDateInput') invoiceDateField: ElementRef;
@ViewChild('dueDateInput') dueDateField: ElementRef;
@ViewChild('flightInput') flightInputField: ElementRef;


@ViewChild('textareaInput') textareaField: ElementRef;

public invoiceForm;
public invoiceFormItems;
public invoiceFormAccomodation;
public invoiceFormAirlineInclusion;
public invoiceFormAirlineExclusion;
public mailForm: FormGroup;
public myPDFDataToSend;
public inputArrayFields;
public AccomodationInputArrayFields;
public InclutionInputField;
public ExclutionInputField;

public Items = [];
public AccItems = [];
public InclutionItems = [];
public ExclutionItems = [];

public TotalAmount = 0;
public TotalAccomodationSingle = 0;
public TotalAccomodationDouble = 0;
public TotalAccomodationChild = 0;

public listSectionStatus;
public createSectionStatus;
public viewSectionStatus;

public Invoices = [];
public OurClientNames = [];
public InvoiceToBeDeleted;

public invoiceOnEditId;
public myInvoice1Image;

public invoiceViewed;
public pdfAction;
public myPdfToEmail;

public myDateValue;

public ItineraryForm;
public itineraryFiles;
public ItineraryItems = [];

public myFile = null;
public ItineraryImagesForPost = [];
public ItineraryImagesForRemoval = [];

public myInterval: any;


editorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: 'auto',
  minHeight: '250px',
  maxHeight: 'auto',
  width: 'auto',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: '',
  defaultFontSize: '2',
  fonts: [ {class: 'georgia', name: 'Georgia'}, {class: 'arial', name: 'Arial'}, {class: 'times-new-roman', name: 'Times New Roman'}, {class: 'calibri', name: 'Calibri'}, {class: 'comic-sans-ms', name: 'Comic Sans MS'}],
  customClasses: [{name: 'quote', class: 'quote', }, {name: 'redText', class: 'redText'}, {name: 'titleText', class: 'titleText', tag: 'h1', }, ],
  uploadUrl: 'v1/image',
  sanitize: true,
  toolbarPosition: 'top',
};






















ngOnInit() {

  if (window.localStorage.getItem('permissionStatus') === 'isUser') {
    this.router.navigate(['/sales']);
  }

  window.localStorage.setItem('ActiveNav', 'invoice');

  this.invoiceService.getAllInvoices().subscribe(
    data => {
      this.Invoices = data.reverse();

      // console.log(this.Invoices[0].itinerary);

    },
    error => {console.log('Cannot get all Invoices'); }
  );

  this.clientService.getAllClients().subscribe(
    data => {
      this.OurClientNames = data.filter(() => true).map((e) => e.companyName);
    },
    error => { console.log('Cannot get all clients'); }
  );

  this.toListInvoice();


  this.invoiceForm = {
    invoiceType: 'ticket',
    customerName: '',
    paymentTerms: '',
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    salesPerson: '',
    createdOn: '',
    totalAmount: null
    };

  this.invoiceFormItems = {
      flight: '',
      from: '',
      to: '',
      date: '',
      departure: '',
      arrival: '',
      class: '',
      costPerPerson: null,
      costPerChild: null,
      costPerInfant: null,
      persons: {
        adult: null,
        child: null,
        infant: null
      },
      totalPersons: null,
      totalCost: null,
    };

  this.invoiceFormAccomodation = {
      hotel: '',
      roomType: '',
      mealPlan: '',
      city: '',
      nights: null,
      single: null,
      double: null,
      childWithBed: null
    };
  this.invoiceFormAirlineInclusion = {
      content: ''
    };

  this.invoiceFormAirlineExclusion = {
      content: ''
    };

  this.mailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

  this.ItineraryForm = {
    content: ''
  };



  this.myInterval = setInterval(() => {
    this.updatePage();
  }, 10000); // 10 sec

}// ngOnInit






updatePage() {

  this.invoiceService.getAllInvoices().subscribe(
    data => {
      this.Invoices = data.reverse();
    },
    error => {console.log('Cannot List all Invoices'); }
  );

  this.clientService.getAllClients().subscribe(
    data => {
      this.OurClientNames = data.filter(() => true).map((e) => e.companyName);
    },
    error => { console.log('Cannot list all clients'); }
  );
}







toNewInvoice() {
  this.homeComponent.loadStart();
  this.listSectionStatus = false;
  this.createSectionStatus = true;
  this.viewSectionStatus = false;
  this.invoiceOnEditId = null;

  this.invoiceForm = {
    invoiceType: 'ticket',
    customerName: '',
    paymentTerms: '',
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    salesPerson: '',
    createdOn: '',
    totalAmount: null
    };
  this.invoiceFormItems = {
      flight: '',
      from: '',
      to: '',
      date: '',
      departure: '',
      arrival: '',
      class: '',
      costPerPerson: null,
      costPerChild: null,
      costPerInfant: null,
      persons: {
        adult: null,
        child: null,
        infant: null
      },
      totalPersons: null,
      totalCost: null,
    };

  this.invoiceFormAccomodation = {
      hotel: '',
      roomType: '',
      mealPlan: '',
      city: '',
      nights: null,
      single: null,
      double: null,
      childWithBed: null
    };
  this.invoiceFormAirlineInclusion = {
      content: ''
    };

  this.invoiceFormAirlineExclusion = {
      content: ''
    };
  this.ItineraryForm = {
    content: ''
  };

  this.Items = [];
  this.TotalAmount = 0;
  this.TotalAccomodationSingle = 0;
  this.TotalAccomodationDouble = 0;
  this.TotalAccomodationChild = 0;

  this.AccomodationInputArrayFields = false;
  this.AccItems = [];

  this.InclutionInputField = true;
  this.InclutionItems = [];

  this.ExclutionInputField = true;
  this.ExclutionItems = [];
  this.ItineraryItems = [];

  this.inputArrayFields = false;

  this.homeComponent.loadStop();

}



toListInvoice() {
  this.homeComponent.loadStart();

  this.listSectionStatus = true;
  this.createSectionStatus = false;
  this.viewSectionStatus = false;
  this.homeComponent.loadStop();


}




clientAutoComplete = (text$: Observable<string>) =>
text$.pipe(
  debounceTime(200),
  distinctUntilChanged(),
  map(term => term.length < 2 ? []
    : this.OurClientNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
)





addItem() {

  this.inputArrayFields = false;
  let myItem = this.invoiceFormItems;
  let myTotalPersons = (Number(this.invoiceFormItems.persons.adult) + Number(this.invoiceFormItems.persons.child)) +  Number(this.invoiceFormItems.persons.infant);
  let myTotalAdultCost = (Number(this.invoiceFormItems.costPerPerson) * Number(this.invoiceFormItems.persons.adult)).toFixed(2);
  let myTotalChildCost = (Number(this.invoiceFormItems.costPerChild) * Number(this.invoiceFormItems.persons.child)).toFixed(2);
  let myTotalInfantCost = (Number(this.invoiceFormItems.costPerInfant) * Number(this.invoiceFormItems.persons.infant)).toFixed(2);

  myItem = {
    ...myItem,
    totalPersons: myTotalPersons,
    totalCost: Number(myTotalAdultCost) + Number(myTotalChildCost) +  Number(myTotalInfantCost)
    };

  if (myItem.flight === '' || myItem.from === '' || myItem.to === '' || myItem.date === '' || myItem.departure === '' || myItem.arrival === '' || myItem.class === '') {
    this.notifyService.showWarning('Input All Fields of the flights form', 'Field Blank!');

  }

  if (myItem.flight !== '' && myItem.from !== '' && myItem.to !== '' && myItem.date !== '' && myItem.departure !== '' && myItem.arrival !== '' && myItem.class !== '') {
    this.Items.push(myItem);

    this.invoiceFormItems = {
      flight: '',
      from: '',
      to: '',
      date: '',
      departure: '',
      arrival: '',
      class: '',
      costPerPerson: null,
      costPerChild: null,
      costPerInfant: null,
      persons: {
        adult: null,
        child: null,
        infant: null
      },
      totalPersons: null,
      totalCost: null,
    };
    this.getTotals();
  }
}


saveItemProceed() {
  let myItem = this.invoiceFormItems;
  let myTotalPersons = (Number(this.invoiceFormItems.persons.adult) + Number(this.invoiceFormItems.persons.child)) +  Number(this.invoiceFormItems.persons.infant);
  let myTotalAdultCost = (Number(this.invoiceFormItems.costPerPerson) * Number(this.invoiceFormItems.persons.adult)).toFixed(2);
  let myTotalChildCost = (Number(this.invoiceFormItems.costPerChild) * Number(this.invoiceFormItems.persons.child)).toFixed(2);
  let myTotalInfantCost = (Number(this.invoiceFormItems.costPerInfant) * Number(this.invoiceFormItems.persons.infant)).toFixed(2);

  myItem = {
    ...myItem,
    totalPersons: myTotalPersons,
    totalCost: Number(myTotalAdultCost) + Number(myTotalChildCost) + Number(myTotalInfantCost)
    };

  if (myItem.flight === '' || myItem.from === '' || myItem.to === '' || myItem.date === '' || myItem.departure === '' || myItem.arrival === '' || myItem.class === '') {
    if (this.Items.length > 0) {
      this.inputArrayFields = true;
      this.InclutionInputField = false;
    }
    if (this.Items.length === 0) {
      this.notifyService.showWarning('Add atleast one flight', 'No flight!');
    }
  }

  if (myItem.flight !== '' && myItem.from !== '' && myItem.to !== '' && myItem.date !== '' && myItem.departure !== '' && myItem.arrival !== '' && myItem.class !== '') {

    this.invoiceFormItems = {
      flight: '',
      from: '',
      to: '',
      date: '',
      departure: '',
      arrival: '',
      class: '',
      costPerPerson: null,
      costPerChild: null,
      costPerInfant: null,
      persons: {
        adult: null,
        child: null,
        infant: null
      },
      totalPersons: null,
      totalCost: null,
    };

    this.inputArrayFields = true;
    this.InclutionInputField = false;
    this.Items.push(myItem);
    this.getTotals();

  }
}


deleteFromFlight(i) {
  this.Items.splice(i, 1);
  this.getTotals();
  this.notifyService.showSuccess('You have deleted a flight', 'Success');
}



getTotals() {

  this.TotalAmount = 0;
  this.Items.forEach((item) => {
    this.TotalAmount = Number(this.TotalAmount) + Number(item.totalCost);

  });
}






addAccomodationItem() {

  let myAccItem = this.invoiceFormAccomodation;

  if (myAccItem.hotel === '' || myAccItem.roomType === '' || myAccItem.mealPlan === '' || myAccItem.city === ''
  || myAccItem.nights === null || myAccItem.single === null || myAccItem.double === null || myAccItem.childWithBed === null) {
    this.notifyService.showWarning('Input All Fields of the Details Form', 'Field Blank!');

  }

  if (myAccItem.hotel !== '' && myAccItem.roomType !== '' && myAccItem.mealPlan !== '' && myAccItem.city !== ''
  && myAccItem.nights !== null && myAccItem.single !== null && myAccItem.double !== null && myAccItem.childWithBed !== null) {
    this.AccItems.push(myAccItem);

    this.invoiceFormAccomodation = {
      hotel: '',
      roomType: '',
      mealPlan: '',
      city: '',
      nights: null,
      single: null,
      double: null,
      childWithBed: null
    };
    this.getTotalAccomodation();

  }

}






saveAccomodationItemProceed() {

  let myAccItem = this.invoiceFormAccomodation;

  if (myAccItem.hotel === '' || myAccItem.roomType === '' || myAccItem.mealPlan === '' || myAccItem.city === ''
  || myAccItem.nights === null || myAccItem.single === null || myAccItem.double === null || myAccItem.childWithBed === null) {
    if (this.AccItems.length > 0) {
      this.AccomodationInputArrayFields = true;
      this.InclutionInputField = false;
    }
    if (this.AccItems.length === 0) {
      this.notifyService.showWarning('Add atleast one Detail', 'No Detail!');
    }

  }

  if (myAccItem.hotel !== '' && myAccItem.roomType !== '' && myAccItem.mealPlan !== '' && myAccItem.city !== ''
  && myAccItem.nights !== null && myAccItem.single !== null && myAccItem.double !== null && myAccItem.childWithBed !== null) {
    this.AccItems.push(myAccItem);

    this.invoiceFormAccomodation = {
      hotel: '',
      roomType: '',
      mealPlan: '',
      city: '',
      nights: null,
      single: null,
      double: null,
      childWithBed: null
    };
    this.getTotalAccomodation();
    this.InclutionInputField = false;
    this.AccomodationInputArrayFields = true;

  }

}


deleteFromDetails(x) {
  this.AccItems.splice(x, 1);
  this.getTotalAccomodation();
  this.notifyService.showSuccess('You have deleted a Detail', 'Success');
}


getTotalAccomodation() {

  this.TotalAccomodationSingle = 0;
  this.TotalAccomodationDouble = 0;
  this.TotalAccomodationChild = 0;

  this.AccItems.forEach((item) => {
    this.TotalAccomodationSingle = Number(this.TotalAccomodationSingle) + Number(item.single);
    this.TotalAccomodationDouble = Number(this.TotalAccomodationDouble) + Number(item.double);
    this.TotalAccomodationChild = Number(this.TotalAccomodationChild) + Number(item.childWithBed);

  });
}


addInclusionItem() {
  let myInclusionItem = this.invoiceFormAirlineInclusion;

  if ( myInclusionItem.content === '') {
    this.notifyService.showWarning('Input All Fields of the product', 'Field Blank!');
  } else {
    this.InclutionItems.push(myInclusionItem);

    this.invoiceFormAirlineInclusion = {
      content: ''
    };
  }

}

saveInclusionItemProceed() {
  let myInclusionItem = this.invoiceFormAirlineInclusion;

  if ( myInclusionItem.content === '') {
    if (this.InclutionItems.length > 0) {
      this.InclutionInputField = true;
      this.ExclutionInputField = false;
    }
    if (this.InclutionItems.length === 0) {
      this.notifyService.showWarning('Add atleast one item', 'No item!');
    }
  } else {
    this.InclutionItems.push(myInclusionItem);

    this.invoiceFormAirlineInclusion = {
      content: ''
    };
    this.InclutionInputField = true;
    this.ExclutionInputField = false;
  }
}

deleteFromInclusion(y) {
  this.InclutionItems.splice(y, 1);
  this.notifyService.showSuccess('You have deleted an Inclusion', 'Success');
}






addExclusionItem() {
  let myExclusionItem = this.invoiceFormAirlineExclusion;

  if ( myExclusionItem.content === '') {
    this.notifyService.showWarning('Input All Fields of the product', 'Field Blank!');
  } else {
    this.ExclutionItems.push(myExclusionItem);

    this.invoiceFormAirlineExclusion = {
      content: ''
    };
  }

}

saveExclusionItemProceed() {
  let myExclusionItem = this.invoiceFormAirlineExclusion;

  if ( myExclusionItem.content === '') {
    if (this.ExclutionItems.length > 0) {
      this.ExclutionInputField = true;
    }
    if (this.ExclutionItems.length === 0) {
      this.notifyService.showWarning('Add atleast one item', 'No item!');
    }
  } else {
    this.ExclutionItems.push(myExclusionItem);

    this.invoiceFormAirlineExclusion = {
      content: ''
    };
    this.ExclutionInputField = true;

  }
}

deleteFromExclusion(z) {
  this.ExclutionItems.splice(z, 1);
  this.notifyService.showSuccess('You have deleted an Exclusion', 'Success');
}





getItineraryImage(fileInput) {

  this.myFile =  fileInput.target.files[0] as File;

}

postItinerary() {
  // tslint:disable: new-parens

  if ( this.myFile !== null ) {

  const formData = new FormData;
  formData.append('sampleFile', this.myFile, this.myFile.name);
  this.homeComponent.loadStart();
  this.invoiceService.uploadItineraryImage(formData).subscribe(
    data => {
      this.itineraryFiles = {
        name: data.imageName,
        url: `${dev.connect}static/itineraryImages/${data.imageName}`,
        bs64: 'blank'
      };
      this.myFile = null;
      this.triggerPosting();
    },
    error => {console.log(error);   this.homeComponent.loadStop(); this.notifyService.showError('Failed', 'Could Not upload Itinerary Image'); }
  );

  }


  if ( this.myFile === null ) {
    this.triggerPostingWithoutImage();
  }

}



triggerPostingWithoutImage() {
  let myItineraryItem = {
    content: this.ItineraryForm.content,
    image: ''
  };
  this.ItineraryItems.push(myItineraryItem);

  this.ItineraryForm = {
    content: ''
  };

  this.generateInvoice();
}

triggerPosting() {
  let myItineraryItem = {
    content: this.ItineraryForm.content,
    image: this.itineraryFiles
  };
  this.ItineraryItems.push(myItineraryItem);

  this.ItineraryForm = {
    content: ''
  };

  this.generateInvoice();
}



deleteFromItinerary(t, name) {
  this.ItineraryItems.splice(t, 1);
  this.invoiceService.removeItineraryImage(name).subscribe(
    data =>   this.notifyService.showInfo('You have deleted an Itinerary', 'Success'),
    error =>   this.notifyService.showError('Could not remove an Itinerary', 'Failed')
  );

  this.generateInvoice();

}

deleteFromItineraryWitoutImage(t) {
  this.ItineraryItems.splice(t, 1);
  this.generateInvoice();
}



generateInvoice() {


  if (this.invoiceOnEditId === null ) {
      let dataToBeSent = {
        invoiceType: this.invoiceForm.invoiceType,
        customerName: this.invoiceForm.customerName,
        paymentTerms: this.invoiceForm.paymentTerms,
        invoiceNumber: `Q_${Math.round(Math.random() * 1000000)}_${this.invoiceForm.customerName}`,
        invoiceDate: this.invoiceForm.invoiceDate,
        dueDate: this.invoiceForm.dueDate,
        salesPerson:  localStorage.getItem('loggedUserName'),
        createdOn: new Date(),
        items: this.Items,
        totalAmount: this.TotalAmount,
        accomodation: this.AccItems,
        totalAccomodationSingle: this.TotalAccomodationSingle,
        totalAccomodationDouble: this.TotalAccomodationDouble,
        totalAccomodationChild: this.TotalAccomodationChild,
        airlineInclusion: this.InclutionItems,
        airlineExclusion: this.ExclutionItems,
        itinerary: this.ItineraryItems
      };

      if ( dataToBeSent.customerName === ''  ) {
        this.notifyService.showWarning('Please Input Customer Name', 'Blank Field!');
        this.customerNameField.nativeElement.focus();
        this.homeComponent.loadStop();
        return;
      }

      if ( dataToBeSent.paymentTerms === ''  ) {
        this.notifyService.showWarning('Please Input Payment Terms', 'Blank Field!');
        this.paymentTermsField.nativeElement.focus();
        this.homeComponent.loadStop();
        return;
      }

      if ( dataToBeSent.invoiceDate === '' ) {
        this.notifyService.showWarning('Please Input Invoice Date', 'Blank Field!');
        this.invoiceDateField.nativeElement.focus();
        this.homeComponent.loadStop();
        return;
      }

      if ( dataToBeSent.dueDate === ''  ) {
        this.notifyService.showWarning('Please Input Due Date', 'Blank Field!');
        this.dueDateField.nativeElement.focus();
        this.homeComponent.loadStop();
        return;
      }

      if ( this.invoiceForm.invoiceType === 'ticket' && this.Items.length === 0) {
        this.notifyService.showWarning('Please Input atleast one flight ticket ', 'No Flights!');
        this.flightInputField.nativeElement.focus();
        this.homeComponent.loadStop();
        return;
      }

      if (this.invoiceForm.invoiceType !== 'ticket' && this.AccItems.length === 0) {
        this.notifyService.showWarning('Please Input atleast one Detail for accomodations ', 'Blank Details!');
        this.homeComponent.loadStop();
        return;
      }
      if (this.InclutionItems.length === 0) {
        this.notifyService.showWarning('Please Input atleast one Inclution Detail', 'Blank Inclution!');
        this.homeComponent.loadStop();
        return;
      }
      if (this.ExclutionItems.length === 0) {
        this.notifyService.showWarning('Please Input atleast one Exclution Detail', 'Blank Exclution!');
        this.homeComponent.loadStop();
        return;
      } else {
              if (this.invoiceForm.invoiceType === 'ticket') { dataToBeSent.accomodation = []; }
              this.homeComponent.loadStart();
              setTimeout(() => {
              this.invoiceService.createInvoice(dataToBeSent).subscribe(
                data => {
                  this.homeComponent.loadStop();
                  this.listSectionStatus = true;
                  this.createSectionStatus = false;
                  this.viewSectionStatus = false;
                  this.updatePage();
                  this.notifyService.showSuccess('Quotation Created', 'Success');
                },
                error => {
                  this.homeComponent.loadStop();
                  this.notifyService.showError('Could Not Create Quotation', 'Failed');
                }
              );
              }, 1000);


            }

    }

  if (this.invoiceOnEditId !== null ) {

    let dataToBeSent = {
        invoiceType: this.invoiceForm.invoiceType,
        customerName: this.invoiceForm.customerName,
        paymentTerms: this.invoiceForm.paymentTerms,
        invoiceDate: this.invoiceForm.invoiceDate,
        dueDate: this.invoiceForm.dueDate,
        items: this.Items,
        totalAmount: this.TotalAmount,
        accomodation: this.AccItems,
        totalAccomodationSingle: this.TotalAccomodationSingle,
        totalAccomodationDouble: this.TotalAccomodationDouble,
        totalAccomodationChild: this.TotalAccomodationChild,
        airlineInclusion: this.InclutionItems,
        airlineExclusion: this.ExclutionItems,
        itinerary: this.ItineraryItems
    };

    if ( dataToBeSent.customerName === ''  ) {
      this.notifyService.showWarning('Please Input Customer Name', 'Blank Field!');
      this.customerNameField.nativeElement.focus();
      this.homeComponent.loadStop();
      return;
    }

    if ( dataToBeSent.paymentTerms === ''  ) {
      this.notifyService.showWarning('Please Input Payment Terms', 'Blank Field!');
      this.paymentTermsField.nativeElement.focus();
      this.homeComponent.loadStop();
      return;
    }

    if ( dataToBeSent.invoiceDate === '' ) {
      this.notifyService.showWarning('Please Input Quotation Date', 'Blank Field!');
      this.invoiceDateField.nativeElement.focus();
      this.homeComponent.loadStop();
      return;
    }

    if ( dataToBeSent.dueDate === ''  ) {
      this.notifyService.showWarning('Please Input Due Date', 'Blank Field!');
      this.dueDateField.nativeElement.focus();
      this.homeComponent.loadStop();
      return;
    }

    if (this.invoiceForm.invoiceType === 'ticket' && this.Items.length === 0) {
      this.notifyService.showWarning('Please Input atleast one flight ticket ', 'No Flights!');
      this.flightInputField.nativeElement.focus();
      this.homeComponent.loadStop();
      return;
    }

    if (this.invoiceForm.invoiceType !== 'ticket' && this.AccItems.length === 0) {
      this.notifyService.showWarning('Please Input atleast one Detail ', 'Blank Details!');
      this.homeComponent.loadStop();
      return;
    }
    if (this.InclutionItems.length === 0) {
      this.notifyService.showWarning('Please Input atleast one Inclution Detail', 'Blank Inclution!');
      this.homeComponent.loadStop();
      return;
    }
    if (this.ExclutionItems.length === 0) {
      this.notifyService.showWarning('Please Input atleast one Exclution Detail', 'Blank Exclution!');
      this.homeComponent.loadStop();
      return;
    } else {
      if (this.invoiceForm.invoiceType === 'ticket') { dataToBeSent.accomodation = []; }
      this.homeComponent.loadStart();
      this.invoiceService.updateInvoice(this.invoiceOnEditId, dataToBeSent).subscribe(
        upDateData => {
          this.invoiceOnEditId = upDateData._id;
          this.invoiceForm = upDateData;
          let convertInvoiceDate = new Date(this.invoiceForm.invoiceDate);
          let convertDueDate = new Date(this.invoiceForm.dueDate);
          this.invoiceForm.invoiceDate = `${convertInvoiceDate.getUTCMonth() + 1}/${convertInvoiceDate.getUTCDate() + 1}/${convertInvoiceDate.getUTCFullYear()}`;
          this.invoiceForm.dueDate = `${convertDueDate.getUTCMonth() + 1}/${convertDueDate.getUTCDate() + 1}/${convertDueDate.getUTCFullYear()}`;
          this.invoiceFormItems = {
            flight: '',
            from: '',
            to: '',
            date: '',
            departure: '',
            arrival: '',
            class: '',
            costPerPerson: null,
            costPerChild: null,
            costPerInfant: null,
            persons: {
              adult: null,
              child: null,
              infant: null
            },
            totalPersons: null,
            totalCost: null,
          };

          this.invoiceFormAccomodation = {
            hotel: '',
            roomType: '',
            mealPlan: '',
            city: '',
            nights: null,
            single: null,
            double: null,
            childWithBed: null
          };
          this.invoiceFormAirlineInclusion = {
            content: ''
          };

          this.invoiceFormAirlineExclusion = {
            content: ''
          };
          this.ItineraryForm = {
            content: ''
          };

          this.Items = upDateData.items;
          this.AccItems = upDateData.accomodation;
          this.InclutionItems = upDateData.airlineInclusion;
          this.ExclutionItems = upDateData.airlineExclusion;
          this.ItineraryItems = upDateData.itinerary;
          this.getTotals();
          this.getTotalAccomodation();
          setTimeout(() => {
            this.homeComponent.loadStop();
            this.updatePage();
            this.notifyService.showSuccess('Quotation Updated', 'Success');
          }, 2000);

        },
        error => {
          setTimeout(() => {
            this.homeComponent.loadStop();
            this.notifyService.showError('Could Not Updated Quotation', 'Failed');

          }, 2000);
        }
      ); // request


    } // else


    } // update

}// generate function



editInvoice(id) {
  this.homeComponent.loadStart();
  this.invoiceService.getOneInvoice(id).subscribe(
    inv => {
      setTimeout(() => {
      this.invoiceForm = inv;
      let convertInvoiceDate = new Date(this.invoiceForm.invoiceDate);
      let convertDueDate = new Date(this.invoiceForm.dueDate);
      this.invoiceForm.invoiceDate = `${convertInvoiceDate.getUTCMonth() + 1}/${convertInvoiceDate.getUTCDate() + 1}/${convertInvoiceDate.getUTCFullYear()}`;
      this.invoiceForm.dueDate = `${convertDueDate.getUTCMonth() + 1}/${convertDueDate.getUTCDate() + 1}/${convertDueDate.getUTCFullYear()}`;
      this.invoiceFormItems = {
        flight: '',
        from: '',
        to: '',
        date: '',
        departure: '',
        arrival: '',
        class: '',
        costPerPerson: null,
        costPerChild: null,
        costPerInfant: null,
        persons: {
          adult: null,
          child: null,
          infant: null
        },
        totalPersons: null,
        totalCost: null,
      };

      this.invoiceFormAccomodation = {
        hotel: '',
        roomType: '',
        mealPlan: '',
        city: '',
        nights: null,
        single: null,
        double: null,
        childWithBed: null
      };
      this.invoiceFormAirlineInclusion = {
        content: ''
      };

      this.invoiceFormAirlineExclusion = {
        content: ''
      };
      this.ItineraryForm = {
        content: ''
      };

      this.invoiceOnEditId = inv._id;

      this.listSectionStatus = false;
      this.viewSectionStatus = false;
      this.createSectionStatus = true;
      this.inputArrayFields = false;
      this.InclutionInputField = false;
      this.ExclutionInputField = false;


      this.Items = inv.items;
      this.AccItems = inv.accomodation;
      this.InclutionItems = inv.airlineInclusion;
      this.ExclutionItems = inv.airlineExclusion;
      this.ItineraryItems = inv.itinerary;
      this.getTotals();
      this.getTotalAccomodation();


      this.homeComponent.loadStop();
      this.notifyService.showInfo(`You are editing quotation to ${inv.customerName}`, 'Quotation Open');
      }, 2000);

    },
    error => {
      setTimeout(() => {
      this.notifyService.showError('Could not open Quotation', 'Failesd');
      }, 2000);
    }
  );

}





viewInvoice(id) {

  this.Invoices.forEach((inv) => {
    if (inv._id === id) {
      this.invoiceViewed = inv;
      this.listSectionStatus = false;
      this.viewSectionStatus = true;
      this.createSectionStatus = false;
    }
  });
}



deleteInvoice(id) {
  this.Invoices.forEach((inv) => {
    if (inv._id === id) {
      this.InvoiceToBeDeleted = inv;
      this.deleteModal.show();
    }
  });

}


submitDeleteInvoice() {
  this.homeComponent.loadStart();
  setTimeout(() => {
    this.invoiceService.deleteInvoice(this.InvoiceToBeDeleted._id).subscribe(
      data => {

        this.InvoiceToBeDeleted.itinerary.forEach((item) => {
          this.invoiceService.removeItineraryImage(item.image.name).subscribe(
            dataRes => {},
            error => {console.log('Error Deleteing Itinerary Image'); }
          );
        });

        this.homeComponent.loadStop();
        this.updatePage();
        this.notifyService.showSuccess('Quotation Deleted', 'Success');
        this.toListInvoice();
      },
      error => {
        this.homeComponent.loadStop();
        this.notifyService.showSuccess('Could Not Delete Quotation', 'Failed');
      }
    );
  }, 1000);
}



    sendInvoiceViaEmail() {
      this.homeComponent.loadStop();
      this.mailModal.show();
    }

    submitEmail() {
      this.homeComponent.loadStart();


      let dataToBeSent = {
        sender: localStorage.getItem('loggedUserEmail'),
        reciever: this.mailForm.value.email,
        subject: 'Quotation',
        html: this.myHtmlToEmail(),
        attachment: this.myPdfToEmail
      };
      this.invoiceService.sendInvoice(dataToBeSent).subscribe(
        data => {
          this.homeComponent.loadStop();
          this.updatePage();
          this.notifyService.showSuccess('Quotation sent successfully', 'Success');
        },
        error => {
          this.homeComponent.loadStop();
          this.notifyService.showError('Quotation not sent', 'Failed!');
        }
      );

    }


    previewInvoice() {
      this.homeComponent.loadStart();
      this.pdfAction = 'preview';
      this.generatePDF();
    }
    downLoadInvoice() {
      this.homeComponent.loadStart();
      this.pdfAction = 'download';
      this.generatePDF();
    }
    shareInvoice() {
      this.homeComponent.loadStart();
      this.pdfAction = 'share';
      this.generatePDF();
    }
    printInvoice() {
      this.homeComponent.loadStart();
      this.pdfAction = 'print';
      this.generatePDF();
    }


    async generatePDF() {
      html2canvas(document.querySelector('#myTemplate'), {scale: 2}).then(canvas => {
        let pdf = new jspdf('p', 'mm', 'a4');
        let img = new Image();
        if (this.invoiceViewed.invoiceType === 'ticket') {
          img.src = 'assets/images/outBound.PNG';
        }
        if (this.invoiceViewed.invoiceType === 'inBound') {
          img.src = 'assets/images/inBound.PNG';
        }
        if (this.invoiceViewed.invoiceType === 'outBound') {
          img.src = 'assets/images/outBound.PNG';
        }
        pdf.addImage(img, 'PNG', 10, 10, 190, 30);
        pdf.addImage(canvas, 10, 45, 190, 210);
        pdf.page = 1;
        pdf.setFontSize(12);
        pdf.text(160, 270, 'Signature: ');
        pdf.text(180, 270, '...................');
        pdf.line(0, 275, 275, 275);
        pdf.text(80, 285, 'crystaltours.com');
        pdf.text(190, 285, 'page ' + pdf.page);

        let data = btoa(pdf.output());
        this.myPdfToEmail = data;

        switch (this.pdfAction) {
          case 'preview': pdf.output('dataurlnewwindow'); this.homeComponent.loadStop(); break;
          case 'download': pdf.save(`${this.invoiceViewed.invoiceNumber}.pdf`);
                           this.homeComponent.loadStop(); this.notifyService.showInfo('Document downloading..', 'Info...');  break;
          case 'share': this.sendInvoiceViaEmail(); break;
          case 'print': pdf.autoPrint(); this.notifyService.showInfo('Document on print', 'Info...'); this.homeComponent.loadStop(); break;
          default: pdf.output('dataurlnewwindow'); this.homeComponent.loadStop(); break;
        }
      }).catch(console.log('Error in html2canvas'));
    }




    myHtmlToEmail() {


      let flightSection =  this.invoiceViewed.items.filter((item) => true ).map((item) => {
          return `<div class="details" style="display: flex; align-items: stretch; box-shadow: 1px 2px 3px rgba(0, 0, 0, .2);
          margin: 0 0 .5em 0; background-color: #e4e7ea;">
          <div style="width: 100%; padding: .5em; font-family: georgia; font-size: 13px; color: #23282c;">${item.flight}</div>
          <div style="width: 100%; padding: .5em; font-family: georgia; font-size: 13px; color: #23282c;">${item.from} <span style="color: teal; font-weight: bold;">to</span> ${item.to}</div>
          <div style="width: 100%; padding: .5em; font-family: georgia; font-size: 13px; color: #23282c;">${item.date}</div>
          <div style="width: 100%; padding: .5em; font-family: georgia; font-size: 13px; color: #23282c;">${item.departure} <span style="color: teal; font-weight: bold;">to</span> ${item.arrival }</div>
          <div style="width: 100%; padding: .5em; font-family: georgia; font-size: 13px; color: #23282c;">${item.class }</div>
          <div style="width: 100%; padding: .5em; font-family: georgia; font-size: 13px; color: #23282c;">${item.totalPersons} (ad ${item.persons.adult}, ch ${item.persons.child}, in ${item.persons.infant})</div>
          <div class="currency" style="width: 100%; padding: .5em; font-family: georgia; font-size: 13px; color: #23282c;">${item.totalCost}</div>
          </div>`;
        });



      let myAccHtml;


      if (this.invoiceViewed.accomodation.length === 0) {
        myAccHtml = '';
        } else {

         let maAccHtmlArray = this.invoiceViewed.accomodation.filter(() => true).map((item) => {
          return ` <div class="detail"  style="box-shadow: 1px 2px 3px #888888; margin: 0 0 .5em 0; padding: .5em; background-color: #e4e7ea;">
                  <div class="wrap" style="display: flex; align-items: stretch; width: 100%;">
                      <div class="item" style="width: 20%;">
                          <label style="font-family: Georgia; font-size: 12px; font-weight: bold; color: #23282c;">Hotel</label>
                          <div style="font-family: Georgia; font-size: 12px; color: #23282c;">${item.hotel}</div>
                      </div>
                      <div class="item" style="width: 20%;">
                          <label style="font-family: Georgia; font-size: 12px; font-weight: bold; color: #23282c;">RoomType</label>
                          <div style="font-family: Georgia; font-size: 12px; color: #23282c;">${item.roomType}</div>
                      </div>
                      <div class="item" style="width: 20%;">
                          <label style="font-family: Georgia; font-size: 12px; font-weight: bold; color: #23282c;">Meal Plan</label>
                          <div style="font-family: Georgia; font-size: 12px; color: #23282c;">${item.mealPlan}</div>
                      </div>
                      <div class="item" style="width: 20%;">
                          <label style="font-family: Georgia; font-size: 12px; font-weight: bold; color: #23282c;">City</label>
                          <div style="font-family: Georgia; font-size: 12px; color: #23282c;">${item.city}</div>
                      </div>
                      <div class="item" style="width: 20%;">
                          <label style="font-family: Georgia; font-size: 12px; font-weight: bold; color: #23282c;">Nights</label>
                          <div style="font-family: Georgia; font-size: 12px; color: #23282c;">${item.nights}</div>
                      </div>
                  </div>
                  <hr style="margin: .5em 0;">
                  <div class="wrap" style="display: flex; align-items: stretch; width: 100%;">

                      <div class="item" style="width: 20%;">
                          <label style="font-family: Georgia; font-size: 12px; font-weight: bold; color: #23282c;">Single</label>
                          <div style="font-family: Georgia; font-size: 12px; color: #23282c;">${item.single}</div>
                      </div>
                      <div class="item" style="width: 20%;"></div>
                      <div class="item" style="width: 20%;">
                          <label style="font-family: Georgia; font-size: 12px; font-weight: bold; color: #23282c;">Double</label>
                          <div style="font-family: Georgia; font-size: 12px; color: #23282c;">${item.double}</div>
                      </div>
                      <div class="item" style="width: 20%;"></div>
                      <div class="item" style="width: 20%;">
                          <label style="font-family: Georgia; font-size: 12px; font-weight: bold; color: #23282c;">Child with Bed</label>
                          <div style="font-family: Georgia; font-size: 12px; color: #23282c;">${item.childWithBed}</div>
                      </div>

                  </div>
              </div>`;
          });

         myAccHtml = `
          <div class="accomodation" style="margin: 3em 0 0 0;">
          <div class="head" style="background-color: teal; margin: 0 0 0 0; padding: .5em; width: 100%; color: white; font-weight: bold;">Details</div>
            ${maAccHtmlArray.join('')}
          </div>
          `;


        } // else

      let accomodationSection = myAccHtml;





      let inclutionSection = this.invoiceViewed.airlineInclusion.filter(() => true).map(item => {
        return `<div style="font-size: 12px;font-family: georgia; color: #23282c;">${item.content}</div>`;
      });

      let exclutionSection = this.invoiceViewed.airlineExclusion.filter(() => true).map(item => {
        return `<div style="font-size: 12px;font-family: georgia; color: #23282c;">${item.content}</div>`;
      });



      let logoSection;

      if (this.invoiceViewed.invoiceType === 'ticket') {
        logoSection = `<img style="min-width: 100%; height: 150px;" src="assets/images/outBound.PNG" alt="invoice logo">`;
      }
      if (this.invoiceViewed.invoiceType === 'inBound') {
        logoSection = `<img style="min-width: 100%; height: 150px;" src="assets/images/inBound.PNG" alt="invoice logo">`;
      }
      if (this.invoiceViewed.invoiceType === 'outBound') {
        logoSection = `<img style="min-width: 100%; height: 150px;" src="assets/images/outBound.PNG" alt="invoice logo">`;
      }


    //   <div class="logo" style="width: 100%; height: 150px; margin: 0 0 2em 0;">
    //   ${logoSection}
    // </div>


      let content = `

<section class="view-section" style="border:solid 1px #e4e7ea;background-color: #e4e7ea;border-radius: 1px;text-align: center;width: 100%;
min-width: 576px; overflow-y: scroll;">


<div class="view-body" style="font-size:12px;font-family:Georgia;padding:1em;margin:2em;background-color:white;width: 100%;box-shadow: 2px 3px 4px rgba(0,0,0,.3);">


    <div class="top-wrap" style="display: flex; align-items: stretch; width: 100%; margin: 0;">


        <div class="invoice" style=" width: 40%; text-align: left;">

          <div class="invoice-to" style=" color: teal; font-family: Georgia; font-size: 18px; font-weight: bold;">Quotation To</div>

          <div id="customerName" style=" font-family: Georgia;font-size: 12px;color: #23282c;">${this.invoiceViewed.customerName}</div>

        </div>
        <div class="invoice-details" style="width: 60%;">
            <div class="head" style="color: teal; font-family: Georgia; font-size: 19px; font-weight: bold">Quotation Details</div>

            <div class="div-wrap" style="display: flex; align-items: stretch; width: 100%; margin: 1em 0 1em 0;">
                <div class="wrap" style="width: 100%;">
                    <label style=" font-family: Georgia; font-size: 14px; font-weight: bold; margin: 0 0 .5em 0; color: #23282c;">Quotation No</label>

                    <div style=" font-family: Georgia; font-size: 12px; text-transform: capitalize; color: #23282c;">${this.invoiceViewed.invoiceNumber}</div>
                </div>
                <div class="wrap" style="width: 100%;">
                    <label style=" font-family: Georgia; font-size: 14px; font-weight: bold; margin: 0 0 .5em 0;  color: #23282c;">Date</label>

                    <div style=" font-family: Georgia; font-size: 12px; text-transform: capitalize; color: #23282c;">${this.invoiceViewed.invoiceDate}</div>
                </div>
                <div class="wrap" style="width: 100%;">
                    <label style=" font-family: Georgia; font-size: 14px; font-weight: bold; margin: 0 0 .5em 0; color: #23282c;">Due</label>

                    <div style=" font-family: Georgia; font-size: 12px; text-transform: capitalize; color: #23282c;">${this.invoiceViewed.dueDate}</div>
                </div>
            </div>

            <div class="div-wrap" style="display: flex; align-items: stretch; width: 100%; margin: 1em 0 1em 0;">
                <div class="wrap" style="width: 100%;">
                    <label style=" font-family: Georgia; font-size: 14px; font-weight: bold; margin: 0 0 .5em 0;  color: #23282c;">Type</label>

                    <div style=" font-family: Georgia; font-size: 12px; text-transform: capitalize;  color: #23282c;">${this.invoiceViewed.invoiceType}</div>
                </div>
                <div class="wrap" style="width: 100%;">
                    <label style=" font-family: Georgia; font-size: 14px; font-weight: bold; margin: 0 0 .5em 0;  color: #23282c;">SalesPerson</label>

                    <div style=" font-family: Georgia; font-size: 12px; text-transform: capitalize;  color: #23282c;">${this.invoiceViewed.salesPerson}</div>
                </div>
                <div class="wrap" style="width: 100%;">
                    <label style=" font-family: Georgia; font-size: 14px; font-weight: bold; margin: 0 0 .5em 0;  color: #23282c;">Payment Terms</label>
                    <div style=" font-family: Georgia; font-size: 12px; text-transform: capitalize;  color: #23282c;">${this.invoiceViewed.paymentTerms}</div>
                </div>

            </div>

        </div>
    </div>


    <div class="flight-wrap" style="margin: 3em 0 0 0;">
        <div class="head" style="display: flex; align-items: stretch; background-color: teal; margin: 0 0 0 0;padding: .5em;">
            <div style="width:100%; color:white; font-weight:bold;">Flight</div>
            <div style="width:100%; color:white; font-weight:bold;">Route</div>
            <div style="width:100%; color:white; font-weight:bold;">Date</div>
            <div style="width:100%; color:white; font-weight:bold;">Time</div>
            <div style="width:100%; color:white; font-weight:bold;">Class</div>
            <div style="width:100%; color:white; font-weight:bold;">Persons</div>
            <div style="width:100%; color:white; font-weight:bold;">TotalCost</div>

        </div>

        ${flightSection.join('')}

    </div>

    <div class="payment" style="display: flex; align-items: stretch; margin: 3em 0 3em 0;">
        <div class="method" style="width: 100%; text-align: left;">

        </div>
        <div class="amount" style="width: 100%; display: flex; flex-direction: column;">
            <div class="total" style="display: flex; align-items: stretch; background-color: #e4e7ea; font-family: georgia; font-size: 12px; width: 100%; padding: .5em;">

            <div style="width: 100%; font-family: Georgia; padding: 1em;  font-size: 12px; text-align: left; color: teal;
              font-weight: bold;">Grand Total:</div>
              <div style="width: 100%; height: 100%; padding: 1em; font-family: Georgia; font-size: 12px; font-weight: bold; color: #23282c; text-align: left;">${this.invoiceViewed.totalAmount}</div>
            </div>
        </div>
    </div>

        ${accomodationSection}

    <div class="airline-details" style="width: 100%; font-family: Georgia; font-size: 12px; text-align: left; font-weight: bold; color: teal;
    text-shadow: 1px 2px 3px rgba(0, 0, 0, .2); margin: 3em 0 1em 0;">Airline Details</div>



    <div class="inclusion-payment" style="display: flex; align-items: stretch; width: 100%;">

      <div class="Inclusive" style="margin-right: 10px; margin-bottom: 10px; width: 100%; min-width: 20em; text-align: left;">
          <div class="head" style="background-color: teal; margin: 0 0 0 0; padding: .5em; width: 100%; color: white; font-weight: bold;">Inclusions</div>
          <div class="detail" style="text-align: left; width: 100%; box-shadow: 1px 2px 3px rgba(0, 0, 0, .2); margin: 0 0 .5em 0; padding: .5em; background-color: #e4e7ea;">
          ${inclutionSection.join('')}
          </div>
      </div>

      <div class="payment" style="margin-left: 10px; margin-bottom: 20px; width: 100%; min-width: 20em; text-align: left;">

          <div class="head" style="background-color: #acb4bc; margin: 0 0 0 0; padding: .5em; width: 100%; color: #23282c; font-weight: bold;">Payment Policy</div>
          <div class="detail" style="text-align: left; box-shadow: 1px 2px 3px rgba(0, 0, 0, .2); margin: 0 0 .5em 0; padding: .5em; background-color: #e4e7ea;">
              <p style="font-size: 12px; font-family: georgia; color: #23282c;">Our Payment policy is as follows</p>
              <p style="font-size: 12px; font-family: georgia; color: #23282c;">
              For International and Domestic Air tickets a 100 % prepayment must be received at the time of confirmation of the booking. These are subject to penalties of all various kinds and therefore please confer with us to ascertain what is applicable.
              </p>
              <p style="font-size: 12px; font-family: georgia; color: #23282c;">Payments are required as follows unless otherwise agreed</p>
              <p style="font-size: 12px; font-family: georgia; color: #23282c;">
              50 % deposit upon confirmation of the Safari if booked more than 90 days in advance. Balance payable 60 days prior to arrival. In case the Safari is booked within 59 days, full prepayment is required at the time of booking. All Bank Charges are to be borne by the clients or agents.
              </p>
          </div>

      </div>

  </div>



  <div class="exclusive-cancellation" style="display: flex; align-items: stretch; width: 100%;">

    <div class="Exclusive" style="margin-right: 10px; margin-bottom: 10px; width: 100%; min-width: 20em; text-align: left;">
            <div class="head" style="background-color: teal; margin: 0 0 0 0; padding: .5em; width: 100%; color: white; font-weight: bold;">Exclusions</div>
            <div class="detail" style="text-align: left; box-shadow: 1px 2px 3px rgba(0, 0, 0, .2); width: 100%; margin: 0 0 .5em 0; padding: .5em; background-color: #e4e7ea;">
            ${exclutionSection.join('')}
           </div>
    </div>

    <div class="cancellation" style="margin-left: 10px; margin-bottom: 20px; width: 100%; min-width: 20em; text-align: left;">
    <div class="head"  style="background-color: #acb4bc; margin: 0 0 0 0; padding: .5em; width: 100%; color: #23282c; font-weight: bold;">Cancellation Policy</div>
    <div class="detail" style="text-align: left; box-shadow: 1px 2px 3px rgba(0, 0, 0, .2); margin: 0 0 .5em 0; padding: .5em; background-color: #e4e7ea;">
        <p style="font-size: 12px; font-family: georgia; color: #23282c;">The following Cancellation policy is application</p>
        <div class="wrap" style=" display: flex; align-items: stretch; width: 100%">
            <p class="duration" style="font-size: 12px; font-family: georgia; width: 50%; color: #23282c;">Over 90 days</p>
            <p class="penalty" style="font-size: 12px; font-family: georgia; width: 50%; color: #23282c;">Nil Penalty</p>
        </div>
        <div class="wrap" style=" display: flex; align-items: stretch; width: 100%">
            <p class="duration" style="font-size: 12px; font-family: georgia; width: 50%; color: #23282c;">89- 60 days </p>
            <p class="penalty" style="font-size: 12px; font-family: georgia; width: 50%; color: #23282c;">20 % Penalty</p>
        </div>
        <div class="wrap" style=" display: flex; align-items: stretch; width: 100%">
            <p class="duration" style="font-size: 12px; font-family: georgia; width: 50%; color: #23282c;">59- 45 days</p>
            <p class="penalty" style="font-size: 12px; font-family: georgia; width: 50%; color: #23282c;">33 % Penalty</p>
        </div>
        <div class="wrap" style=" display: flex; align-items: stretch; width: 100%">
            <p class="duration" style="font-size: 12px; font-family: georgia; width: 50%; color: #23282c;">44- 30 days</p>
            <p class="penalty" style="font-size: 12px; font-family: georgia; width: 50%; color: #23282c;">50 % Penalty</p>
        </div>
        <div class="wrap" style=" display: flex; align-items: stretch; width: 100%">
            <p class="duration" style="font-size: 12px; font-family: georgia; width: 50%; color: #23282c;">29- 15 days</p>
            <p class="penalty" style="font-size: 12px; font-family: georgia; width: 50%; color: #23282c;">75 % Penalty</p>
        </div>
        <div class="wrap" style=" display: flex; align-items: stretch; width: 100%">
            <p class="duration" style="font-size: 12px; font-family: georgia; width: 50%; color: #23282c;">Less than 14 days</p>
            <p class="penalty" style="font-size: 12px; font-family: georgia; width: 50%; color: #23282c;">No refund at all</p>
        </div>
    </div>

</div>

</div>





    <hr>
    <div style="text-align: center; width: 100%; font-size: 12px; font-weight: bold; color: teal; font-family: Georgia">Crystal Tours</div>

</div>

</section>

      `;
      return content;
    }







    ngOnDestroy() {
      clearInterval(this.myInterval);
    }



}// Class DocumentBoardComponent
