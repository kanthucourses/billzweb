import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceSummaryComponent } from 'src/app/components/reports/invoice-summary/invoice-summary.component';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ReportsRoutingModule } from '../reports-routing/reports-routing.module';


@NgModule({
  declarations: [
    InvoiceSummaryComponent
  ],
  imports: [
    SharedModule,
    ReportsRoutingModule
  ],
  exports: [
    InvoiceSummaryComponent
  ]
})
export class ReportsModule { }
