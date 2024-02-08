import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpRequestHandler } from './common/app.model';
import { SpinnerService } from './common/spinner.service';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  
  constructor(private http: HttpClient,private spinnerService:SpinnerService) {
    this.http = http;
  }

  headers!: HttpHeaders;
  private CONTENT_APPLICATION_URLENCODED: any = 'application/x-www-form-urlencoded';
  private CONTENT_APPLICATION_JSON: any = 'application/json';
  private CONTENT_MULTIPART: any = 'multipart/form-data';
  baseURL: string = environment.baseUrl;


  restApiCall(httpRequestHandler: HttpRequestHandler): Observable<any> {
    this.spinnerService.showSpinner();
    
    return this.restService(httpRequestHandler).pipe(
        catchError(error => {
            throw error;
        }),
        finalize(() => {
            this.spinnerService.hideSpinner();
        })
    );
}
  restService(httpRequestHandler: HttpRequestHandler) :Observable<any> {
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
     return throwError('Invalid HTTP method');
  }

  getMethod(httpRequestHandler: HttpRequestHandler):Observable<any>  {   
     const paramString = this.getParamString(httpRequestHandler.body ? httpRequestHandler.body : {});
    const url = this.baseURL + httpRequestHandler.url +paramString;
    return this.http.get(url, { headers: this.headers })
  }

  postMethod(httpRequestHandler: HttpRequestHandler):Observable<any>  {
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

  putMethod(httpRequestHandler: HttpRequestHandler):Observable<any>  {
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

  deleteMethod(httpRequestHandler: HttpRequestHandler):Observable<any>  {
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
