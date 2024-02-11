import { Component, OnInit, ViewChild, ElementRef, TemplateRef, Input, AfterViewChecked } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MainTransactionsService } from 'src/app/services/integration-services/main-transactions.service';
import * as html2pdf from 'html2pdf.js';
import domtoimage from 'dom-to-image';
import 'jspdf-autotable';
import { ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/services/integration-services/masters.service';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-invoice-pdf',
  templateUrl: './invoice-pdf.component.html',
  styleUrls: ['./invoice-pdf.component.scss']
})
export class InvoicePdfComponent implements OnInit {

  invoiceObj: any = {};
  organization : any
  edit_id: any;
  @ViewChild('invoice') invoiceElement!: ElementRef;
   currentDate = new Date();

  constructor(private mainTransactionsService: MainTransactionsService,
    private mastersService: MastersService,
    private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.edit_id = this.route.snapshot.paramMap.get('id');
    if (this.edit_id) {
      this.viewInvoice(this.edit_id)
    }
  }

  viewInvoice(_id: any) {
  this.mainTransactionsService.findInvoiceById(_id).pipe(
    switchMap((response: any) => {
      if (response && response.status === "0" && response.data.invoice) {
        this.invoiceObj = response.data.invoice;
        console.log(this.invoiceObj);

        return this.findOrganizationById(this.invoiceObj.organizationInfo._id);
      } else {
        this.invoiceObj = {};
        return of(null); // return an observable with null value if the condition is not met
      }
    }),
    switchMap((organization: any) => {
      if (organization && organization.logo) {
        this.getFileFromBinary(organization.logo);
      }
      console.log(organization);

      return of(organization); // return the organization to the next operator
    })
  ).subscribe(
    (organization: any) => {
     // debugger
     this.organization = organization;
      console.log(organization);
    },
    (error: any) => {
      this.invoiceObj = {};
    }
  );
}

findOrganizationById(_id: any) {
  return this.mastersService.findOrganizationById(_id).pipe(
    map((response: any) => {
      if (response && response.status === "0" && response.data.organization) {
        return response.data.organization;
      } else {
        return {}; // return an empty object if the condition is not met
      }
    }),
    catchError((error: any) => {
      return of({}); // handle errors and return an empty object
    })
  );
}

  downloadPDF(){
    html2canvas(this.invoiceElement.nativeElement, { scale: 3 }).then((canvas) => {
      const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
      const fileWidth = 200;
      const generatedImageHeight = (canvas.height * fileWidth) / canvas.width;
      let PDF = new jsPDF('p', 'mm', [297, 210]);
      PDF.addImage(imageGeneratedFromTemplate, 'PNG', 0, 5, fileWidth, generatedImageHeight);
      PDF.setFont('helvetica');
      PDF.setFontSize(25);
      PDF.setTextColor(30, 30, 30);
      PDF.html(this.invoiceElement.nativeElement.innerHTML) 
      PDF.save('invoice.pdf');
    });
  }


  imageUrl :any = null;
  getFileFromBinary(fileNameValue: any) {
    //const req = {fileName: fileNameValue }
    this.mastersService.viewFile(fileNameValue)?.subscribe(
      (response: any) => {
        // console.log(JSON.stringify(response));
        if (response && response.status === "0" && response.data.FileView) {
          let fileResponse = response.data.FileView;
          const base64Str = fileResponse.fileView;
          let imageBinary = base64Str;
          // let imageBase64String= btoa(imageBinary);
          //let imageBase64String = btoa(String.fromCharCode.apply(null, new Uint8Array(imageBinary)));
          this.imageUrl = imageBinary;
          //  this.imageUrl = 'data:image/jpeg;base64,' + imageBinary;
        }
      }
      ,
      (error: any) => {

      }
    )
  }

}
