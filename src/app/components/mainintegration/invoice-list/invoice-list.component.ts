import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MainTransactionsService } from 'src/app/services/integration-services/main-transactions.service';
import { SharedDataServiceService } from 'src/app/services/shared/shared-data-service.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit, OnDestroy,AfterViewInit {
  enableChild: true;
  parentId: any = null;
  invoiceObj: any;
  invoices: any[] = [];
  invoiceLinesList: any[] = [];
  invoiceLinesHelperList: any[] = [];
  organizationIDName: any;
  organizationInfo: any;
  invoiceFilter = {
    "organizationIDName": null,
  }
  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: any = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;

  dataTableInitialized: boolean = false;
  dataTableInitialized2: boolean = false;

  organizationDropdownSubscription: Subscription;
  organizationInfoDropdownSubscription: Subscription;

  constructor(private fb: FormBuilder,
    private mainTransactionsService: MainTransactionsService,
    private toastr: ToastrService,
    private router: Router,
    private sharedDataService: SharedDataServiceService,
    private ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      //destroy:true
    };
    this.dtOptions2 = {
      pagingType: 'full_numbers',
      pageLength: 5,
     // destroy:true
    };
    
    this.organizationDropdownSubscription = this.sharedDataService.organizationDropdownValue$
    .subscribe(value => {
      if(value){
      console.log("check");
      console.log(value);
      //debugger
      this.rerender();
      this.organizationIDName = value;
      this.invoiceFilter.organizationIDName = this.organizationIDName;
      this.invoiceLinesHelperList = [];
      this.findAllInvoices(this.invoiceFilter);
    }
    });
  

    this.organizationInfoDropdownSubscription = this.sharedDataService.organizationInfoDropdownValue$.subscribe(value => {
      this.organizationInfo = value;
      console.log("organizationInfo>" + JSON.stringify(this.organizationInfo))
    });
    console.log(">>");
    //this.findAllInvoices(this.invoiceFilter);

  }

  findAllInvoices(invoiceFilter) {
    this.mainTransactionsService.findAllInvoices(invoiceFilter)?.subscribe(
      (response: any) => {
        if (response && response.status === "0") {
          this.invoices = response.data.invoices;
          this.getInvoiceLines();
          if (!this.dataTableInitialized) {
            this.dtTrigger.next();
            this.dataTableInitialized = true;
          } else {
            this.dtTrigger.next();
            this.dtTrigger2.next();
           // this.rerender();
          }
         
        } else {
          this.invoices = [];
          this.dtTrigger.next();
          this.dtTrigger2.next();
          //this.rerender();
        }
      },
      (error: any) => {
        console.error('Error fetching invoices:', error);
        this.invoices = [];
        this.dtTrigger.next();
        this.dtTrigger2.next();
        //this.rerender();
      }
    );
  }

  getInvoiceLines() {
    this.invoiceLinesHelperList = [];
    this.invoices.forEach(invoice => {
      invoice.invoiceLines.forEach((line: any) => {
        line.invoiceID = invoice.invoiceID;
        this.invoiceLinesHelperList.push({ ...line });
      });
    });
    if (!this.dataTableInitialized2) {
      this.dtTrigger2.next();
      this.dataTableInitialized2 = true;
    }

  }

  editInvoice(_id: any) {
    console.log(_id)
    this.router.navigate(['invoice/edit/' + _id]);
  }

  invoicePdfView(_id: any) {
    console.log(_id)
    this.router.navigate(['invoicePdf/view/' + _id]);
  }

  rerender(): void {
    if(this.dtElements){
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          //this.dtTrigger.next();
          //this.dtTrigger2.next();
        });
      }
    });
  }
  }

  ngAfterViewInit(): void {
   // this.rerender();
    //this.dtTrigger.next();
    //this.dtTrigger2.next();

  }

  ngOnDestroy(): void {
    if (this.organizationDropdownSubscription) {
      this.organizationDropdownSubscription.unsubscribe();
    }
    if (this.organizationInfoDropdownSubscription) {
      this.organizationInfoDropdownSubscription.unsubscribe();
    }
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }
 
  deleteInvoice(invoice: any, invoiceLine: any) {
    let _id = null;
    let lineID = null;
    if (invoice != null && invoice) {
      _id = invoice._id;
    }
    else if (invoiceLine != null && invoiceLine) {
      _id = invoiceLine._id;
    }
    if (invoiceLine != null && invoiceLine) {
      lineID = invoiceLine.lineID;
    }
    this.invoiceObj = { name: 'invoice', id: _id, lineid: lineID, organizationIDName: this.organizationIDName }
    console.log(this.invoiceObj)
    this.ngxSmartModalService.getModal('deletePopup').open();
  }

  
  getDeleteConfirmation(response: any) {
    if (response.status === 'Yes') {
      this.rerender();
      this.invoiceLinesHelperList = [];
      this.findAllInvoices(this.invoiceFilter);
    }
  }


}