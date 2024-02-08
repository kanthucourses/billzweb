import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { MainTransactionsService } from 'src/app/services/integration-services/main-transactions.service';
import { SharedDataServiceService } from 'src/app/services/shared/shared-data-service.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit, OnDestroy {
  enableChild: true;
  parentId: any = null;
  invoice: any;
  invoices: any[] = [];
  invoiceLinesList: any[] = [];
  invoiceLinesHelperList: any[] = [];
  organizationIDName: any;
  organizationInfo: any;
  invoiceFilter = {
    "organizationIDName": null,
  }
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: any = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;

  constructor(private fb: FormBuilder,
    private mainTransactionsService: MainTransactionsService,
    private toastr: ToastrService,
    private router: Router,
    private sharedDataService: SharedDataServiceService) { }

  ngOnInit(): void {
    this.sharedDataService.organizationDropdownValue$.subscribe(value => {
      this.organizationIDName = value;
    });
    this.sharedDataService.organizationInfoDropdownValue$.subscribe(value => {
      this.organizationInfo = value;
      console.log("organizationInfo>" + JSON.stringify(this.organizationInfo))
    });
    this.invoiceFilter.organizationIDName = this.organizationIDName;
    this.findAllInvoices(this.invoiceFilter);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
    };
  }

  findAllInvoices(invoiceFilter) {
    this.mainTransactionsService.findAllInvoices(invoiceFilter)?.subscribe(
      (response: any) => {
        if (response && response.status === "0") {
          this.invoices = response.data.invoices;
          this.dtTrigger.next();
          this.getInvoiceLines();
          console.log(this.invoiceLinesHelperList)
        }
        else {
          this.invoices = [];
        }
      }
      ,
      (error: any) => {
        this.invoices = [];
      }
    )
  }

  getInvoiceLines() {
    this.invoices.forEach(invoice => {
      invoice.invoiceLines.forEach((line: any) => {
        line.invoiceID = invoice.invoiceID;
        this.invoiceLinesHelperList.push({ ...line });
      });
    });
    this.dtTrigger2.next();
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
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
      }
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }
 

}