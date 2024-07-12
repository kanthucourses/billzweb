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
import { LoginComponent } from './components/login/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { WebSocketExComponent } from './components/masters/web-socket-ex/web-socket-ex.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {path:'websocket',component:WebSocketExComponent},
  {path:'login',component:LoginComponent},
  {path:'home',component:HomePageComponent,canActivate: [AuthGuard]},
  {path:'services',component:ServiceMasterComponent,canActivate: [AuthGuard]},
  {path:'organization',component:OrganizationComponent,canActivate: [AuthGuard]},
  {path:'tax',component:TaxMasterComponent,canActivate: [AuthGuard]},
  {path:'invoice',component:InvoiceComponent,canActivate: [AuthGuard]},
  {path:'invoiceList',component:InvoiceListComponent,canActivate: [AuthGuard]},
  {path:'invoice/edit/:id',component:InvoiceComponent,canActivate: [AuthGuard]},
  {path:'invoicePdf',component:InvoicePdfComponent,canActivate: [AuthGuard]},
  {path:'invoicePdf/view/:id',component:InvoicePdfComponent,canActivate: [AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
