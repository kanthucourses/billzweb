import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MastersService } from 'src/app/services/integration-services/masters.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { SharedDataServiceService } from 'src/app/services/shared/shared-data-service.service';

@Component({
  selector: 'app-tax-master',
  templateUrl: './tax-master.component.html',
  styleUrls: ['./tax-master.component.scss']
})
export class TaxMasterComponent implements OnInit {
  taxMasterForm: FormGroup;
  statusValues: any = ["Active", "In Active"]
  taxMaster: any;
  taxMasters: any[] = [];
  saveEdit = "save";
  organizationIDName:any;
  organizationInfo :any;
  taxMasterFilter = {
    "taxName":null,
    "organizationIDName":null,
  }
  constructor(private mastersService: MastersService,
    private toastr: ToastrService,
    private ngxSmartModalService: NgxSmartModalService,
    private fb: FormBuilder,
    private sharedDataService: SharedDataServiceService) {

  }

  ngOnInit(): void {
    this.sharedDataService.organizationDropdownValue$.subscribe(value => {
      this.organizationIDName = value;
      console.log("organizationIDName>"+this.organizationIDName)
      this.taxMasterFilter.organizationIDName = this.organizationIDName;
      this.fetchAllTaxMasters(this.taxMasterFilter);
    });
    this.sharedDataService.organizationInfoDropdownValue$.subscribe(value => {
      this.organizationInfo = value;
    });
this.createTaxMasterForm();
//this.fetchAllTaxMasters();

  }

  createTaxMasterForm() {
    this.taxMasterForm = this.fb.group({
      _id: [null],
      taxName: [null],
      taxPercentage: [null],
      state: [null],
      country: [null],
      organizationInfo: this.fb.group({
        _id: [null],
        organizationID: [null],
        organizationName: [null],
        organizationIDName: [null]
      }),
      status: [this.statusValues[0]]
    });
  }

  saveOrEdit() {
    if (this.saveEdit === "save") {
      this.saveTaxMaster();
    }
    else {
      this.updateTaxMaster();
    }
  }

  saveTaxMaster() {
    this.taxMaster = this.taxMasterForm.value;
    this.taxMaster.organizationInfo = this.organizationInfo;
    this.mastersService.saveTaxMaster(this.taxMaster)?.subscribe(
      (response: any) => {
        if (response && response.status === "0" && response.data.taxMaster) {
          this.clear();
          this.fetchAllTaxMasters(this.taxMasterFilter);
          this.toastr.success(response.statusMsg);
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

  clear() {
    this.taxMasterForm.reset();
    this.taxMasterForm.controls['status'].setValue(this.statusValues[0]);
  }

  edit(taxMaster: any) {
    window.scroll(0, 0);
    this.taxMasterForm.patchValue(taxMaster);
    this.saveEdit = "update";
  }

  updateTaxMaster() {
    this.taxMaster = this.taxMasterForm.value;
    this.mastersService.updateTaxMaster(this.taxMaster)?.subscribe(
      (response: any) => {
        if (response && response.status === "0" && response.data.taxMaster) {
          this.clear();
          this.fetchAllTaxMasters(this.taxMasterFilter);
          this.toastr.success(response.statusMsg);
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

  fetchAllTaxMasters(taxMasterFilter) {
    this.mastersService.fetchAllTaxMasters(taxMasterFilter)?.subscribe(
      (response: any) => {
        if (response && response.status === "0") {
          this.taxMasters = response.data.taxMasters;
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

  deleteTaxMaster(data: any) {
    this.taxMaster = { name: 'taxmaster', id: data._id }
    this.ngxSmartModalService.getModal('deletePopup').open();
  }

  getDeleteConfirmation(status: any) {
    console.log(status)
    if (status === 'Yes') {
      this.fetchAllTaxMasters(this.taxMasterFilter);
    }
  }



}
