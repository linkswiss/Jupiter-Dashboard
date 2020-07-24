import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { ACE_CONFIG, AceConfigInterface, AceModule } from 'ngx-ace-wrapper';
import { TagInputModule } from 'ngx-chips';
import { LayoutModule } from '../layout/layout.module';
import { UtilityModule } from '../utility/utility.module';
import { AuthComponent } from './auth/auth.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { MenuComponent } from './menu.component';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

import { PagesComponent } from './pages.component';
import { TestApiComponent } from './test-api/test-api.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './auth/login/login.component';

import 'brace';
import 'brace/theme/monokai';
import 'brace/theme/tomorrow_night_blue';
import 'brace/mode/json';
import 'brace/mode/xml';
import 'brace/mode/typescript';
import 'brace/ext/searchbox';

import { LogoutComponent } from './auth/logout/logout.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { KibanaComponent } from './logs/kibana/kibana.component';
import { CrypticComponent } from './test-api/cryptic/cryptic.component';
import { HotelAvailComponent } from './test-api/hotel/hotel-avail/hotel-avail.component';
import { SabreComponent } from './connectors/sabre/sabre.component';
import { AmadeusComponent } from './connectors/amadeus/amadeus.component';
import { AmadeusCrypticComponent } from './connectors/amadeus/amadeus-cryptic/amadeus-cryptic.component';
import { SabreSessionPoolComponent } from './connectors/sabre/sabre-session-pool/sabre-session-pool.component';
import { SabreCrypticComponent } from './connectors/sabre/sabre-cryptic/sabre-cryptic.component';
import { FlightSearchComponent } from './test-api/flight/flight-search/flight-search.component';
import {NbPopoverModule} from "@nebular/theme";
import { FlightPnrRetrieveComponent } from './test-api/flight/flight-pnr-retrieve/flight-pnr-retrieve.component';
import { FlightPnrDisplayComponent } from './test-api/flight/components/flight-pnr-display/flight-pnr-display.component';
import { HotelCalendarAvailComponent } from './test-api/hotel/hotel-calendar-avail/hotel-calendar-avail.component';
import { ApiResponseStatusComponent } from './test-api/common/components/api-response-status/api-response-status.component';
import { ApiDebugAccordionComponent } from './test-api/common/components/api-debug-accordion/api-debug-accordion.component';
import { DialogApiErrorComponent } from './test-api/common/components/dialog-api-error/dialog-api-error.component';
import { ApiMessagesAccordionComponent } from './test-api/common/components/api-messages-accordion/api-messages-accordion.component';
import {FullCalendarModule} from '@fullcalendar/angular';
import { HotelBookDetailComponent } from './test-api/hotel/hotel-book-detail/hotel-book-detail.component';
import { HotelBookSearchComponent } from './test-api/hotel/hotel-book-search/hotel-book-search.component';
import { CustomDataInputsComponent } from './test-api/common/components/custom-data-inputs/custom-data-inputs.component';
import { HotelBookComponent } from './test-api/hotel/hotel-book/hotel-book.component';
import { HotelSingleAvailComponent } from './test-api/hotel/hotel-single-avail/hotel-single-avail.component';
import { DialogMessageComponent } from './test-api/common/components/dialog-message/dialog-message.component';
import { HotelDetailComponent } from './test-api/hotel/hotel-detail/hotel-detail.component';
import { SingleHotelDetailsComponent } from './test-api/hotel/components/single-hotel-details/single-hotel-details.component';
import { HotelRoomsAvailComponent } from './test-api/hotel/components/hotel-rooms-avail/hotel-rooms-avail.component';
import { SingleRoomDetailsComponent } from './test-api/hotel/components/single-room-details/single-room-details.component';
import { HotelAvailExtrasComponent } from './test-api/hotel/hotel-avail-extras/hotel-avail-extras.component';
import { HotelPriceVerifyComponent} from './test-api/hotel/hotel-price-verify/hotel-price-verify.component';
import { FormDataInputsComponent } from './test-api/common/components/form-data-inputs/form-data-inputs.component';
import { ConnectorsEnvironmentComponent } from './test-api/common/components/connectors-environment/connectors-environment.component';
import { BookingStatusComponent } from './test-api/common/book-components/booking-status/booking-status.component';
import { CreditCardPaymentComponent } from './test-api/common/book-components/credit-card-payment/credit-card-payment.component';
import { PaxListDetailsComponent } from './test-api/common/book-components/pax-list-details/pax-list-details.component';
import { TravelCompanyComponent } from './test-api/common/book-components/travel-company/travel-company.component';
import { ObjDisplayComponent } from './test-api/common/components/obj-display/obj-display.component';
import { TrainAvailComponent } from './test-api/train/train-avail/train-avail.component';
// import 'brace/ext/searchbox';

const DEFAULT_ACE_CONFIG: AceConfigInterface = {
  theme: 'monokai',
  mode: 'json',
  showPrintMargin: false,
};

@NgModule({
  imports: [
    RouterModule,
    LayoutModule,
    MiscellaneousModule,
    UtilityModule,
    AceModule,
    TagInputModule,
    NbPopoverModule,
    FullCalendarModule
  ],
  declarations: [
    MenuComponent,
    PagesComponent,
    DocumentationComponent,
    TestApiComponent,
    DashboardComponent,
    SettingsComponent,
    AuthComponent,
    LoginComponent,
    LogoutComponent,
    UserListComponent,
    KibanaComponent,
    CrypticComponent,
    HotelAvailComponent,
    SabreComponent,
    AmadeusComponent,
    AmadeusCrypticComponent,
    SabreSessionPoolComponent,
    SabreCrypticComponent,
    FlightSearchComponent,
    FlightPnrRetrieveComponent,
    FlightPnrDisplayComponent,
    HotelCalendarAvailComponent,
    ApiResponseStatusComponent,
    ApiDebugAccordionComponent,
    DialogApiErrorComponent,
    ApiMessagesAccordionComponent,
    HotelBookDetailComponent,
    HotelBookSearchComponent,
    CustomDataInputsComponent,
    HotelBookComponent,
    HotelSingleAvailComponent,
    DialogMessageComponent,
    HotelDetailComponent,
    SingleHotelDetailsComponent,
    HotelRoomsAvailComponent,
    SingleRoomDetailsComponent,
    HotelAvailExtrasComponent,
    HotelPriceVerifyComponent,
    FormDataInputsComponent,
    ConnectorsEnvironmentComponent,
    BookingStatusComponent,
    CreditCardPaymentComponent,
    PaxListDetailsComponent,
    TravelCompanyComponent,
    ObjDisplayComponent,
    TrainAvailComponent,
  ],
  entryComponents: [DialogApiErrorComponent, DialogMessageComponent],
  providers: [
    {
      provide: ACE_CONFIG,
      useValue: DEFAULT_ACE_CONFIG,
    },
  ],
})
export class PagesModule {
}
