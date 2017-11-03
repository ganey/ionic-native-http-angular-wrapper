import {Injectable} from '@angular/core';
import {HTTP as nativeHttp} from '@ionic-native/http';
import {Headers, Http as angularHttp, RequestMethod, RequestOptionsArgs} from "@angular/http";
import {checkAvailability} from '@ionic-native/core';
import {Observable} from "rxjs/Observable";
import "rxjs";
import {Body} from "@angular/http/src/body";

@Injectable()
export class HttpWrapper {
  protected nativeIsAvailable: boolean | null = null;

  constructor(private nativeHttp: nativeHttp, private angularHttp: angularHttp) {
  }

  public isNativeHttpAvailable() {
    if (this.nativeIsAvailable === null) {
      this.nativeIsAvailable = checkAvailability('cordovaHTTP') === true;
    }
    return this.nativeIsAvailable;
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<Object> {
    options.method = RequestMethod.Get;
    return this.request(url, options);
  }

  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Object> {
    options.method = RequestMethod.Post;
    return this.request(url, options, body);
  }

  public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Object> {
    options.method = RequestMethod.Put;
    return this.request(url, options, body);
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Object> {
    options.method = RequestMethod.Delete;
    return this.request(url, options);
  }

  public request(url: string, options: RequestOptionsArgs, data?: Object): Observable<Object> {
    if (this.isNativeHttpAvailable()) {
      let headers: Headers | {} | null = options.headers;
      if (headers instanceof Headers) {
        headers = headers.toJSON();
      }
      switch (options.method) {
        case RequestMethod.Get:
          if (data == null) {
            data = options.params;
          }
          return Observable.fromPromise(this.nativeHttp.get(url, data, headers)).map(res => {
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
        case RequestMethod.Post:
          return Observable.fromPromise(this.nativeHttp.post(url, data, headers)).map(res => {
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
        case RequestMethod.Put:
          if (data == null) {
            data = options.params != null ? options.params : {};
          }
          return Observable.fromPromise(this.nativeHttp.put(url, data, headers)).map(res => {
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
        case RequestMethod.Delete:
          return Observable.fromPromise(this.nativeHttp.delete(url, data, headers)).map(res => {
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
      //Make an @angular/http request
      if (options.headers === undefined) {
        options.headers = new Headers();
      }
      if (data) {
        options.body = JSON.stringify(data);
      }
      return this.angularHttp.request(url, options);
    }
  }
}
