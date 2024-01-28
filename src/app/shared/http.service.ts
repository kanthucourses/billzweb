import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpRequestHandler } from './common/app.model';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  
  constructor(private http: HttpClient) {
    this.http = http;
  }

  headers!: HttpHeaders;
  private CONTENT_APPLICATION_URLENCODED: any = 'application/x-www-form-urlencoded';
  private CONTENT_APPLICATION_JSON: any = 'application/json';
  private CONTENT_MULTIPART: any = 'multipart/form-data';
  baseURL: string = environment.baseUrl;

  restApiCall(httpRequestHandler: HttpRequestHandler) {
    return this.restService(httpRequestHandler);
  }

  restService(httpRequestHandler: HttpRequestHandler) :any{
    if (httpRequestHandler.type === 'GET') {
      return this.getMethod(httpRequestHandler);
    } 
    else if (httpRequestHandler.type === 'POST') {
      return this.postMethod(httpRequestHandler);
    }
    else if (httpRequestHandler.type === 'PUT') {
       return this.putMethod(httpRequestHandler);
     }
      else if (httpRequestHandler.type === 'DELETE') {
       return this.deleteMethod(httpRequestHandler);
     }
  }

  getMethod(httpRequestHandler: HttpRequestHandler) {   
     const paramString = this.getParamString(httpRequestHandler.body ? httpRequestHandler.body : {});
    const url = this.baseURL + httpRequestHandler.url +paramString;
    return this.http.get(url, { headers: this.headers })
  }

  postMethod(httpRequestHandler: HttpRequestHandler) {
    console.log(JSON.stringify(httpRequestHandler))
    this.headers = null;
    const url = this.baseURL + httpRequestHandler.url;
    if (httpRequestHandler.contentType === 'formEncoded') {
      this.headers = new HttpHeaders({ 'Content-Type': this.CONTENT_APPLICATION_URLENCODED });
    } 
    else if (httpRequestHandler.contentType === 'applicationJSON') {
      this.headers = new HttpHeaders({ 'Content-Type': this.CONTENT_APPLICATION_JSON });
    }
    else if (httpRequestHandler.contentType === 'multipart') {
      //this.headers = new HttpHeaders({ 'Content-Type': this.CONTENT_MULTIPART });
    }
    console.log(JSON.stringify(this.headers))
    return this.http.post(url, httpRequestHandler.body,{ headers: this.headers })
  }

  putMethod(httpRequestHandler: HttpRequestHandler) {
    const url = this.baseURL + httpRequestHandler.url;
    if (httpRequestHandler.contentType === 'formEncoded') {
      this.headers = new HttpHeaders({ 'Content-Type': this.CONTENT_APPLICATION_URLENCODED });
    } else if (httpRequestHandler.contentType === 'applicationJSON') {
      this.headers = new HttpHeaders({ 'Content-Type': this.CONTENT_APPLICATION_JSON });
    }
    else if (httpRequestHandler.contentType === 'multipart') {
      this.headers = new HttpHeaders({ 'Content-Type': this.CONTENT_MULTIPART });
    }
    return this.http.put(url, httpRequestHandler.body,{ headers: this.headers })
  }

  deleteMethod(httpRequestHandler: HttpRequestHandler) {
    console.log(httpRequestHandler.body)
    const paramString = this.getParamString(httpRequestHandler.body ? httpRequestHandler.body : {});
    console.log(paramString)
    const url = this.baseURL + httpRequestHandler.url+paramString;
    if (httpRequestHandler.contentType === 'applicationJSON') {
      this.headers = new HttpHeaders({ 'Content-Type': this.CONTENT_APPLICATION_JSON });
    }
    
    return this.http.delete(url, { headers: this.headers })
  }

 getParamString(data: any) {
    let returnValue = '';
    if (data) {
      for (const key of Object.keys(data)) {
        if (data[key] && data[key] != null && data[key] !== '') {
          returnValue = returnValue === '' ? '?' : returnValue + '&'
          returnValue = returnValue + key + '=' + data[key];
        }
      }
    }
    return returnValue;
  }

}
