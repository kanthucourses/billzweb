import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MastersService } from 'src/app/services/integration-services/masters.service';
import { NgxSmartModalService } from 'ngx-smart-modal';


@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  organizationForm: FormGroup;
  operationalUnitValues: any = ["Yes", "No"];
  statusValues: any = ["Active", "In Active"];
  
  organization: any;
  organizations: any[] = [];
  saveEdit = "save";
  showRemoveIcon = false;

  constructor(private mastersService: MastersService,
    private toastr: ToastrService,
    private ngxSmartModalService: NgxSmartModalService,
    private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.createOrganizationForm();
    this.fetchAllOrganizations();
    //this.imageUrl;
  }

  createOrganizationForm() {
    this.organizationForm = this.fb.group({
      _id: [null],
      organizationID: [null],
      organizationName: [null],
      organizationIDName: [null],
      managerName: [null],
      address: [null],
      city: [null],
      state: [null],
      country: [null],
      pincode: [null],
      currency: [null],
      logo: [null],
      operationalUnit: [this.operationalUnitValues[0]],
      parentOrganizationInfo: this.fb.group({
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
      this.saveOrganization();
    }
    else {
      this.updateOrganization();
    }
  }

  appendOrganizationIDName() {
    let organizationID = this.organizationForm.get('organizationID').value;
    let organizationName = this.organizationForm.get('organizationName').value;
    this.organizationForm.get('organizationIDName').setValue(organizationID + ":" + organizationName);
  }

  saveOrganization() {
    this.organization = this.organizationForm.value;
    let matchedOrgInfo = this.getMatchedOrganization(this.organization.parentOrganizationInfo?.organizationIDName, this.organizations);
    this.organization.parentOrganizationInfo = matchedOrgInfo;
    this.organization.logo = this.fileNameResp;
    this.mastersService.saveOrganization(this.organization)?.subscribe(
      (response: any) => {
        if (response && response.status === "0" && response.data.organization) {
          this.clear();
          this.fetchAllOrganizations();
          
          this.toastr.success(response.statusMsg);
        }
        else {
          this.organizations = [];
        }
      }
      ,
      (error: any) => {
        this.organizations = [];
      }
    )
  }

  getMatchedOrganization(organizationIDName, organizations): any {
    let matchedOrganizationInfo = null;
    for (let org of organizations) {
      console.log(organizationIDName)
      console.log(org)
      console.log(organizations)
      if (org.organizationIDName === organizationIDName) {
        matchedOrganizationInfo = {
          "_id": org._id,
          "organizationID": org.organizationID,
          "organizationName": org.organizationName,
          "organizationIDName": org.organizationIDName
        }
        break;
      }
    }
    console.log(matchedOrganizationInfo)
    return matchedOrganizationInfo;
  }

  clear() {
    this.organizationForm.reset();
    this.organizationForm.controls['status'].setValue(this.statusValues[0]);
    this.organizationForm.controls['operationalUnit'].setValue(this.operationalUnitValues[0]);

    this.selectedFiles = null;
    this.file = null;
     this.fileNameResp = null;
     this.imageUrl = null;
     this.fileInput.nativeElement.value = '';
  }

  edit(organization: any) {
    window.scroll(0, 0);
    this.organizationForm.patchValue(organization);
    this.saveEdit = "update";
    this.imageUrl = null;
    this.fileNameResp = organization.logo;
    if(this.fileNameResp){
    this.getFileFromBinary(this.fileNameResp);
    }
  }

  updateOrganization() {
    this.organization = this.organizationForm.value;
    this.organization.logo = this.fileNameResp;
    this.mastersService.updateOrganization(this.organization)?.subscribe(
      (response: any) => {
        if (response && response.status === "0" && response.data.organization) {
          this.clear();
          this.fetchAllOrganizations();
          this.toastr.success(response.statusMsg);
        }
        else {
          this.organizations = [];
        }
      }
      ,
      (error: any) => {
        this.organizations = [];
      }
    )
  }

  fetchAllOrganizations() {
    this.mastersService.fetchAllOrganizations()?.subscribe(
      (response: any) => {
        if (response && response.status === "0") {
          this.organizations = response.data.organizations;
        }
        else {
          this.organizations = [];
        }
      }
      ,
      (error: any) => {
        this.organizations = [];
      }
    )
  }

  deleteOrganization(data: any) {
    this.organization = { name: 'organization', id: data._id }
    this.ngxSmartModalService.getModal('deletePopup').open();
  }

  getDeleteConfirmation(status: any) {
    console.log(status)
    if (status === 'Yes') {
      this.fetchAllOrganizations();
    }
  }

  selectedFiles: any;
  fileNameResp: any;
  file: File = null;
  imageUrl = null;
  selectFile(event: any) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles) {
      this.file = this.selectedFiles.item(0);
      console.log("file" +  this.file)
      this.showRemoveIcon = true;
      this.mastersService.uploadFile(this.file)?.subscribe(
        (response: any) => {
          if (response && response.status === "0" && response.data.FileName) {
            console.log(response.data.FileName);
            this.fileNameResp = response.data.FileName
            this.getFileFromBinary(this.fileNameResp);
            //this.clear();
            this.fetchAllOrganizations();
            // this.toastr.success(response.statusMsg);
          }
          else {
            this.organizations = [];
          }
        }
        ,
        (error: any) => {
          this.organizations = [];
        }
      )
    }
  }

 
  getFileFromBinary(fileNameValue: any) {
    //const req = {fileName: fileNameValue }
    console.log("fileNameValue" + fileNameValue)
    this.mastersService.viewFile(fileNameValue)?.subscribe(
      (response: any) => {
        // console.log(JSON.stringify(response));
        if (response && response.status === "0" && response.data.FileView) {
          console.log(JSON.stringify(response.data.FileView));
          let fileResponse = response.data.FileView;
          const base64Str = fileResponse.fileView;
          let imageBinary = base64Str;
          // let imageBase64String= btoa(imageBinary);
          //let imageBase64String = btoa(String.fromCharCode.apply(null, new Uint8Array(imageBinary)));
          console.log(JSON.stringify(imageBinary));
          this.imageUrl = imageBinary;
          //  this.imageUrl = 'data:image/jpeg;base64,' + imageBinary;
        }
        
      }
      ,
      (error: any) => {

      }
    )
  }

  @ViewChild('fileInput') fileInput: ElementRef;

  removeImage(logo: any) {
    console.log(logo)
    let deletedFileName = null;
    this.mastersService.deleteFile(logo).subscribe(
      (response: any) => {
        if (response && response.status === "0") {
          deletedFileName = response.data.file;
         this.updateOrganizationWithLogo();
         this.selectedFiles = null;
         this.file = null;
          this.fileNameResp = null;
          this.imageUrl = null;
          this.fileInput.nativeElement.value = '';
          this.showRemoveIcon = false;

        }
      }
      ,
      (error: any) => {

      }
    )
  }

  updateOrganizationWithLogo() {
    this.organization = this.organizationForm.value;
    if (this.organization.organizationIDName) {
      this.organization.logo = null;
      this.mastersService.updateOrganization(this.organization)?.subscribe(
        (response: any) => {
          if (response && response.status === "0" && response.data.organization) {
            // this.clear();
            this.fetchAllOrganizations();
            //this.toastr.success(response.statusMsg);
          }
        }
        ,
        (error: any) => {

        }
      )
    }
  }

}
