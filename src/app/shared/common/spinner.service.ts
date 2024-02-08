import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerTimeout: any;
  constructor(private spinner: NgxSpinnerService) { }

  
  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    this.spinner.hide();
  }

  /*
  showSpinner() {
    this.spinner.show();
    this.spinnerTimeout = setTimeout(() => {
      this.hideSpinner(); // Hide after timeout
    }, 10000); 
  }
  */

}
