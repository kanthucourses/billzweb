import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceDashboardComponent } from 'src/app/components/dashboards/invoice-dashboard/invoice-dashboard.component';
import { DashboardsRoutingModule } from '../dashboards-routing/dashboards-routing.module';
import { ChartModule } from 'primeng/chart';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    InvoiceDashboardComponent
  ],
  imports: [
    SharedModule,
    ChartModule,
    DashboardsRoutingModule
  ],
  exports: [
    InvoiceDashboardComponent
  ]
})
export class DashboardsModule { }
