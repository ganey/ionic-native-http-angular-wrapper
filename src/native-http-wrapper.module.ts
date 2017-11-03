import { NgModule } from '@angular/core';
import { HttpWrapper } from './providers/http-wrapper';
import {HTTP as nativeHttp} from "@ionic-native/http";

@NgModule({
  providers: [
    HttpWrapper,
    nativeHttp
  ]
})
export class NativeHttpWrapper {
}

