import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import { MainTransactionsService } from 'src/app/services/integration-services/main-transactions.service';
import { SharedDataServiceService } from 'src/app/services/shared/shared-data-service.service';
import { DatePipe, formatDate } from '@angular/common'

@Component({
  selector: 'app-invoice-dashboard',
  templateUrl: './invoice-dashboard.component.html',
  styleUrls: ['./invoice-dashboard.component.scss']
})
export class InvoiceDashboardComponent implements OnInit {

  invoices: any[] = [];
  basicData: any;
  basicOptions: any;
  //piechart
  serviceQtyData: any;
  serviceQtyOptions: any;
  serviceRevenueData: any;
  serviceRevenueOptions: any;

  invoiceRevenueForm: FormGroup;
  invoiceServicesForm: FormGroup;

  organizationIDName: any;
  organizationDropdownSubscription: Subscription;

  bsConfig: Partial<BsDatepickerConfig>;
  datePickerConfig: Partial<BsDatepickerConfig>;

  constructor(private fb: FormBuilder,
    private mainTransactionsService: MainTransactionsService,
    private sharedDataService: SharedDataServiceService,
    private datePipe: DatePipe) {
    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'YYYY',
      minMode: 'year' as BsDatepickerViewMode
    };
    this.datePickerConfig = Object.assign({},
      {
        containerClass: 'theme-dark-blue',
        showWeekNumbers: false,
        dateInputFormat: 'DD/MM/YYYY'
      });
  }

  ngOnInit() {
    this.createInvoicRevenueFilterForm();
    this.createInvoiceServicesFilterForm();
    this.organizationDropdownSubscription = this.sharedDataService.organizationDropdownValue$
      .subscribe(value => {
        if (value) {
          //this.rerender();
          this.organizationIDName = value;
          this.onYearChangeFetchServiceDate();

        }
      });
    //this.initializeDashboard();
    //this.initializeServicesChart(null);
  }


  initializeDashboard() {
    const labels = this.invoices.map(invoice => invoice.monthYear);

    this.basicData = {
      labels: labels,
      datasets: [
        {
          label: 'Sales',
          data: this.invoices.map(invoice => invoice.totalNetAmount),
          backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
          borderWidth: 1
        }
      ]
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: this.getTextColor()
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: this.getTextColorSecondary()
          },
          grid: {
            color: this.getSurfaceBorder(),
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: this.getTextColorSecondary()
          },
          grid: {
            color: this.getSurfaceBorder(),
            drawBorder: false
          }
        }
      }
    };
  }

  createInvoicRevenueFilterForm() {
    const currentDate = new Date();
    this.invoiceRevenueForm = this.fb.group({
      organizationIDName: [null],

      year: [currentDate.getFullYear()]
    });
  }

  createInvoiceServicesFilterForm() {
    const currentDate = new Date();
    const lastMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    // const formattedLastMonthStartDate = formatDate(lastMonthStartDate, 'dd/MM/yyyy', 'en');
    //const formattedLastMonthEndDate = formatDate(lastMonthEndDate, 'dd/MM/yyyy', 'en');

    this.invoiceServicesForm = this.fb.group({
      organizationIDName: [null],
      invoiceDateFrom: [lastMonthStartDate],
      invoiceDateTo: [lastMonthEndDate]
    });
  }


  onYearChange(event: Date) {
    if (event) {
      const selectedYear = event.getFullYear();
      console.log("Selected year:", selectedYear);
      console.log(this.invoiceRevenueForm);
      const invoiceFilter = this.invoiceRevenueForm.value;
      invoiceFilter.year = selectedYear;
      invoiceFilter.organizationIDName = this.organizationIDName;
      this.mainTransactionsService.findInvoicesRevenueByFilter(invoiceFilter)?.subscribe(
        (response: any) => {
          if (response && response.status === "0") {
            this.invoices = response.data.invoices;
            this.invoices = this.invoices.sort((a, b) => (a.monthYear > b.monthYear) ? 1 : ((b.monthYear > a.monthYear) ? -1 : 0));

            this.initializeDashboard();
          } else {
            console.error('Error fetching invoices:', response.statusMsg);
          }
        },
        (error: any) => {
          console.error('Error fetching invoices:', error);
        }
      );
    }
  }

  getTextColor(): string {
    const documentStyle = getComputedStyle(document.documentElement);
    return documentStyle.getPropertyValue('--text-color');
  }

  getTextColorSecondary(): string {
    const documentStyle = getComputedStyle(document.documentElement);
    return documentStyle.getPropertyValue('--text-color-secondary');
  }

  getSurfaceBorder(): string {
    const documentStyle = getComputedStyle(document.documentElement);
    return documentStyle.getPropertyValue('--surface-border');
  }


  onYearChangeFetchServiceDate() {
    const invoiceServicesFilter = this.invoiceServicesForm.value;
    if (invoiceServicesFilter) {
      const formattedInvoiceDateFrom = this.datePipe.transform(invoiceServicesFilter.invoiceDateFrom, 'yyyy-MM-dd');
      const formattedInvoiceDateTo = this.datePipe.transform(invoiceServicesFilter.invoiceDateTo, 'yyyy-MM-dd');

      invoiceServicesFilter.organizationIDName = this.organizationIDName;
      invoiceServicesFilter.invoiceDateFrom = formattedInvoiceDateFrom;
      invoiceServicesFilter.invoiceDateTo = formattedInvoiceDateTo;
      console.log(invoiceServicesFilter);
      this.mainTransactionsService.findServicesData(invoiceServicesFilter)?.subscribe(
        (response: any) => {
          if (response && response.status === "0") {
            const invoiceServicesData = response.data.invoiceServicesData;
           // localStorage.removeItem('baseColors')
            let baseColors = JSON.parse(localStorage.getItem('baseColors'));
            const dataLength = invoiceServicesData.length;

            if (!baseColors || baseColors.length !== dataLength) {
              baseColors = this.generateColors(dataLength, 1, 0.5);
              localStorage.setItem('baseColors', JSON.stringify(baseColors));
            }
            //const baseColors = this.generateColors(invoiceServicesData.length,1);
            this.initializeServicesQtyChart(invoiceServicesData, baseColors);
            this.initializeServicesRevenueChart(invoiceServicesData, baseColors);
          } else {
            console.error('Error fetching invoices:', response.statusMsg);
          }
        },
        (error: any) => {
          console.error('Error fetching invoices:', error);
        }
      );
    }
  }



  initializeServicesQtyChart(invoiceServicesData, baseColors) {
    let brightnessFactor = 1;
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const backgroundColors = baseColors;
    const hoverColors = baseColors;

    this.serviceQtyData = {
      labels: invoiceServicesData.map(invoice => invoice.serviceIDName),
      datasets: [
        {
          data: invoiceServicesData.map(invoice => invoice.quantity),
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverColors
        }
      ]
    };

    this.serviceQtyOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }

  initializeServicesRevenueChart(invoiceServicesData, baseColors) {
    let brightnessFactor = 1;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const backgroundColors = baseColors;
    const hoverColors = baseColors;
    // backgroundColors.map(color => this.shadeColor(color, 20));

    this.serviceRevenueData = {
      labels: invoiceServicesData.map(invoice => invoice.serviceIDName),
      datasets: [{
        data: invoiceServicesData.map(invoice => invoice.netAmount),
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverColors
      }]
    };

    this.serviceRevenueOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }


  /*
  generateColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
        // Generate random RGB colors
        const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        colors.push(color);
    }
    return colors;
  }
  */
  /*
  generateColors(count: number, brightnessFactor: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      // Generate random hue and saturation, and reduce brightness
      const hue = Math.floor(Math.random() * 360); // Random hue value between 0 and 360
      const saturation = Math.floor(Math.random() * 101); // Random saturation value between 0 and 100
      const lightness = 50 * brightnessFactor; // Adjust the lightness value based on the brightness factor
  
      // Convert HSL values to RGB
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      colors.push(color);
    }
    return colors;
  }
  */


  generateColors(count: number, brightnessFactor: number, alpha: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      // Generate random RGB colors with reduced brightness
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);

      // Reduce brightness by multiplying each RGB value by the brightness factor (between 0 and 1)
      const adjustedR = Math.floor(r * brightnessFactor);
      const adjustedG = Math.floor(g * brightnessFactor);
      const adjustedB = Math.floor(b * brightnessFactor);

      // Construct the RGBA color string
      const color = `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${alpha})`;
      colors.push(color);
    }
    return colors;
  }


  // to shade color
  shadeColor(color: string, percent: number): string {
    // Parse the color string to extract RGB components
    const [, r, g, b] = color.match(/\w\w/g);
    // Convert the RGB components to integers
    const R = parseInt(r, 16);
    const G = parseInt(g, 16);
    const B = parseInt(b, 16);

    // Adjust the RGB components based on the shading percentage
    const adjustedR = Math.round(R * (1 + percent / 100));
    const adjustedG = Math.round(G * (1 + percent / 100));
    const adjustedB = Math.round(B * (1 + percent / 100));

    // Ensure the adjusted RGB values stay within the valid range [0, 255]
    const finalR = Math.min(255, Math.max(0, adjustedR));
    const finalG = Math.min(255, Math.max(0, adjustedG));
    const finalB = Math.min(255, Math.max(0, adjustedB));

    // Convert the adjusted RGB values back to hexadecimal format
    const finalColor = `#${(finalR << 16 | finalG << 8 | finalB).toString(16).padStart(6, '0')}`;
    return finalColor;
  }


}
