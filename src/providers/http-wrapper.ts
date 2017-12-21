import {Injectable} from '@angular/core';
import {HTTP} from '@ionic-native/http';
import {HttpClient, HttpClient as angularHttp, HttpHeaders, HttpRequest} from "@angular/common/http";
import {checkAvailability} from '@ionic-native/core';
import {Observable} from "rxjs/Observable";
import "rxjs";

@Injectable()
export class HttpWrapper {
  protected nativeIsAvailable: boolean | null = null;

  public nativeHttp: HTTP;
  public angularHttp: HttpClient;

  constructor(private native: HTTP, private angular: angularHttp) {
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
    if (this.isNativeHttpAvailable()) {
      return Observable.fromPromise(this.nativeHttp.get(url, this.parseParamsForNativeHttp(options), this.parseHeadersForNativeHttp(options))).map((res: any) => {
        return {
          json() {
            return JSON.parse(res.data);
          },
          text(ignoredEncodingHint) {
            return res.data.toString();
          },
          body: this.parseBodyFromNativeHttpResponse(res,options),
          headers: new Headers(res.headers)
        }
      });
    }
    return this.angularHttp.get(url, this.parseOptionsForAngularHttp(options));
  }

  public post(url: string, body: any, options?: HttpRequest<any>): Observable<any> {
    if (this.isNativeHttpAvailable()) {
      return Observable.fromPromise(this.nativeHttp.post(url, body, this.parseHeadersForNativeHttp(options))).map((res: any) => {
        return {
          json() {
            return JSON.parse(res.data);
          },
          text(ignoredEncodingHint) {
            return res.data.toString();
          },
          body: this.parseBodyFromNativeHttpResponse(res,options),
          headers: new Headers(res.headers)
        }
      });
    }
    return this.angularHttp.post(url, body, this.parseOptionsForAngularHttp(options));
  }

  public put(url: string, body: any, options?: HttpRequest<any>): Observable<any> {
    if (this.isNativeHttpAvailable()) {
      return Observable.fromPromise(this.nativeHttp.put(url, body, this.parseHeadersForNativeHttp(options))).map((res: any) => {
        return {
          json() {
            return JSON.parse(res.data);
          },
          text(ignoredEncodingHint) {
            return res.data.toString();
          },
          body: this.parseBodyFromNativeHttpResponse(res,options),
          headers: new Headers(res.headers)
        }
      });
    }
    return this.angularHttp.put(url, body, this.parseOptionsForAngularHttp(options));
  }

  public delete(url: string, options?: HttpRequest<any>): Observable<any> {
    if (this.isNativeHttpAvailable()) {
      return Observable.fromPromise(this.nativeHttp.delete(url, this.parseParamsForNativeHttp(options), this.parseHeadersForNativeHttp(options))).map((res: any) => {
        return {
          json() {
            return JSON.parse(res.data);
          },
          text(ignoredEncodingHint) {
            return res.data.toString();
          },
          body: this.parseBodyFromNativeHttpResponse(res,options),
          headers: new Headers(res.headers)
        }
      });
    }
    return this.angularHttp.delete(url, this.parseOptionsForAngularHttp(options));
  }

  private parseOptionsForAngularHttp(options) {
    let angularOptions: any = options;
    if (options instanceof HttpRequest) {
      angularOptions = {};
      angularOptions.headers = options !== undefined && options.headers !== undefined ? options.headers : {};
      angularOptions.params = options !== undefined && options.params !== undefined ? options.params : {};
    }
    if (angularOptions === undefined) {
      angularOptions = {};
      angularOptions.responseType = 'json';
    }
    if (angularOptions.responseType === undefined) {
      angularOptions.responseType = 'json';
    }
    if (angularOptions.observe === undefined) {
      angularOptions.observe = 'response';
    }
    return angularOptions;
  }

  private parseHeadersForNativeHttp(options) {
    let headers: Headers | {} | null = options !== undefined && options.headers !== undefined ? options.headers : {};
    if (headers instanceof Headers) {
      let newHeaders: any = {};
      headers.forEach(function (value, name) {
        newHeaders[name.toString()] = value.toString();
      });
      headers = newHeaders;
    }
    return headers;
  }

  private parseParamsForNativeHttp(options) {
    return options !== undefined && options.params !== undefined ? options.params : {};
  }

  private parseBodyFromNativeHttpResponse(res, options) {
    if(res.data) {
      if (options === undefined || options.responseType === undefined || options.responseType === 'json') {
        return JSON.parse(res.data);
      }
      return res.data;
    }
    return null;
  }

  /**
   * @deprecated, use GET|PUT|POST|DELETE methods instead
   * @param {string} url
   * @param {HttpRequest} options
   * @param {Object} data
   * @returns {Observable}
   */
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
              body: res.data,
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
              body: res.data,
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
              body: res.data,
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
              body: res.data,
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
