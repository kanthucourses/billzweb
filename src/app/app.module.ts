import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { NgSelectModule } from '@ng-select/ng-select';
import { TableModule } from 'primeng/table'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceMasterComponent } from './components/service-master/service-master.component';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { DeletemodelpopupComponent } from './components/common/deletemodelpopup/deletemodelpopup.component';
import { InvoiceComponent } from './components/mainintegration/invoice/invoice.component';
import { InvoiceListComponent } from './components/mainintegration/invoice-list/invoice-list.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { InvoicePdfComponent } from './components/mainintegration/invoice-pdf/invoice-pdf.component';
import { OrganizationComponent } from './components/masters/organization/organization.component';
import { TaxMasterComponent } from './components/masters/tax-master/tax-master.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';  
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InvoiceSummaryComponent } from './components/reports/invoice-summary/invoice-summary.component';
import { ImageModule } from 'primeng/image'; 
import { ChartModule } from 'primeng/chart';
import { InvoiceDashboardComponent } from './components/dashboards/invoice-dashboard/invoice-dashboard.component';
import { ReportsModule } from './modules/reports-module/reports-module';
import { SharedModule } from './modules/shared/shared.module';
import { ReportsRoutingModule } from './modules/reports-routing/reports-routing.module';
import { DashboardsModule } from './modules/dashboards/dashboards.module';
import { LoginComponent } from './components/login/login/login.component';
import { WebSocketExComponent } from './components/masters/web-socket-ex/web-socket-ex.component';

@NgModule({
  declarations: [
    AppComponent,
    ServiceMasterComponent,
    DeletemodelpopupComponent,
    InvoiceComponent,
    InvoiceListComponent,
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
    InvoicePdfComponent,
    OrganizationComponent,
    TaxMasterComponent,
    LoginComponent,
    WebSocketExComponent
  ],
  imports: [
    SharedModule,
    AppRoutingModule,
    RouterModule,
    ToastrModule.forRoot(
      {
        positionClass: 'toast-center',
        preventDuplicates: true
      }
    ),
    NgxSmartModalModule.forRoot(),
    NgSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    ReportsModule,
    DashboardsModule,
  ],
  providers: [DatePipe,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
],
  bootstrap: [AppComponent]
})
export class AppModule { }
