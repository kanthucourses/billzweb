import { DatePipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subject, Subscription } from 'rxjs';
import { MainTransactionsService } from 'src/app/services/integration-services/main-transactions.service';
import { SharedDataServiceService } from 'src/app/services/shared/shared-data-service.service';

@Component({
  selector: 'app-invoice-summary',
  templateUrl: './invoice-summary.component.html',
  styleUrls: ['./invoice-summary.component.scss']
})
export class InvoiceSummaryComponent implements OnInit {

  invoices : any[] =[];
  organizationIDName: any;
  organizationInfo: any;
  invoiceFilter = {
    "organizationIDName": null,
  }
  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;

  dataTableInitialized: boolean = false;
  dataTableInitialized2: boolean = false;

  organizationDropdownSubscription: Subscription;
  organizationInfoDropdownSubscription: Subscription;
  invoiceSummaryForm: FormGroup; 
  datePickerConfig: Partial<BsDatepickerConfig>;

  constructor(private fb: FormBuilder,
    private mainTransactionsService: MainTransactionsService,
    private sharedDataService: SharedDataServiceService,
    private datePipe: DatePipe) {
        this.datePickerConfig = Object.assign({},
            {
              containerClass: 'theme-dark-blue',
              showWeekNumbers: false,
              dateInputFormat: 'DD/MM/YYYY'
            });
     }

  ngOnInit(): void {
    this.createInvoiceSummaryFilterForm();
    this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 5,
      };
      this.organizationDropdownSubscription = this.sharedDataService.organizationDropdownValue$
      .subscribe(value => {
        if(value){
        //this.rerender();
        this.organizationIDName = value;
        this.invoiceFilter.organizationIDName = this.organizationIDName;
        this.findInvoiceSummaryReport();
      }
      });
    }
 
    createInvoiceSummaryFilterForm() {
        this.invoiceSummaryForm = this.fb.group({
          organizationIDName: [null],
          ageFrom: [null],
          ageTo: [null],
          invoiceDateFrom: [null],
          invoiceDateTo: [null]
        });
      }

      clear() {
        this.invoiceSummaryForm.reset();
      }
      
      findInvoiceSummaryReport() {
      const invoiceFilterValue = this.invoiceSummaryForm.value;
      const formattedInvoiceDateFrom = this.datePipe.transform(invoiceFilterValue.invoiceDateFrom, 'yyyy-MM-dd');
      const formattedInvoiceDateTo = this.datePipe.transform(invoiceFilterValue.invoiceDateTo, 'yyyy-MM-dd');

      invoiceFilterValue.organizationIDName = this.organizationIDName;
      invoiceFilterValue.invoiceDateFrom = formattedInvoiceDateFrom;
      invoiceFilterValue.invoiceDateTo = formattedInvoiceDateTo;
      console.log(this.invoiceFilter);
        this.mainTransactionsService.findInvoiceSummaryReport(invoiceFilterValue)?.subscribe(
          (response: any) => {
            if (response && response.status === "0") {
              this.invoices = response.data.invoices;
             // this.rerender();
             
            } else {
              this.invoices = [];
             // this.dtTrigger.next();
            }
          },
          (error: any) => {
            console.error('Error fetching invoices:', error);
            this.invoices = [];
            //this.dtTrigger.next();
          }
        );
      }
    
      ngAfterViewInit(): void {
        this.dtTrigger.next();
      }

      rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          this.dtTrigger.next();
          dtInstance.destroy();
        });
      }

      ngOnDestroy(): void {
        if (this.organizationDropdownSubscription) {
          this.organizationDropdownSubscription.unsubscribe();
        }
        if (this.organizationInfoDropdownSubscription) {
          this.organizationInfoDropdownSubscription.unsubscribe();
        }
        this.dtTrigger.unsubscribe();
      }

}
