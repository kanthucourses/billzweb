import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { MastersService } from 'src/app/services/integration-services/masters.service';
import { SharedDataServiceService } from 'src/app/services/shared/shared-data-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  organizations: any[] = [];
  selectedOrganization : any;

  constructor(private mastersService: MastersService,
    private sharedDataService: SharedDataServiceService,
    private authService : AuthService,
    private router: Router) {

  }

  onDropdownChange(): void {
    console.log("header"+this.selectedOrganization)
    this.sharedDataService.updateOrganizationIDNameDropdownValue(this.selectedOrganization);
    let matchedOrganizationInfo = this.getMatchedOrganizationInfo(this.selectedOrganization,this.organizations);
    this.sharedDataService.updateOrganizationInfoDropdownValue(matchedOrganizationInfo);
  }

  ngOnInit(): void {
    this.fetchAllOrganizations();

  }


  getMatchedOrganizationInfo(selectedOrganization, organizations):any {
    let matchedOrganizationInfo = null;
  
    for (let org of organizations) {
      if (selectedOrganization === org.organizationIDName) {
        matchedOrganizationInfo = {
          "_id": org._id,
          "organizationID": org.organizationID,
          "organizationIDName": org.organizationIDName,
          "organizationName": org.organizationName
        }
        break;
      }
    }
    return matchedOrganizationInfo;
  }

  fetchAllOrganizations() {
    this.mastersService.fetchAllOrganizations()?.subscribe(
      (response: any) => {
        if (response && response.status === "0") {
          this.organizations = response.data.organizations;
          this.selectedOrganization = this.organizations[0].organizationIDName;
          this.sharedDataService.updateOrganizationIDNameDropdownValue(this.selectedOrganization);
          let matchedOrganizationInfo = this.getMatchedOrganizationInfo(this.selectedOrganization,this.organizations);
          this.sharedDataService.updateOrganizationInfoDropdownValue(matchedOrganizationInfo);
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

  logout(){
    const logout= this.authService.logout();
    this.router.navigate(['login']);
  }

}
