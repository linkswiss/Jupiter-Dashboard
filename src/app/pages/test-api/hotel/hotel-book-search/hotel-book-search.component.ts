import {Component, OnInit, ViewChild} from '@angular/core';
import {NbAccordionItemComponent, NbDialogService} from '@nebular/theme';
import Utils from '../../../../utility/utils';
import {
  EH2HConnectorCode, EBookingStatus,
  EH2HOperation, EIHGReservationRetrieveMode, IHGHotelBookCancelInputCustomData, IHGHotelBookDetailInputCustomData,
  IHGHotelBookSearchInputCustomData, JupiterHotelBookCancelInput,
  JupiterHotelBookCancelRQ,
  JupiterHotelBookCancelRS,
  JupiterHotelBookDetailInput,
  JupiterHotelBookDetailRQ,
  JupiterHotelBookDetailRS,
  JupiterHotelBookSearchInput,
  JupiterHotelBookSearchRQ,
  JupiterHotelBookSearchRS, SabreBookingReference, SabreSynXisHotelBookDetailInputCustomData,
  SabreSynXisHotelBookSearchInputCustomData, SingleBookDetail, JupiterHotelDetailRQ, JupiterHotelDetailRS
} from '../../../../services/jupiter-api/jupiter-api-client';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';
import {AppConfigService} from '../../../../services/app-config/app-config.service';
import {DialogApiErrorComponent} from '../../common/components/dialog-api-error/dialog-api-error.component';
import * as _ from 'lodash';
import * as moment from 'moment';
import {CustomDataInputSettings} from '../../common/components/custom-data-inputs/custom-data-inputs.component';

@Component({
  selector: 'jupiter-hotel-book-search',
  templateUrl: './hotel-book-search.component.html',
  styleUrls: ['./hotel-book-search.component.scss']
})
export class HotelBookSearchComponent implements OnInit {
  @ViewChild('accordionItemBookSearchRq', {static: true}) accordionItemBookSearchRq: NbAccordionItemComponent;

  utils = Utils;
  loading = false;

  jupiterHotelBookSearchRQ: JupiterHotelBookSearchRQ = null;
  jupiterHotelBookSearchRS: JupiterHotelBookSearchRS = null;

  EBookingStatus = EBookingStatus;
  EH2HConnectorCode = EH2HConnectorCode;
  connectors: EH2HConnectorCode[] = null;

  constructor(private dialogService: NbDialogService, private jupiterApiService: JupiterApiService, public appConfigService: AppConfigService) {
  }

  ngOnInit() {
    // Get Connectors Enabled to operation
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.HOTEL_BOOK_SEARCH);

    let fromDate = moment().add(-10, 'days');
    let toDate = moment().add(10, 'days');

    if(this.jupiterApiService.selectedLogMethod && this.jupiterApiService.selectedLogRqJson && this.jupiterApiService.selectedLogRsJson){
      this.jupiterHotelBookSearchRQ = JupiterHotelBookSearchRQ.fromJS(JSON.parse(this.jupiterApiService.selectedLogRqJson));
      this.jupiterHotelBookSearchRS = JupiterHotelBookSearchRS.fromJS(JSON.parse(this.jupiterApiService.selectedLogRsJson));
      this.jupiterApiService.selectedLogMethod = null;
      this.jupiterApiService.selectedLogRqJson = null;
      this.jupiterApiService.selectedLogRsJson = null;

      fromDate = moment(this.jupiterHotelBookSearchRQ.Request.FromDate);
      toDate = moment(this.jupiterHotelBookSearchRQ.Request.ToDate);

    }else {
      this.jupiterHotelBookSearchRQ = new JupiterHotelBookSearchRQ({
        ConnectorsEnvironment: [],
        Request: new JupiterHotelBookSearchInput({
          ConnectorsDebug: null,
          ConnectorCode: null,
          ConnectorCustomData: null,
          BookingStatus: EBookingStatus.BOOKED,
          ConnectorBookingReference: '',
          FromDate: fromDate.format('YYYY-MM-DD'),
          ToDate: toDate.format('YYYY-MM-DD'),
        })
      });
    }

    // Additional Properties
    this.jupiterHotelBookSearchRQ.Request['_DateRange'] = {
      start: fromDate,
      end: toDate
    };
  }

  /**
   * Callback Changed the main Connector -> Add Custom data
   * @param connector
   */
  bookSearchConnectorsChanged(connector: EH2HConnectorCode) {
    this.jupiterHotelBookSearchRQ.Request.ConnectorCustomData = null;

    switch (connector) {
      case EH2HConnectorCode.SABRE_SYNXIS:
        this.jupiterHotelBookSearchRQ.Request.ConnectorCustomData = new SabreSynXisHotelBookSearchInputCustomData({
          ChannelSubSourceCode: '',
          ChainCode: '',
          HotelCode: ''
        });
        // No Need Add Custom Data Input Settings -> All Text
        break;
      case EH2HConnectorCode.IHG_GRS:
        this.jupiterHotelBookSearchRQ.Request.ConnectorCustomData = new IHGHotelBookSearchInputCustomData({
          FirstName: '',
          LastName: '',
          CreditCard: '',
          HotelRefIds: [],
          IhgAgentToken: '',
          IhgImpersonatorId: '',
          IhgPos: '',
          IhgSessionId: '',
          IhgSsoToken: '',
          LoyaltyId: '',
          Offset: 0,
          Limit: 100,
          PhoneNumber: '',
          PriceGridCode: '',
          RetrieveMode: EIHGReservationRetrieveMode.DISPLAY_LIST,
          // StayDate: '',
        });
        // Add Custom Data Input Settings
        this.jupiterHotelBookSearchRQ.Request.ConnectorCustomData['_CustomDataInputSettings'] = new CustomDataInputSettings({
          dateProps: ['StayDate'],
          numProps: ['Offset', 'Limit'],
          tagProps: ['HotelRefIds'],
          enumProps: ['RetrieveMode'],
          boolProps: [],
          objProps: [],
          objArrayProps: [],
          omitProps: [],
          enums: { 'RetrieveMode': Object.keys(EIHGReservationRetrieveMode) }
        });
        break;
    }
  }

  /**
   * Delete custom data
   */
  deleteCustomData() {
    this.jupiterHotelBookSearchRQ.Request.ConnectorCustomData = null;
  }

  /**
   * Format From and To Dates
   * @param $event
   */
  handlesearchRangeChange($event) {
    if ($event.start) {
      this.jupiterHotelBookSearchRQ.Request.FromDate = moment($event.start).format('YYYY-MM-DD');
    }
    if ($event.end) {
      this.jupiterHotelBookSearchRQ.Request.ToDate = moment($event.end).format('YYYY-MM-DD');
    }

    // this.jupiterHotelCalendarAvailabilityRq.Request['_DateRange2'] = {
    //   start: moment($event.start).date(),
    //   end:  moment($event.end).date()
    // }
  }

  searchBook() {
    this.loading = true;

    this.jupiterApiService.hotelBookSearch(this.jupiterHotelBookSearchRQ).subscribe(response => {
      this.jupiterHotelBookSearchRS = response;
      this.accordionItemBookSearchRq.close();
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'hotelBookSearch Error',
          error: error
        },
      });
    });
  }
}
