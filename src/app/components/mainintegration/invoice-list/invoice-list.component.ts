import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MainTransactionsService } from 'src/app/services/integration-services/main-transactions.service';
import { SharedDataServiceService } from 'src/app/services/shared/shared-data-service.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
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
  }

  findAllInvoices(invoiceFilter) {
    this.mainTransactionsService.findAllInvoices(invoiceFilter)?.subscribe(
      (response: any) => {
        if (response && response.status === "0") {
          this.invoices = response.data.invoices;
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
  }

  editInvoice(_id: any) {
    console.log(_id)
    this.router.navigate(['invoice/edit/' + _id]);
  }

  invoicePdfView(_id: any) {
    console.log(_id)
    this.router.navigate(['invoicePdf/view/' + _id]);
  }

  
 

}