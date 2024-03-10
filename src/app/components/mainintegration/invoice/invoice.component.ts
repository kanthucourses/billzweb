import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { MainTransactionsService } from 'src/app/services/integration-services/main-transactions.service';
import { MastersService } from 'src/app/services/integration-services/masters.service';
import { SharedDataServiceService } from 'src/app/services/shared/shared-data-service.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  saveEdit = "save";
  firstOptionOpacity = 0.5;

  invoiceForm !: FormGroup;
  invoiceLinesForm !: FormGroup;
  invoiceLines !: FormArray;
  //invoiceLineForm : FormGroup;
  invoice: any;
  invoices: any[] = [];
  invoiceLinesList: any[] = [];
  invoiceLinesHelperList: any[] = [];
  edit_id: any;
  serviceMasters: any[] = [];
  taxMasters: any[] = [];
  totalTaxAmount: number = 0;
  invoiceDate: any;
  taxDetailsList = [];
  finalTaxDetailsList = [];
  taxMasterInfos = [];
  serviceTaxMasterInfos = [];
  invoiceLineHelperObj = {
    "lineID": null,
    "invoiceLineID": null,
    "serviceID": null,
    "serviceName": null,
    "serviceIDName": null,
    "serviceCategory": null,
    "serviceDescription": null,
    "quantity": null,
    "serviceCost": null,
    "amount": null,
    "currency": null,
    "taxMasterInfosDropdownData": null,
    "taxMasterInfos": null,
    "taxDetailsList": null,
    "discountType": null,
    "discountPercentage": null,
    "discountAmount": null,
    "taxAmount": null,
    "grossAmount": null,
    "netAmount": null
  }
  invoiceLinesHelperArr = []
  discountType = null;
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
  dropDownSelect = false;
  organizationIDName: any;
  organizationInfo: any;
  serviceMasterFilter = {
    "serviceIDName": null,
    "organizationIDName": null,
  }
  taxMasterFilter = {
    "organizationIDName": null,
  }
  invoiceFilter = {
    "invoiceID": null,
    "organizationIDName": null,
  }
 

  //serviceSelectValidation : any
  //serviceQtyValidation : any
  //@ViewChild('serviceSelectValidation', { read: NgModel }) serviceSelectValidation: NgModel;
  /*
  @ViewChild('serviceSelectValidation', { read: NgModel }) serviceSelectValidation: NgModel | undefined;
  @ViewChild('serviceCostValidation', { read: NgModel }) serviceCostValidation: NgModel | undefined;
  @ViewChild('quantityValidation', { read: NgModel }) quantityValidation: NgModel | undefined;

  
  isServiceValid(): boolean {
    const isServiceSelectValid = this.serviceSelectValidation ? this.serviceSelectValidation.valid : true;
    const isServiceCostValid = this.serviceCostValidation ? this.serviceCostValidation.valid : true;
    const isQuantityValid = this.quantityValidation ? this.quantityValidation.valid : true;
  console.log(isServiceSelectValid)
  console.log(isServiceCostValid)
  console.log(isQuantityValid)
    return isServiceSelectValid && isServiceCostValid && isQuantityValid;
  }
  */

  @ViewChildren('serviceSelectValidation') serviceSelectValidations!: QueryList<NgModel>;
  @ViewChildren('serviceCostValidation') serviceCostValidations!: QueryList<NgModel>;
  @ViewChildren('quantityValidation') quantityValidations!: QueryList<NgModel>;


  ngAfterViewInit(): void {
    this.isServiceValid();
  }

  isServiceValid(): boolean {
    let isValid = true;

    // Check if the query lists are defined
    if (!this.serviceSelectValidations || !this.serviceCostValidations || !this.quantityValidations) {
      return false; // Return false if any query list is undefined
    }

    this.serviceSelectValidations.forEach((serviceSelectValidation, index) => {
      const serviceCostValidation = this.serviceCostValidations.toArray()[index];
      const quantityValidation = this.quantityValidations.toArray()[index];

      // Check if any of the validations for the current invoice line are invalid
      if (!serviceSelectValidation.valid || !serviceCostValidation.valid || !quantityValidation.valid) {
        isValid = false;
        return; 
      }
    });

    return isValid;
  }

  //taxChangeFlag = true;
  calculationInProgress = false;
  isDelete: boolean = true;
  isReadOnly: boolean = false;
  isUpdateBtnReadOnly: boolean = false;
  isPaymentDone: boolean = false;
  initializeComponent(): void {
    this.saveEdit = "save";
    this.isDelete = true;
    this.isReadOnly = false;
    this.isUpdateBtnReadOnly = false;
    this.isPaymentDone = false;
  }
  //@ViewChild('ngSelectElement') ngSelectElement: ElementRef;

  datePickerConfig: Partial<BsDatepickerConfig>;
  constructor(private fb: FormBuilder,
    private mainTransactionsService: MainTransactionsService,
    private toastr: ToastrService,
    private ngxSmartModalService: NgxSmartModalService,
    private route: ActivatedRoute,
    private mastersService: MastersService,
    private sharedDataService: SharedDataServiceService,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    private el: ElementRef) {
    this.datePickerConfig = Object.assign({},
      {
        containerClass: 'theme-dark-blue',
        showWeekNumbers: false,
        dateInputFormat: 'DD/MM/YYYY'
      });
  }

  // @ViewChild(BsDatepickerDirective, { static: false }) datepicker?: BsDatepickerDirective;
  ngOnInit(): void {
    this.sharedDataService.organizationDropdownValue$.subscribe(value => {
      this.organizationIDName = value;
      this.serviceMasterFilter.organizationIDName = this.organizationIDName;
      this.findAllServiceMasters(this.serviceMasterFilter);
      this.taxMasterFilter.organizationIDName = this.organizationIDName;
      this.fetchAllTaxMasters(this.taxMasterFilter);

    });
    this.sharedDataService.organizationInfoDropdownValue$.subscribe(value => {
      this.organizationInfo = value;
    });
    this.createInvoiceForm();
    this.invoiceFilter.organizationIDName = this.organizationIDName;
    this.invoiceFilter.invoiceID = this.invoiceForm.value.invoiceID;
    //this.findAllInvoices(this.invoiceFilter);
    this.edit_id = this.route.snapshot.paramMap.get('id');
    if (this.edit_id) {
      this.editInvoiceList(this.edit_id)
    }

  }


  createInvoiceForm() {
    this.invoiceForm = this.fb.group({
      _id: [null],
      invoiceID: [null],
      totalGrossAmount: [null],
      totalDiscountAmount: [null],
      totalNetAmount: [null],
      customerDetails: this.fb.group({
        customerName: [null,Validators.required],
        phoneNumber: [null,Validators.required],
        alternativePhoneNumber: [null],
        emailID: [null],
        address: [null],
        city: [null],
        state: [null],
        country: [null],
        pincode: [null],
        age: [null,Validators.required],
        gender: [null],
      }),
      organizationInfo: this.fb.group({
        _id: [null],
        organizationID: [null],
        organizationName: [null],
        organizationIDName: [null]
      }),
      invoiceStatus: [null],
      paymentMethod: [null],
      paymentStatus: [null],
      createdDateTime : [null],
      lastUpdatedDateTime : [null]
      // invoiceLines: this.fb.array([]),
    })
  }

  createInvoiceLine() {
    this.invoiceLinesForm = this.fb.group({
      invoiceLineID: [null],
      serviceID: [null],
      serviceName: [null],
      serviceIDName: [null],
      serviceCategory: [null],
      serviceCost: [null],
      serviceDescription: [null],
      quantity: [null],
      grossAmount: [null],
      taxAmount: [null],
      discountPercentage: [null],
      discountType: [null],
      discountAmount: [null],
      netAmount: [null],
      taxMasterInfos: null,
      taxDetailsList: null
    })
    return this.invoiceLinesForm;
  }

  // getInvoiceHelperTaxMasterInfo(invoiceLineID: any, index: number): any {
  //   let invoiceLinesHelperResult = null;
  //   for (let invoiceLinesHelper of this.invoiceLinesHelperArr) {
  //     if (invoiceLineID === invoiceLinesHelper.invoiceLineID) {
  //       invoiceLinesHelperResult = invoiceLinesHelper;
  //       break;
  //     }
  //   }
  //   return invoiceLinesHelperResult;
  // }

  get getInvoiceLineControls() {
    const control = this.invoiceForm.get('invoiceLines') as FormArray;
    return control;
  }

  getTaxDetailsList(index: number) {
    console.log(index);
    return [this.invoiceForm.get('invoiceLines')['controls'][index]['controls']['taxDetailsList'].value]
  }

  addControl() {
    console.log(this.invoiceLineHelperObj)
    this.invoiceLineHelperObj = {
      "lineID":null,
      "invoiceLineID": null,
      "serviceID": null,
      "serviceName": null,
      "serviceIDName": null,
      "serviceCategory": null,
      "serviceDescription": null,
      "quantity": null,
      "serviceCost": null,
      "amount": null,
      "currency": null,
      "taxMasterInfosDropdownData": null,
      "taxMasterInfos": null,
      "taxDetailsList": null,
      "discountType": null,
      "discountPercentage": null,
      "discountAmount": null,
      "taxAmount": null,
      "grossAmount": null,
      "netAmount": null
    }
    console.log(this.invoiceLineHelperObj)

    this.invoiceLinesHelperArr.push(this.invoiceLineHelperObj)
    console.log(this.invoiceLinesHelperArr)
  }

  removeInvoiceLine(index: number) {
    console.log(index)
    console.log(this.invoiceLinesHelperArr)
    if (this.invoiceLinesHelperArr != null && this.invoiceLinesHelperArr.length > 0) {
      if (index > -1) {
        this.invoiceLinesHelperArr.splice(index, 1);
      }
    }
    console.log(this.invoiceLinesHelperArr)
    this.totalAmountCalculation();
    return this.invoiceLinesHelperArr;
    this.taxMasterInfos = []
  }

  ontaxSelect(event) {
    console.log(this.dropDownSelect)
    if (this.dropDownSelect) {
      this.dropDownSelect = false;
    };
    console.log(event)
    console.log(event.value)
  }

  changeInvoiceDate() {
    console.log(this.invoiceDate)
    const formattedDate = this.datePipe.transform(this.invoiceDate, 'yyyy-MM-dd');
    console.log(formattedDate);
  }

  onTaxChange(event: any, invoiceLine: any, index: number) {
    console.log(event);
    this.amountCalculation(invoiceLine, index);
    this.totalAmountCalculation();
  }


  amountCalculation(invoiceLine: any, index: number) {
    if (this.calculationInProgress) {
      return;
    }
    this.calculationInProgress = true;
    console.log(index)
    console.log(invoiceLine)
    const invoiceLineObj = this.invoiceLinesHelperArr[index];
    let quantity: any = invoiceLine?.quantity
    let serviceCost: any = invoiceLine?.serviceCost
    let grossAmount: any = quantity * serviceCost;
    let totalTaxAmount = 0;
    let taxDetailsList = null;
    console.log("taxDetailsList" + JSON.stringify(taxDetailsList))

    if (invoiceLine.taxMasterInfos != null && invoiceLine.taxMasterInfos.length > 0) {
      console.log("invoiceLine.taxMasterInfos" + JSON.stringify(invoiceLine.taxMasterInfos))

      let taxMasterInfos = this.getMatchedTaxMaster(invoiceLine.taxMasterInfos, this.taxMasters);
      taxDetailsList = this.buildTaxDetailsList(taxMasterInfos, grossAmount);
      this.taxDetailsList = taxDetailsList;
      if (taxMasterInfos != null) {
        for (let taxMasterInfo of taxMasterInfos) {
          let taxPercentage = taxMasterInfo?.taxPercentage
          let taxAmount = grossAmount * (taxPercentage / 100)
          totalTaxAmount = totalTaxAmount + taxAmount;
        }
      }
    }
    console.log("taxDetailsList" + JSON.stringify(taxDetailsList))

    invoiceLineObj.taxDetailsList = taxDetailsList;
    let discountType: any = invoiceLine?.discountType
    let discountPercentage: any = invoiceLine?.discountPercentage
    let discountAmount: any = invoiceLine?.discountAmount
    let discount = 0;


    let amountAfterTax = grossAmount + totalTaxAmount
    if (discountPercentage != null && discountPercentage != "undefined") {
      discount = amountAfterTax * (discountPercentage / 100);
    }

    console.log(totalTaxAmount)
    let netAmount = amountAfterTax - discount
    invoiceLineObj.grossAmount = grossAmount;
    invoiceLineObj.discountAmount = discount;
    invoiceLineObj.taxAmount = totalTaxAmount;
    invoiceLineObj.discount = discount;
    invoiceLineObj.netAmount = netAmount;
    this.invoiceLinesHelperArr[index] = { ...this.invoiceLinesHelperArr[index], ...invoiceLineObj };
    console.log(this.invoiceLinesHelperArr)
    this.calculationInProgress = false;
  }

  buildTaxDetailsList(taxMastersInfos, amount): any {
    let matchedTaxDetailsList = [];
    let matchedTaxDetails = null;
    for (let tax of taxMastersInfos) {
      let taxAmount = 0;
      if (amount != null) {
        taxAmount = amount * (tax.taxPercentage / 100)
      }
      matchedTaxDetails = {
        "_id": tax._id,
        "taxName": tax.taxName,
        "taxPercentage": tax.taxPercentage,
        "taxNamePercentage": tax.taxName + ":" + tax.taxPercentage,
        "taxAmount": taxAmount,
      }
      matchedTaxDetailsList.push(matchedTaxDetails);
    }
    return matchedTaxDetailsList;
  }

  totalAmountCalculation() {
    if (this.calculationInProgress) {
      return;
    }
    this.calculationInProgress = true;
    let totalGrossAmount = 0;
    let totalTaxAmount = 0;
    let totalDiscountAmount = 0;
    let totalNetAmount = 0
    let taxDetailsListArr = []
    console.log("invoiceLinesHelperArr" + JSON.stringify(this.invoiceLinesHelperArr))

    this.invoiceLinesHelperArr.forEach((invoiceLine) => {
      totalGrossAmount = totalGrossAmount + invoiceLine?.grossAmount;
      totalTaxAmount = totalTaxAmount + invoiceLine?.taxAmount;
      totalDiscountAmount = totalDiscountAmount + invoiceLine?.discountAmount;
      totalNetAmount = totalNetAmount + invoiceLine?.netAmount;
      if (invoiceLine.taxDetailsList != null && invoiceLine.taxDetailsList.length > 0) {
        taxDetailsListArr.push(...invoiceLine.taxDetailsList);
      }

    });

    console.log(totalTaxAmount)
    console.log("taxDetailsListArr" + JSON.stringify(taxDetailsListArr))
    const groupByTaxNameResultArray: any[] = Object.values(taxDetailsListArr.reduce((accumulator, currentItem) => {
      const key = currentItem.taxName;
      if (!accumulator[key]) {
        accumulator[key] = { ...currentItem, taxAmount: 0, taxPercentage: 0 };
      }
      accumulator[key].taxAmount += currentItem.taxAmount;
      accumulator[key].taxPercentage += currentItem.taxPercentage;
      return accumulator;
    }, {} as { [key: string]: any }));

    this.finalTaxDetailsList = groupByTaxNameResultArray;
    console.log("finalTaxDetailsList" + JSON.stringify(this.finalTaxDetailsList))
    this.totalTaxAmount = totalTaxAmount;
    this.invoiceForm.get('totalGrossAmount').setValue(totalGrossAmount);
    //this.invoiceForm.get('totalTaxAmount').setValue(totalTaxAmount);
    this.invoiceForm.get('totalDiscountAmount').setValue(totalDiscountAmount);
    this.invoiceForm.get('totalNetAmount').setValue(totalNetAmount);
    this.calculationInProgress = false;
  }

  saveOrEdit() {
    console.log(this.saveEdit)
    if (this.saveEdit === "save") {
      this.saveInvoice();
    }
    else {
      this.updateInvoice();
    }
  }

  invoiceStatus : any = null;
  confirmInvoice() {
    console.log(this.invoice)
    this.invoiceStatus = "Confirmed"
    this.updateInvoice();
  }

  saveInvoice() {
    this.invoice = this.invoiceForm.value;
    const formattedInvoiceDate = this.datePipe.transform(this.invoiceDate, 'yyyy-MM-dd');

    this.invoice.totalTaxAmount = this.totalTaxAmount
    this.invoice.taxDetailsList = this.finalTaxDetailsList
    this.invoice.organizationInfo = this.organizationInfo;
    this.invoice.invoiceDate = formattedInvoiceDate;
    this.invoice.invoiceLines = this.invoiceLinesHelperArr;
    console.log(this.invoice)
    this.mainTransactionsService.saveInvoice(this.invoice)?.subscribe(
      (response: any) => {
        if (response && response.status === "0" && response.data.invoice) {
          this.clear();
          this.invoiceFilter.organizationIDName = this.organizationIDName;
          this.invoiceFilter.invoiceID = response.data.invoice.invoiceID;
          this.findAllInvoices(this.invoiceFilter);
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

  updateInvoice() {
    this.invoice = this.invoiceForm.value;
    console.log(this.invoice)
    console.log(this.totalTaxAmount)
    this.invoice.totalTaxAmount = this.totalTaxAmount
    this.invoice.taxDetailsList = this.finalTaxDetailsList
    this.invoice.invoiceLines = this.invoiceLinesHelperArr;
    //this.invoiceStatus = this.invoice.invoiceStatus;
    this.invoice.invoiceStatus = this.invoiceStatus
    console.log(this.invoice)
    const formattedInvoiceDate = this.datePipe.transform(this.invoiceDate, 'yyyy-MM-dd');
    this.invoice.invoiceDate = formattedInvoiceDate;
    this.mainTransactionsService.updateInvoice(this.invoice)?.subscribe(
      (response: any) => {
        if (response && response.status === "0" && response.data.invoice) {
          this.clear();
          this.invoiceFilter.organizationIDName = this.organizationIDName;
          this.invoiceFilter.invoiceID = response.data.invoice.invoiceID;
          this.findAllInvoices(this.invoiceFilter);
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

  /*
  findnvoiceById(_id: any): any {
    this.mainTransactionsService.findInvoiceById(_id).subscribe(
      (response: any) => {
        if (response && response.status === "0" && response.data.invoice) {
          this.invoiceObject = response.data.invoice;
          console.log(this.invoiceObject)

        }
        else {
          this.invoiceObject = null;
        }
      }
      ,
      (error: any) => {
        this.invoiceObject = null;
      }
    )

  }
  */

  editInvoiceList(_id: any) {
    this.mainTransactionsService.findInvoiceById(_id).subscribe(
      (response: any) => {
        if (response && response.status === "0" && response.data.invoice) {
          const invoice = response.data.invoice;
          this.edit(invoice);
        }
        else {
          this.invoices = [];
        }
      }
      ,
      (error: any) => {
        this.invoices = [];
      }
    )

  }

  formatToOriginalInvoiceDate(date: any): any {
    let originalInvoiceDate = null;
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      originalInvoiceDate = parsedDate;
    } else {
      console.error('Invalid date format');
    }
    return originalInvoiceDate;
  }

  edit(invoice: any) {
    console.log(invoice);
    window.scroll(0, 0);
    this.saveEdit = "update";
    this.invoiceStatus = invoice.invoiceStatus;
    if (invoice.invoiceStatus && invoice.invoiceStatus === "Confirmed") {
      this.isReadOnly = true;
      this.isDelete = false;
    }
    if (invoice.paymentStatus && invoice.paymentStatus === "Paid") {
      this.isUpdateBtnReadOnly = true;
      this.isPaymentDone = true;
    }

    this.totalTaxAmount = invoice?.totalTaxAmount
    this.finalTaxDetailsList = invoice?.taxDetailsList
    //const formattedInvoiceDate = this.datePipe.transform(invoice.invoiceDate, 'yyyy-MM-dd');
    const originalInvoiceDate = this.formatToOriginalInvoiceDate(invoice?.invoiceDate);
    this.invoiceDate = originalInvoiceDate;

    this.invoiceForm.patchValue({
      // notes: this.expense.notes,
      _id: invoice?._id,
      invoiceID: invoice?.invoiceID,
      totalGrossAmount: invoice?.totalGrossAmount,
      totalDiscountAmount: invoice?.totalDiscountAmount,
      totalNetAmount: invoice?.totalNetAmount,
      organizationInfo: invoice?.organizationInfo,
      invoiceStatus: invoice?.invoiceStatus,
      paymentMethod: invoice?.paymentMethod,
      paymentStatus: invoice?.paymentStatus,
      createdDateTime : invoice?.createdDateTime,
      lastUpdatedDateTime : invoice?.lastUpdatedDateTime,
      customerDetails: {
        customerName: invoice?.customerDetails?.customerName,
        phoneNumber: invoice?.customerDetails?.phoneNumber,
        alternativePhoneNumber: invoice?.customerDetails?.alternativePhoneNumber,
        emailID: invoice?.customerDetails?.emailID,
        address: invoice?.customerDetails?.address,
        city: invoice?.customerDetails?.city,
        state: invoice?.customerDetails?.state,
        country: invoice?.customerDetails?.country,
        pincode: invoice?.customerDetails?.pincode,
        age:invoice?.customerDetails?.age,
        gender:invoice?.customerDetails?.gender
      },
    })

    this.invoices = [];
    this.invoiceLinesHelperArr = [];
    if (invoice._id && invoice._id != null) {
      this.findInvoiceById(invoice._id).subscribe((invoiceObject: any) => {
        console.log(invoiceObject)
        if (invoiceObject) {
          this.invoices.push(invoiceObject);
          this.invoiceLinesHelperArr = [];
          if (invoiceObject.invoiceLines != null && invoiceObject.invoiceLines.length > 0) {
            for (let invoiceLine of invoiceObject.invoiceLines) {
              let serviceObj = this.getMatchedServiceMaster(invoiceLine.serviceIDName, this.serviceMasters);
              invoiceLine.taxMasterInfosDropdownData = serviceObj?.taxMasterInfos;
              this.invoiceLinesHelperArr.push(invoiceLine)
            }
          }
          console.log(this.invoiceLinesHelperArr)
          this.getInvoiceLines();
          this.totalAmountCalculation();
        } else {
          console.log(invoiceObject)
        }
      });
    }
    else {
      this.invoiceLinesHelperArr = [];
      if (invoice.invoiceLines != null && invoice.invoiceLines.length > 0) {
        for (let invoiceLine of invoice.invoiceLines) {
          let serviceObj = this.getMatchedServiceMaster(invoiceLine.serviceIDName, this.serviceMasters);
          invoiceLine.taxMasterInfosDropdownData = serviceObj?.taxMasterInfos;
          this.invoiceLinesHelperArr.push(invoiceLine)
        }
      }
    }

    console.log(this.invoiceForm.value)
  }

  setInvoiceLines(invoice: any) {
    let control = this.invoiceForm.get('invoiceLines') as FormArray;
    invoice.invoiceLines.forEach(x => {
      this.taxDetailsList = x?.taxDetailsList;
      this.taxMasterInfos = x?.taxMasterInfos;
      control.push(this.fb.group(x));
    })
  }

  clear() {
    this.invoiceForm.reset();
    this.taxMasterInfos = [];
    this.totalTaxAmount = 0;
    this.finalTaxDetailsList = []
    this.invoiceDate = null;
    this.invoiceLinesHelperArr = []
    //window.scroll(0, 0);
  }

  findAllInvoices(invoiceFilter: any) {
    this.mainTransactionsService.findAllInvoices(invoiceFilter)?.subscribe(
      (response: any) => {
        if (response && response.status === "0") {
          this.invoices = response.data.invoices;
          this.getInvoiceLines();
        }
        else {
          this.invoices = [];
        }
      }
      ,
      (error: any) => {
        this.invoices = [];
      }
    )
  }

  getInvoiceLines() {
    this.invoiceLinesHelperList = []
    this.invoices.forEach(invoice => {
      invoice.invoiceLines.forEach((line: any) => {
        line._id = invoice._id;
        line.invoiceID = invoice.invoiceID;
        this.invoiceLinesHelperList.push({ ...line });
      });
    });
  }

  deleteInvoice(invoice: any, invoiceLine: any) {
    let _id = null;
    let lineID = null;
    if (invoice != null && invoice) {
      _id = invoice._id;
    }
    else if (invoiceLine != null && invoiceLine) {
      _id = invoiceLine._id;
    }
    if (invoiceLine != null && invoiceLine) {
      lineID = invoiceLine.lineID;
    }
    this.invoice = { name: 'invoice', id: _id, lineid: lineID, organizationIDName: this.organizationIDName }
    console.log(this.invoice)
    this.ngxSmartModalService.getModal('deletePopup').open();
  }

  
  getDeleteConfirmation(response: any) {
    if (response.status === 'Yes') {
      this.initializeComponent();
      this.invoices = [];
      let _id = response._id;
      this.findInvoiceById(_id).subscribe((invoiceObject: any) => {
        console.log(invoiceObject)
        if (invoiceObject) {
          this.invoices.push(invoiceObject);
          this.invoiceLinesHelperArr = [];
          if (invoiceObject.invoiceLines != null && invoiceObject.invoiceLines.length > 0) {
            for (let invoiceLine of invoiceObject.invoiceLines) {
              let serviceObj = this.getMatchedServiceMaster(invoiceLine.serviceIDName, this.serviceMasters);
              invoiceLine.taxMasterInfosDropdownData = serviceObj?.taxMasterInfos;
              this.invoiceLinesHelperArr.push(invoiceLine)
            }
          }
          console.log(this.invoiceLinesHelperArr)
          this.getInvoiceLines();
          this.totalAmountCalculation();
        } else {
          this.clear()
          this.invoices = []
          this.invoiceLinesHelperList = [];
          console.log(invoiceObject)
        }
      });
    }
  }

  findInvoiceById(_id: any): Observable<any> {
    return this.mainTransactionsService.findInvoiceById(_id).pipe(
      switchMap((response: any) => {
        if (response && response.status === "0" && response.data.invoice) {
          const invoiceObject = response.data.invoice;
          console.log(invoiceObject);
          return of(invoiceObject);
        } else {
          return of(null);
        }
      }),
      catchError((error: any) => {
        console.error('Error fetching invoice:', error);
        return of(null);
      })
    );
  }

  findAllServiceMasters(serviceMasterFilter) {
    this.mastersService.fetchAllServiceMasters(serviceMasterFilter)?.subscribe(
      (response: any) => {
        if (response && response.status === "0") {
          this.serviceMasters = response.data.serviceMasters;
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

  serviceSelectedP: any;
  onServiceSelect(serviceSelected: any, index: number) {
    console.log(serviceSelected)
    console.log(this.invoiceLinesHelperArr)
    let selectedValue = serviceSelected;
    const invoiceLineObj = this.invoiceLinesHelperArr[index];
    if (selectedValue) {
      for (var service of this.serviceMasters) {
        if (selectedValue && service.serviceIDName === selectedValue) {
          let quantity = 1;
          invoiceLineObj.serviceID = service?.serviceID;
          invoiceLineObj.serviceName = service?.serviceName;
          invoiceLineObj.serviceCost = service?.serviceCost;
          invoiceLineObj.serviceCategory = service?.serviceCategory;
          invoiceLineObj.serviceDescription = service?.serviceDescription;
          console.log(service)
          invoiceLineObj.quantity = quantity;
          invoiceLineObj.discountType = service?.discountType;
          let grossAmount = (service?.serviceCost != null ? service?.serviceCost : 0) * quantity;
          invoiceLineObj.grossAmount = grossAmount;
          invoiceLineObj.taxMasterInfosDropdownData = service?.taxMasterInfos;
          console.log(invoiceLineObj.taxMasterInfosDropdownData)
          invoiceLineObj.taxMasterInfos = service?.taxMasterInfos;

          let netAmount = 0;
          let totalTaxAmount = 0;
          if (service?.taxMasterInfos != null && service?.taxMasterInfos.length > 0) {
            let taxDetailsList: any[] = this.buildTaxDetailsList(service?.taxMasterInfos, grossAmount);
            if (taxDetailsList != null) {
              for (let taxDetails of taxDetailsList) {
                totalTaxAmount = totalTaxAmount + taxDetails.taxAmount;
              }
            }
            invoiceLineObj.taxDetailsList = taxDetailsList;
          }
        
          netAmount = grossAmount + totalTaxAmount;
          invoiceLineObj.taxAmount = totalTaxAmount;
          invoiceLineObj.netAmount = netAmount;

          break;
        }
      }
    }
    this.invoiceLinesHelperArr[index] = { ...this.invoiceLinesHelperArr[index], ...invoiceLineObj };
    console.log(this.invoiceLinesHelperArr)
    this.totalAmountCalculation();

  }

  onDropDownClear(event) {
    const control = this.invoiceForm.get('invoiceLines') as FormArray;
    control.reset();
  }

  fetchAllTaxMasters(taxMasterFilter): any {
    this.mastersService.fetchAllTaxMasters(taxMasterFilter)?.subscribe(
      (response: any) => {
        if (response && response.status === "0") {
          this.taxMasters = response.data.taxMasters;
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
    for (let taxInput of taxMastersInput) {
      for (let tax of taxMasters) {
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
    return matchedTaxMasterInfos;
  }

  getMatchedServiceMaster(serviceIDName, serviceMasters): any {
    let matchedServiceObj = null;;
    for (let service of serviceMasters) {
      if (serviceIDName === service.serviceIDName) {
        matchedServiceObj = service;
        break;
      }

    }
    return matchedServiceObj;
  }


  onTaxDropdownChange(event) {
    console.log('Dropdown value changed:', event);
    // console.log('Dropdown value changed:', this.t);

  }


}