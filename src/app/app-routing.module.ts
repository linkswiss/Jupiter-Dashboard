import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { resolve } from 'q';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { AmadeusComponent } from './pages/connectors/amadeus/amadeus.component';
import { SabreComponent } from './pages/connectors/sabre/sabre.component';
import { KibanaComponent } from './pages/logs/kibana/kibana.component';
import { CrypticComponent } from './pages/test-api/cryptic/cryptic.component';
import { FlightSearchComponent } from './pages/test-api/flight/flight-search/flight-search.component';
import { HotelAvailComponent } from './pages/test-api/hotel/hotel-avail/hotel-avail.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { ApiDocUrlResolver } from './utility/api-doc-url.resolver';
import { KibanaUrlResolver } from './utility/kibana-url.resolver';
import { LayoutComponent } from './layout/layout/layout.component';
import { AuthComponent } from './pages/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { NotFoundComponent } from './pages/miscellaneous/not-found/not-found.component';
import { PagesComponent } from './pages/pages.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { TestApiComponent } from './pages/test-api/test-api.component';
import { AuthGuard } from './utility/auth.guard';
import {HotelCalendarAvailComponent} from './pages/test-api/hotel/hotel-calendar-avail/hotel-calendar-avail.component';
import {HotelBookSearchComponent} from './pages/test-api/hotel/hotel-book-search/hotel-book-search.component';
import {HotelBookDetailComponent} from './pages/test-api/hotel/hotel-book-detail/hotel-book-detail.component';
import {FlightPnrRetrieveComponent} from './pages/test-api/flight/flight-pnr-retrieve/flight-pnr-retrieve.component';
import {HotelSingleAvailComponent} from './pages/test-api/hotel/hotel-single-avail/hotel-single-avail.component';
import {HotelDetailComponent} from './pages/test-api/hotel/hotel-detail/hotel-detail.component';
import {HotelBookComponent} from './pages/test-api/hotel/hotel-book/hotel-book.component';
import {HotelAvailExtrasComponent} from './pages/test-api/hotel/hotel-avail-extras/hotel-avail-extras.component';
import {HotelPriceVerifyComponent} from './pages/test-api/hotel/hotel-price-verify/hotel-price-verify.component';
import {TrainAvailComponent} from "./pages/test-api/train/train-avail/train-avail.component";
import { AppPreferenciesComponent } from './pages/app-preferencies/app-preferencies.component';
import { LayoutEmptyComponent } from './layout/layout-empty/layout-empty.component';
import {RefreshTokenComponent} from "./pages/auth/refresh-token/refresh-token.component";
import {FlightQueueListComponent} from "./pages/test-api/flight/flight-queue-list/flight-queue-list.component";

const routes: Routes = [
  // { path: 'pages', component: LayoutComponent},

  {
    path: '',
    canActivateChild: [AuthGuard],
    // canActivate: [AuthGuard],
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      // {
      //   path: 'dashboard',
      //   component: KibanaComponent,
      //   resolve: {
      //     elasticSearchSettingsKey: KibanaUrlResolver,
      //   },
      // },
      {
        path: 'api-documentation',
        component: DocumentationComponent,
        resolve: {
          apiDocUrl: ApiDocUrlResolver,
        },
      },
      {
        path: 'test-api',
        component: TestApiComponent,
      },
      {
        path: 'gds-cryptic',
        component: CrypticComponent,
      },
      {
        path: 'flight-search',
        component: FlightSearchComponent,
      },
      {
        path: 'flight-pnr-retrieve',
        component: FlightPnrRetrieveComponent,
      },
      {
        path: 'flight-queue-list',
        component: FlightQueueListComponent,
      },
      {
        path: 'hotel-detail',
        component: HotelDetailComponent,
      },
      {
        path: 'hotel-calendar-avail',
        component: HotelCalendarAvailComponent,
      },
      {
        path: 'hotel-avail',
        component: HotelAvailComponent,
      },
      {
        path: 'hotel-single-avail',
        component: HotelSingleAvailComponent,
      },
      {
        path: 'hotel-extras-avail',
        component: HotelAvailExtrasComponent,
      },
      {
        path: 'hotel-price-verify',
        component: HotelPriceVerifyComponent,
      },
      {
        path: 'hotel-book',
        component: HotelBookComponent,
      },
      {
        path: 'hotel-book-search',
        component: HotelBookSearchComponent,
      },
      {
        path: 'hotel-book-detail',
        component: HotelBookDetailComponent,
      },
      {
        path: 'train-avail',
        component: TrainAvailComponent,
      },
      {
        path: 'not-found',
        component: NotFoundComponent,
      },
      {
        path: 'connector',
        children: [
          {
            path: 'sabre',
            component: SabreComponent,
          },
          {
            path: 'amadeus',
            component: AmadeusComponent,
          },
        ],
      },
      {
        path: 'admin',
        children: [
          {
            path: 'dashboard-api-documentation',
            component: DocumentationComponent,
            resolve: {
              apiDocUrl: ApiDocUrlResolver,
            },
          },
          {
            path: 'dashboard-models-documentation',
            component: DocumentationComponent,
            resolve: {
              apiDocUrl: ApiDocUrlResolver,
            },
          },
          {
            path: 'api-models-documentation',
            component: DocumentationComponent,
            resolve: {
              apiDocUrl: ApiDocUrlResolver,
            },
          },
          {
            path: 'settings',
            component: SettingsComponent,
          },
          {
            path: 'user-list',
            component: UserListComponent,
          },
          // {
          //   path: 'kibana',
          //   component: KibanaComponent,
          //   resolve: {
          //     elasticSearchSettingsKey: KibanaUrlResolver,
          //   },
          // },
          // {
          //   path: 'kibana-logs',
          //   component: KibanaComponent,
          //   resolve: {
          //     elasticSearchSettingsKey: KibanaUrlResolver,
          //   },
          // },
          // {
          //   path: 'logs',
          //   component: LogListComponent,
          // },
        ],
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'logout', component: LogoutComponent},
      {path: 'refresh-token', component: RefreshTokenComponent},
    ],
  },
  {
    path: 'app',
    component: AuthComponent,
    children: [
      {path: 'preferencies', component: AppPreferenciesComponent}
    ]
  },
  {path: '**', redirectTo: 'not-found'},

  // {
  //   path: 'settings',
  //   component: SettingsComponent,
  // },


  // { path: 'pages', canActivate: [AuthGuard], loadChildren: 'app/pages/pages.module#PagesModule' },
  // {
  //   path: 'auth',
  //   loadChildren: 'app/pages/auth/auth.module#JupiterAuthModule',
  // },


  // {
  //   path: 'auth',
  //   component: NbLoginComponent,
  //   children: [
  //     {
  //       path: '',
  //       component: NbLoginComponent,
  //     },
  //     {
  //       path: 'login',
  //       component: NbLoginComponent,
  //     },
  //     {
  //       path: 'register',
  //       component: NbRegisterComponent,
  //     },
  //     {
  //       path: 'logout',
  //       component: NbLogoutComponent,
  //     },
  //     {
  //       path: 'request-password',
  //       component: NbRequestPasswordComponent,
  //     },
  //     {
  //       path: 'reset-password',
  //       component: NbResetPasswordComponent,
  //     },
  //   ],
  // },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {
}
