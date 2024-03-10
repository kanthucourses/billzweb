import { Injectable } from '@angular/core';
import { HttpRequestHandler } from 'src/app/shared/common/app.model';
import { HttpService } from 'src/app/shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class MainTransactionsService {

  constructor(private httpService : HttpService) { 

  }

  REST_TYPE_GET: any = 'GET';
  REST_TYPE_POST: any = 'POST';
  REST_TYPE_PUT: any = 'PUT';
  REST_TYPE_DELETE: any = 'DELETE';
  APPLICATION_JSON:any = 'applicationJSON';

  saveInvoice(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'invoice/services/saveInvoice';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_POST;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  updateInvoice(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'invoice/services/updateInvoice';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_PUT;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  findAllInvoices(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'invoice/services/findAllInvoices';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_POST;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  deleteInvoice(_id: any,lineID:any,organizationIDName:any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'invoice/services/deleteInvoiceById';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    let req = {
      _id:_id,
lineID : lineID,
organizationIDName : organizationIDName
    }
    console.log(req)

    httpRequestHandler.body = req;
    httpRequestHandler.type = this.REST_TYPE_DELETE;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  findInvoiceById(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'invoice/services/findInvoiceById';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    console.log(JSON.stringify(inputData))
    let req = {_id:inputData}
    console.log(req)

    httpRequestHandler.body = req;
    httpRequestHandler.type = this.REST_TYPE_GET;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  findInvoiceSummaryReport(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'invoice/services/findInvoiceSummaryReport';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_POST;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  findInvoicesRevenueByFilter(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'invoice/services/findInvoicesRevenueByFilter';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_POST;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  findServicesData(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'invoice/services/findServicesData';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_POST;
    return this.httpService.restApiCall(httpRequestHandler);
  }

}
