import { Component, Input, OnInit, Output ,EventEmitter} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MainTransactionsService } from 'src/app/services/integration-services/main-transactions.service';
import { MastersService } from 'src/app/services/integration-services/masters.service';


@Component({
  selector: 'app-deletemodelpopup',
  templateUrl: './deletemodelpopup.component.html',
  styleUrls: ['./deletemodelpopup.component.scss']
})
export class DeletemodelpopupComponent implements OnInit {

  @Input() getInfo: any;
  @Output() deleteResponse = new EventEmitter();
  info :any;
  constructor(private mastersService: MastersService,
    private mainTransactionsService: MainTransactionsService,
    private toastr : ToastrService) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.info = this.getInfo;
  }

  delete() {
    console.log(this.info)
    console.log(this.info.name)
    console.log(this.info.id)

    switch (this.info.name) {
      case 'servicemaster': {
        this.mastersService.deleteServiceMaster(this.info.id).subscribe(
          (response:any) => {
            if (response && response.status === "0") {
              this.toastr.success('Deleted successfully');
              this.deleteResponse.emit('Yes');
            } else {
              this.toastr.error('Failed in deleting');
            }
          },
          (error:any) => {
            this.toastr.error('Failed in deleting');
          }
        );
        break;
      }
      case 'invoice': {
        this.mainTransactionsService.deleteInvoice(this.info.id,this.info.lineid,this.info.organizationIDName).subscribe(
          (response:any) => {
            if (response && response.status === "0") {
              this.toastr.success('Deleted successfully');
              let response = {
                status : "Yes",
                _id : this.info.id
              }
              this.deleteResponse.emit(response);
             // this.sendConfirmation.emit('Yes');
            } else {
              this.toastr.error('Failed in deleting');
            }
          },
          (error:any) => {
            this.toastr.error('Failed in deleting');
          }
        );
        break;
      }
      case 'organization': {
        this.mastersService.deleteOrganization(this.info.id).subscribe(
          (response:any) => {
            if (response && response.status === "0") {
              this.toastr.success('Deleted successfully');
              this.deleteResponse.emit('Yes');
            } else {
              this.toastr.error('Failed in deleting');
            }
          },
          (error:any) => {
            this.toastr.error('Failed in deleting');
          }
        );
        break;
      }
      case 'taxmaster': {
        this.mastersService.deleteTaxMaster(this.info.id).subscribe(
          (response:any) => {
            if (response && response.status === "0") {
              this.toastr.success('Deleted successfully');
              this.deleteResponse.emit('Yes');
            } else {
              this.toastr.error('Failed in deleting');
            }
          },
          (error:any) => {
            this.toastr.error('Failed in deleting');
          }
        );
        break;
      }
    }
  }

  undo(){

  }

}
