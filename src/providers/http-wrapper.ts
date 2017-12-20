import {Injectable} from '@angular/core';
import {HTTP as nativeHttp} from '@ionic-native/http';
import {HttpClient as angularHttp, HttpHeaders, HttpRequest} from "@angular/common/http";
import {checkAvailability} from '@ionic-native/core';
import {Observable} from "rxjs/Observable";
import "rxjs";

@Injectable()
export class HttpWrapper {
  protected nativeIsAvailable: boolean | null = null;

  public nativeHttp: any = false;
  public angularHttp: any = false;

  constructor(private native: nativeHttp, private angular: angularHttp) {
    this.nativeHttp = native;
    this.angularHttp = angular;
  }

  public isNativeHttpAvailable() {
    if (this.nativeIsAvailable === null) {
      this.nativeIsAvailable = checkAvailability('cordova.plugin.http') === true || checkAvailability('cordovaHTTP') === true;
    }
    return this.nativeIsAvailable;
  }

  public get(url: string, options?: HttpRequest<any>): Observable<any> {
    let modifiedOptions = options;
    if (options) {
      modifiedOptions = options.clone({
        "method": "GET"
      });
    } else {
      modifiedOptions = new HttpRequest('GET', url);
    }
    return this.request(url, modifiedOptions);
  }

  public post(url: string, body: any, options?: HttpRequest<any>): Observable<any> {
    let modifiedOptions = options;
    if (options) {
      modifiedOptions = options.clone({
        "method": "POST"
      });
    } else {
      modifiedOptions = new HttpRequest('POST', url, body);
    }
    return this.request(url, modifiedOptions, body);
  }

  public put(url: string, body: any, options?: HttpRequest<any>): Observable<any> {
    let modifiedOptions = options;
    if (options) {
      modifiedOptions = options.clone({
        "method": "PUT"
      });
    } else {
      modifiedOptions = new HttpRequest('PUT', url, body);
    }
    return this.request(url, modifiedOptions, body);
  }

  public delete(url: string, options?: HttpRequest<any>): Observable<any> {
    let modifiedOptions = options;
    if (options) {
      modifiedOptions = options.clone({
        "method": "DELETE"
      });
    } else {
      modifiedOptions = new HttpRequest('DELETE', url);
    }
    return this.request(url, modifiedOptions);
  }

  public request(url: string, options: HttpRequest<any>, data?: Object): Observable<any> {
    if (this.isNativeHttpAvailable()) {
      let headers: Headers | {} | null = options.headers;
      if (headers instanceof Headers) {
        let newHeaders: any = {};
        headers.forEach(function (value, name) {
          newHeaders[name.toString()] = value.toString();
        });
        headers = newHeaders;
      }
      switch (options.method) {
        case 'GET':
          if (data == null) {
            data = options.params;
          }
          return Observable.fromPromise(this.nativeHttp.get(url, data, headers)).map((res: any) => {
            return {
              json() {
                return JSON.parse(res.data);
              },
              text(ignoredEncodingHint) {
                return res.data.toString();
              },
              data: res.data,
              headers: new Headers(res.headers)
            }
          });
        case 'POST':
          return Observable.fromPromise(this.nativeHttp.post(url, data, headers)).map((res: any) => {
            return {
              json() {
                return JSON.parse(res.data);
              },
              text(ignoredEncodingHint) {
                return res.data.toString();
              },
              data: res.data,
              headers: new Headers(res.headers)
            }
          });
        case 'PUT':
          if (data == null) {
            data = options.params != null ? options.params : {};
          }
          return Observable.fromPromise(this.nativeHttp.put(url, data, headers)).map((res: any) => {
            return {
              json() {
                return JSON.parse(res.data);
              },
              text(ignoredEncodingHint) {
                return res.data.toString();
              },
              data: res.data,
              headers: new Headers(res.headers)
            }
          });
        case 'DELETE':
          return Observable.fromPromise(this.nativeHttp.delete(url, data, headers)).map((res: any) => {
            return {
              json() {
                return JSON.parse(res.data);
              },
              text(ignoredEncodingHint) {
                return res.data.toString();
              },
              data: res.data,
              headers: new Headers(res.headers)
            }
          });
        default:
          throw 'Request Method not found';
      }
    } else {
      //Make an @angular/common/http request
      let modifiedOptions = options.clone({
        'url': url
      });
      if (options.headers === undefined) {
        modifiedOptions = options.clone({
          "headers": new HttpHeaders()
        });
      }
      if (data) {
        modifiedOptions = modifiedOptions.clone({
          "body": JSON.stringify(data)
        });
      }
      return this.angularHttp.request(modifiedOptions);
    }
  }
}
