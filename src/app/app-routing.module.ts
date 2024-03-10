import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceMasterComponent } from './components/service-master/service-master.component';
import { InvoiceComponent } from './components/mainintegration/invoice/invoice.component';
import { InvoiceListComponent } from './components/mainintegration/invoice-list/invoice-list.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { InvoicePdfComponent } from './components/mainintegration/invoice-pdf/invoice-pdf.component';
import { OrganizationComponent } from './components/masters/organization/organization.component';
import { TaxMasterComponent } from './components/masters/tax-master/tax-master.component';
import { InvoiceSummaryComponent } from './components/reports/invoice-summary/invoice-summary.component';
import { InvoiceDashboardComponent } from './components/dashboards/invoice-dashboard/invoice-dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {path:'home',component:HomePageComponent},
  {path:'services',component:ServiceMasterComponent},
  {path:'organization',component:OrganizationComponent},
  {path:'tax',component:TaxMasterComponent},
  {path:'invoice',component:InvoiceComponent},
  {path:'invoiceList',component:InvoiceListComponent},
  {path:'invoice/edit/:id',component:InvoiceComponent},
  {path:'invoicePdf',component:InvoicePdfComponent},
  {path:'invoicePdf/view/:id',component:InvoicePdfComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
