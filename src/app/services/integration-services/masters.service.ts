import { Injectable } from '@angular/core';
import { HttpRequestHandler } from 'src/app/shared/common/app.model';
import { HttpService } from 'src/app/shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class MastersService {

  constructor(private httpService : HttpService) { 

  }

  REST_TYPE_GET: any = 'GET';
  REST_TYPE_POST: any = 'POST';
  REST_TYPE_PUT: any = 'PUT';
  REST_TYPE_DELETE: any = 'DELETE';
  APPLICATION_JSON:any = 'applicationJSON';
  MULTIPART:any = 'multipart';


  saveServiceMaster(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'service/services/saveServiceMaster';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_POST;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  updateServiceMaster(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'service/services/updateServiceMaster';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_PUT;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  fetchAllServiceMasters(inputData:any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'service/services/findAllServiceMasters';
    httpRequestHandler.type = this.REST_TYPE_POST;
    httpRequestHandler.body = inputData;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  deleteServiceMaster(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'service/services/deleteServiceMasterById';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    console.log(JSON.stringify(inputData))
    let req = {_id:inputData}
    console.log(req)

    httpRequestHandler.body = req;
    httpRequestHandler.type = this.REST_TYPE_DELETE;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  saveOrganization(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'organization/services/saveOrganization';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_POST;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  updateOrganization(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'organization/services/updateOrganization';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_PUT;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  fetchAllOrganizations() {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'organization/services/findAllOrganizations';
    httpRequestHandler.type = this.REST_TYPE_GET;
    httpRequestHandler.body = {};
    return this.httpService.restApiCall(httpRequestHandler);
  }

  deleteOrganization(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'organization/services/deleteOrganizationById';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    console.log(JSON.stringify(inputData))
    let req = {_id:inputData}
    console.log(req)

    httpRequestHandler.body = req;
    httpRequestHandler.type = this.REST_TYPE_DELETE;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  findOrganizationById(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'organization/services/findOrganizationById';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    console.log(JSON.stringify(inputData))
    let req = {_id:inputData}
    console.log(req)

    httpRequestHandler.body = req;
    httpRequestHandler.type = this.REST_TYPE_GET;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  saveTaxMaster(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'tax/services/saveTaxMaster';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_POST;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  updateTaxMaster(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'tax/services/updateTaxMaster';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_PUT;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  fetchAllTaxMasters(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'tax/services/findAllTaxMasters';
    httpRequestHandler.type = this.REST_TYPE_GET;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_POST;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  deleteTaxMaster(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'tax/services/deleteTaxMasterById';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    console.log(JSON.stringify(inputData))
    let req = {_id:inputData}
    console.log(req)

    httpRequestHandler.body = req;
    httpRequestHandler.type = this.REST_TYPE_DELETE;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  uploadFile(file: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'fileStore/services/singlefileupload';
    httpRequestHandler.contentType = this.MULTIPART;
    const formData: FormData = new FormData();
    formData.append('file', file);
    httpRequestHandler.body = formData;
    httpRequestHandler.type = this.REST_TYPE_POST;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  viewFile(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'fileStore/services/fileView';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    let req = {fileName:inputData}
    console.log(req)
    httpRequestHandler.body = req;
    httpRequestHandler.type = this.REST_TYPE_GET;
    return this.httpService.restApiCall(httpRequestHandler);
  }

  deleteFile(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'fileStore/services/singledelete';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    console.log(JSON.stringify(inputData))
    let req = {fileName:inputData}
    console.log(req)
    httpRequestHandler.body = req;
    httpRequestHandler.type = this.REST_TYPE_DELETE;
    return this.httpService.restApiCall(httpRequestHandler);
  }

}
