import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiDocUrlResolver } from './api-doc-url.resolver';
import { AuthGuard } from './auth.guard';
import { FormInputErrorComponent } from './form-input-error/form-input-error.component';
import { KibanaUrlResolver } from './kibana-url.resolver';
import { RefreshTokenInterceptor } from './refresh-token.interceptor';
import { CarrierImagePipe } from './carrier-image.pipe';
import {TruncatePipe} from "./truncate.pipe";
import {TrainCarrierImagePipe} from "./train-carrier-image.pipe";

@NgModule({
  declarations: [
    FormInputErrorComponent,
    CarrierImagePipe,
    TruncatePipe,
    TrainCarrierImagePipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    FormInputErrorComponent,
    CarrierImagePipe,
    TruncatePipe,
    TrainCarrierImagePipe
  ],
  providers: [AuthGuard]
})
export class UtilityModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UtilityModule,
      providers: [ApiDocUrlResolver, KibanaUrlResolver, RefreshTokenInterceptor]
    };
  }
}
