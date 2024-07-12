import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceDashboardComponent } from 'src/app/components/dashboards/invoice-dashboard/invoice-dashboard.component';
import { AuthGuard } from 'src/app/auth/auth.guard';



const routes: Routes
 = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {path:'invoice-dashboard',component:InvoiceDashboardComponent,canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
