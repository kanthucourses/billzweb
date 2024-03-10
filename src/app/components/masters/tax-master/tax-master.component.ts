import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MastersService } from 'src/app/services/integration-services/masters.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { SharedDataServiceService } from 'src/app/services/shared/shared-data-service.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Decimal } from 'decimal.js';

@Component({
  selector: 'app-tax-master',
  templateUrl: './tax-master.component.html',
  styleUrls: ['./tax-master.component.scss']
})
export class TaxMasterComponent implements OnInit,OnDestroy, AfterViewInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  taxMasterForm: FormGroup;
  statusValues: any = ["Active", "In Active"]
  taxMaster: any;
  taxMasters: any[] = [];
  saveEdit = "save";
  organizationIDName: any;
  organizationInfo: any;
  taxMasterFilter = {
    "taxName": null,
    "organizationIDName": null,
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
      console.log("organizationIDName>" + this.organizationIDName)
      this.taxMasterFilter.organizationIDName = this.organizationIDName;
      this.fetchAllTaxMasters(this.taxMasterFilter);
    });
    this.sharedDataService.organizationInfoDropdownValue$.subscribe(value => {
      this.organizationInfo = value;
    });
    this.createTaxMasterForm();
    //this.fetchAllTaxMasters();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
    };
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
      status: [this.statusValues[0]],
      length: [null],
      breadth: [null],
      height: [null]
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
          this.rerender();
          this.fetchAllTaxMasters(this.taxMasterFilter);
          this.toastr.success(response.statusMsg);
        }
        else {
          this.toastr.error(response.statusMsg);
        }
      }
      ,
      (error: any) => {
        this.toastr.error(error.error.statusMsg);
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
          this.rerender();
          this.fetchAllTaxMasters(this.taxMasterFilter);
          this.toastr.success(response.statusMsg);
        }
        else {
          this.toastr.success(response.statusMsg);
        }
      }
      ,
      (error: any) => {
        this.toastr.error(error.error.statusMsg);
      }
    )
  }

  fetchAllTaxMasters(taxMasterFilter) {
    this.mastersService.fetchAllTaxMasters(taxMasterFilter)?.subscribe(
      (response: any) => {
        if (response && response.status === "0") {
          this.taxMasters = response.data.taxMasters;
          this.rerender();
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


   space = 0;
  check2(){
    const form = this.taxMasterForm.value;
    this.space = form.length* form.breadth*form.height;
    TaxMasterComponent.multiply(form.length,form.breadth)
    console.log(form.length)
    console.log(TaxMasterComponent.valueOf(form.length))

  }

 
  check(){
    //const form = this.taxMasterForm.value;
    const form = {
      length: 0.1,   // Example length value
      breadth: 0.2   // Example breadth value
    };
    let space = TaxMasterComponent.multiply(form.length,form.breadth);
    let space2 = TaxMasterComponent.multiply(TaxMasterComponent.valueOf(form.length),TaxMasterComponent.valueOf(form.breadth))
    let spaceWithoutValueOf = TaxMasterComponent.multiply(form.length, form.breadth);
    console.log('Without valueOf:', spaceWithoutValueOf.toString());
    
    // Using valueOf
    let spaceWithValueOf = TaxMasterComponent.multiply(TaxMasterComponent.valueOf(form.length), TaxMasterComponent.valueOf(form.breadth));
    console.log('With valueOf:', spaceWithValueOf.toString());
    
    // Adding 0.1 to the results
    spaceWithoutValueOf = spaceWithoutValueOf.plus(0.1);
    spaceWithValueOf = spaceWithValueOf.plus(0.1);
    
    // Check if the results are equal
    console.log('Results are equal:', spaceWithoutValueOf.equals(spaceWithValueOf));
  }

  static readonly DEFAULT_PRECISION: number = 20;

  static valueOf(value: Decimal.Value): Decimal {
    return new Decimal(value);
  }

  static multiply(value1: Decimal.Value, value2: Decimal.Value): Decimal {
    return new Decimal(value1).times(value2);
  }

}
