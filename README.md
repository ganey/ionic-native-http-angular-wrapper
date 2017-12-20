# Ionic Native Http Angular Wrapper

This is a basic package for wrapping the [@ionic-native/http plugin@^4.3.0]() with observables and providing a fallback to the [@angular/common/http](https://github.com/angular/angular/tree/5.0.5/packages/common/http) method.

This will only handle basic requests, anything more advanced you should use the packages separately.

This works with the WKWebView for iOS, and bypasses the CORS issues associated with @angular/common/http and WKWebView

### Notes: 

- PATCH method is not available
- Local files will have to be handled manually, use `isNativeHttpAvailable()` to check if nativeHttp will be used

For older versions of Ionic where @angular<5.0 is used, please use version `1.0.0`.

## Add native http client to Ionic project & add module
````shell
$ ionic cordova plugin add cordova-plugin-advanced-http
$ npm install ionic-native-http-angular-wrapper --save
# or yarn add ionic-native-http-angular-wrapper
````

## Add to App Module - app.module.ts

```typescript

// Import your module
import {NativeHttpWrapper} from 'ionic-native-http-angular-wrapper';
 
@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
   //Put here
   NativeHttpWrapper
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
  ]
})
export class AppModule {}
```

## Using the module

````typescript
import {HttpWrapper} from "ionic-native-http-angular-wrapper";
  
constructor(private httpWrapper: HttpWrapper) {}
 
    public getStuff() {
        this.httpWrapper.get('http://google.co.uk', {},{})
    }
    
}
````
