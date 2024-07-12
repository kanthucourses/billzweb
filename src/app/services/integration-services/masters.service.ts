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
    const isShowSpinner = true;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
  }

  updateServiceMaster(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'service/services/updateServiceMaster';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_PUT;
    const isShowSpinner = true;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
  }

  fetchAllServiceMasters(inputData:any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'service/services/findAllServiceMasters';
    httpRequestHandler.type = this.REST_TYPE_POST;
    httpRequestHandler.body = inputData;
    const isShowSpinner = false;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
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
    const isShowSpinner = false;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
  }

  saveOrganization(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'organization/services/saveOrganization';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_POST;
    const isShowSpinner = true;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
  }

  updateOrganization(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'organization/services/updateOrganization';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_PUT;
    const isShowSpinner = true;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
  }

  fetchAllOrganizations() {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'organization/services/findAllOrganizations';
    httpRequestHandler.type = this.REST_TYPE_GET;
    httpRequestHandler.body = {};
    const isShowSpinner = false;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
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
    const isShowSpinner = false;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
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
    const isShowSpinner = false;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
  }

  saveTaxMaster(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'tax/services/saveTaxMaster';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_POST;
    const isShowSpinner = true;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
  }

  updateTaxMaster(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'tax/services/updateTaxMaster';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_PUT;
    const isShowSpinner = true;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
  }

  fetchAllTaxMasters(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'tax/services/findAllTaxMasters';
    httpRequestHandler.type = this.REST_TYPE_GET;
    httpRequestHandler.body = inputData;
    httpRequestHandler.type = this.REST_TYPE_POST;
    const isShowSpinner = false;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
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
    const isShowSpinner = false;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
  }

  uploadFile(file: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'fileStore/services/singlefileupload';
    httpRequestHandler.contentType = this.MULTIPART;
    const formData: FormData = new FormData();
    formData.append('file', file);
    httpRequestHandler.body = formData;
    httpRequestHandler.type = this.REST_TYPE_POST;
    const isShowSpinner = false;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
  }

  viewFile(inputData: any) {
    const httpRequestHandler = new HttpRequestHandler();
    httpRequestHandler.url = 'fileStore/services/fileView';
    httpRequestHandler.contentType = this.APPLICATION_JSON;
    let req = {fileName:inputData}
    console.log(req)
    httpRequestHandler.body = req;
    httpRequestHandler.type = this.REST_TYPE_GET;
    const isShowSpinner = false;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
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
    const isShowSpinner = false;
    return this.httpService.restApiCall(httpRequestHandler,isShowSpinner);
  }

}
