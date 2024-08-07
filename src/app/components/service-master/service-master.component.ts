import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MastersService } from 'src/app/services/integration-services/masters.service';
import { SharedDataServiceService } from 'src/app/services/shared/shared-data-service.service';
import { SpinnerService } from 'src/app/shared/common/spinner.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { ServiceMasterWebSocketService } from 'src/app/services/integration-services/service-master-web-socket.service';

@Component({
  selector: 'app-service-master',
  templateUrl: './service-master.component.html',
  styleUrls: ['./service-master.component.scss']
})
export class ServiceMasterComponent implements OnInit, OnDestroy, AfterViewInit {

  serviceForm !: FormGroup;
  serviceMaster: any;
  serviceMasters: any[] = [];
  saveEdit = "save";
  taxMasters: any[] = [];
  dropdownSettings = {
    multiselect: false,
    singleSelection: false,
    idField: '_id',
    textField: 'taxNamePercentage',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 6,
    allowSearchFilter: true
  };

  constructor(private mastersService: MastersService,
    private toastr: ToastrService,
    private ngxSmartModalService: NgxSmartModalService,
    private fb: FormBuilder, private sharedDataService: SharedDataServiceService,
    private websocketService: ServiceMasterWebSocketService) {
    this.dropdownSettings;

  }

  organizationIDName: any;
  organizationInfo: any;
  serviceMasterFilter = {
    "serviceIDName": null,
    "organizationIDName": null,
  }
  taxMasterFilter = {
    "organizationIDName": null,
  }
  discountTypeValues: any = ["Percentage", "Amount"]
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  ngOnInit(): void {
    this.sharedDataService.organizationDropdownValue$.subscribe(value => {
      this.organizationIDName = value;
      console.log("organizationIDName>" + this.organizationIDName)
      this.serviceMasterFilter.organizationIDName = this.organizationIDName;
      console.log(this.serviceMasterFilter)
      this.findAllServiceMasters(this.serviceMasterFilter);
      this.fetchAllTaxMasters(this.taxMasterFilter);
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 5,
      };
    });
    this.sharedDataService.organizationInfoDropdownValue$.subscribe(value => {
      this.organizationInfo = value;
      console.log("organizationInfo>" + JSON.stringify(this.organizationInfo))
    });

    this.createServiceMasterForm();
    this.websocketService.getServiceMasters().subscribe((data: any[]) => {
      // Log received data to the console
      console.log('Received data from WebSocket:', data);
      
      // Update local data
      this.serviceMasters = data;
    });
   // this.spinnerService.showSpinner();
  }

  // showSpinner() {
  //   this.spinner.show(undefined, {
  //     type: 'ball-spin-clockwise',
  //     size: 'medium'
  //   });
  // }

  createServiceMasterForm() {
    this.serviceForm = this.fb.group({
      _id: [null],
      serviceID: [null, Validators.required],
      serviceName: [null, Validators.required],
      serviceIDName: [null],
      serviceCategory: [null],
      serviceCost: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      serviceDescription: [null, Validators.maxLength(255)],
      organizationInfo: this.fb.group({
        _id: [null],
        organizationID: [null],
        organizationName: [null],
        organizationIDName: [null]
      }),
      discountType:null,
      //taxMasterInfos: this.fb.array([this.createTaxMasterInfo()]),
      taxMasterInfos: null,
    });
  }

  createTaxMasterInfo() {
    return this.fb.group({
      _id: [null],
      taxName: [null],
      taxPercentage: [null],
      taxNamePercentage: [null]
    })
  }


  saveOrEdit() {
    if (this.saveEdit === "save") {
      this.saveServiceMaster();
    }
    else {
      this.updateServiceMaster();
    }
  }

  appendserviceIDName() {
    let serviceID = this.serviceForm.get('serviceID').value;
    let serviceName = this.serviceForm.get('serviceName').value;
    this.serviceForm.get('serviceIDName').setValue(serviceID + ":" + serviceName);
  }

  saveServiceMaster() {
    this.serviceMaster = this.serviceForm.value;
    //this.spinnerService.showSpinner();
    console.log(this.serviceMaster)
    let matchedTaxMasterInfo =null;
    if(this.serviceMaster.taxMasterInfos != null && this.serviceMaster.taxMasterInfos.length>0){
      matchedTaxMasterInfo = this.getMatchedTaxMaster(this.serviceMaster.taxMasterInfos, this.taxMasters);
    }
    this.serviceMaster.taxMasterInfos = matchedTaxMasterInfo;
    console.log(this.serviceMaster)
    this.serviceMaster.organizationInfo = this.organizationInfo;
   
    this.mastersService.saveServiceMaster(this.serviceMaster)?.subscribe(
      (response: any) => {
        if (response && response.status === "0" && response.data.serviceMaster) {
          this.clear();
          this.rerender();
          this.findAllServiceMasters(this.serviceMasterFilter);
          this.toastr.success(response.statusMsg);
         // this.spinnerService.hideSpinner();
        }
        else {
          console.log(response.statusMsg)
          this.toastr.error(response.statusMsg);
         // this.spinnerService.hideSpinner();
        }
      }
      ,
      (error: any) => {
        this.toastr.error(error.error.statusMsg);
       // this.spinnerService.hideSpinner();
      }
    )
  }



  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      this.dtTrigger.next();
      dtInstance.destroy();
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  clear() {
    this.serviceForm.reset();
    // this.serviceForm.setErrors(null);
    // Object.keys(this.serviceForm.controls).forEach(key => {
    //   this.serviceForm.get(key).setErrors(null);
    // })
    // this.serviceForm.markAsPristine(); 
    // this.serviceForm.markAsUntouched(); 
    //window.scroll(0, 0);
  }
  edit(serviceMaster: any) {
    window.scroll(0, 0);
    this.fetchAllTaxMasters(this.taxMasterFilter);
    console.log(serviceMaster.taxMasterInfos)
    this.serviceForm.patchValue(serviceMaster);
    // this.serviceForm['controls'].taxMasterInfos.setValue(serviceMaster.taxMasterInfos);
    // this.setTaxMasterInfos(serviceMaster);
    this.saveEdit = "update";
  }

  /*
  setTaxMasterInfos(serviceMaster: any) {
      const taxMasterInfos = this.serviceForm.get('taxMasterInfos') as FormArray;
  this.serviceForm.get('taxMasterInfos').setValue(taxMasterInfos.value);
      serviceMaster.taxMasterInfos.forEach(selectedTax => {
        taxMasterInfos.push(this.buildTaxMasterInfo(selectedTax));
      });
      this.serviceMaster.taxMasterInfos = taxMasterInfos;
  }

  buildTaxMasterInfo(selectedTax: any = null) {
    return this.fb.group({
      _id: [selectedTax ? selectedTax._id : null],
      taxName: [selectedTax ? selectedTax.taxName : null],
      taxPercentage: [selectedTax ? selectedTax.taxPercentage : null],
      taxNamePercentage: [selectedTax ? selectedTax.taxNamePercentage : null]

    });
  }
*/
  updateServiceMaster() {
    this.serviceMaster = this.serviceForm.value;
    this.mastersService.updateServiceMaster(this.serviceMaster)?.subscribe(
      (response: any) => {
        if (response && response.status === "0" && response.data.serviceMaster) {
          this.toastr.success(response.statusMsg);
          this.clear();
          this.rerender();
          this.findAllServiceMasters(this.serviceMasterFilter);
        }
        else {
          this.toastr.error(response.statusMsg);
          this.serviceMaster = {};
        }
      }
      ,
      (error: any) => {
        this.toastr.error(error.error.statusMsg);
      }
    )
  }

  findAllServiceMasters(serviceMasterFilter: any) {
    this.mastersService.fetchAllServiceMasters(serviceMasterFilter)?.subscribe(
      (response: any) => {
        if (response && response.status === "0") {
          this.serviceMasters = response.data.serviceMasters;
          this.rerender();
        }
        else {
          this.serviceMasters = [];
        }
      }
      ,
      (error: any) => {
        this.serviceMasters = [];
      }
    )
  }

  deleteServiceMaster(data: any) {
    this.serviceMaster = { name: 'servicemaster', id: data._id }
    this.ngxSmartModalService.getModal('deletePopup').open();
  }

  getDeleteConfirmation(status: any) {
    console.log(status)
    if (status === 'Yes') {
      this.findAllServiceMasters(this.serviceMasterFilter);
    }
  }


  fetchAllTaxMasters(taxMasterFilter): any {
    this.mastersService.fetchAllTaxMasters(taxMasterFilter)?.subscribe(
      (response: any) => {
        if (response && response.status === "0") {
          this.taxMasters = response.data.taxMasters;
          console.log(this.taxMasters)
          this.taxMasters.forEach(tax => {
            tax.taxNamePercentage = `${tax.taxName}:${tax.taxPercentage}`;
          });
        }
        else {
          this.taxMasters = [];
        }
      }
      ,
      (error: any) => {
        this.taxMasters = [];
      }
    )
  }

  getMatchedTaxMaster(taxMastersInput, taxMasters): any {
    let matchedTaxMasterInfos = [];
    let matchedTaxMasterInfo = null;
    if(taxMastersInput != null && taxMastersInput.length>0){
    for (let taxInput of taxMastersInput) {
      for (let tax of taxMasters) {
        console.log(taxInput._id)
        console.log(tax)
        console.log(taxMasters)
        if (taxInput._id === tax._id) {
          matchedTaxMasterInfo = {
            "_id": tax._id,
            "taxName": tax.taxName,
            "taxPercentage": tax.taxPercentage,
            "taxNamePercentage": tax.taxName + ":" + tax.taxPercentage
          }
          matchedTaxMasterInfos.push(matchedTaxMasterInfo);
        }
      }
    }
    }
    console.log(matchedTaxMasterInfos)
    return matchedTaxMasterInfos;
  }



}
