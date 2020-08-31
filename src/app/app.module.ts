import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {BrowserModule, Title} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NbMomentDateModule } from '@nebular/moment';
import { AceModule } from 'ngx-ace-wrapper';
import { MomentModule } from 'ngx-moment';
import { config } from 'rxjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbThemeModule,
  NbLayoutModule,
  NbSidebarModule,
  NbSidebarService,
  NbActionsModule,
  NbMenuModule,
  NbMenuService, NbDialogModule, NbWindowModule, NbToastrModule, NbDatepickerModule,
} from '@nebular/theme';
import { LayoutModule } from './layout/layout.module';
import { PagesModule } from './pages/pages.module';
import { AppConfigService, jwtOptions } from './services/app-config/app-config.service';
import { JWT_OPTIONS, JwtInterceptor, JwtModule } from '@auth0/angular-jwt';

import { environment } from '../environments/environment';
import { DashboardApiService } from './services/dashboard-api/dashboard-api.service';
import { JupiterApiService } from './services/jupiter-api/jupiter-api.service';
import { UserService } from './services/user/user.service';
import { RefreshTokenInterceptor } from './utility/refresh-token.interceptor';
import { UtilityModule } from './utility/utility.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptions.options,
      },
    }),
    NbDatepickerModule.forRoot(),
    NbMomentDateModule,
    MomentModule,
    AppRoutingModule,
    UtilityModule.forRoot(),
    PagesModule,
    LayoutModule.forRoot(),
  ],
  providers: [
    Title,
    UserService,
    AppConfigService,
    DashboardApiService,
    JupiterApiService,

    NbSidebarService,
    NbMenuService,
    JwtInterceptor, // Providing JwtInterceptor allow to inject JwtInterceptor manually into RefreshTokenInterceptor
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
