import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataServiceService {

  constructor() { }

  private orgIdNameDropdownValueSubject = new BehaviorSubject<string>(null);
  private orgInfoDropdownValueSubject = new BehaviorSubject<string>(null);

  organizationDropdownValue$ = this.orgIdNameDropdownValueSubject.asObservable();
  organizationInfoDropdownValue$ = this.orgInfoDropdownValueSubject.asObservable();


  updateOrganizationIDNameDropdownValue(newValue: string): void {
    this.orgIdNameDropdownValueSubject.next(newValue);
  }

  updateOrganizationInfoDropdownValue(newValue: string): void {
    this.orgInfoDropdownValueSubject.next(newValue);
  }

}
