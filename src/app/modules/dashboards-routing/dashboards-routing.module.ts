import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceDashboardComponent } from 'src/app/components/dashboards/invoice-dashboard/invoice-dashboard.component';



const routes: Routes
 = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {path:'invoice-dashboard',component:InvoiceDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
