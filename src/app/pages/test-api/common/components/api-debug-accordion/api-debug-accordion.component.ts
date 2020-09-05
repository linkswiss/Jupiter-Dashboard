import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  BaseRQ,
  BaseRS,
  EH2HConnectorCode,
  EOperationStatus, JupiterCrypticRQ,
  JupiterDestinationListRQ,
  JupiterFlightAvailabilityRQ, JupiterFlightBookRQ,
  JupiterFlightDetailRQ, JupiterFlightPnrPriceVerifyRQ, JupiterFlightPnrRetrieveRQ,
  JupiterHotelAvailabilityExtrasRQ,
  JupiterHotelAvailabilityRQ,
  JupiterHotelBookCancelRQ,
  JupiterHotelBookDetailRQ,
  JupiterHotelBookRQ,
  JupiterHotelBookSearchRQ,
  JupiterHotelCalendarAvailabilityRQ,
  JupiterHotelChainListRQ, JupiterHotelDetailRQ,
  JupiterSingleHotelAvailabilityRQ
} from '../../../../../services/jupiter-api/jupiter-api-client';
import Utils from '../../../../../utility/utils';
import {SampleRequest} from '../../../../../api/dashboard/model/sampleRequest';
import {AppConfigService} from '../../../../../services/app-config/app-config.service';
import {UserService} from '../../../../../services/user/user.service';
import {JupiterApiService} from '../../../../../services/jupiter-api/jupiter-api.service';
import {DashboardApiService} from '../../../../../services/dashboard-api/dashboard-api.service';
import * as moment from 'moment';
import {DialogApiErrorComponent} from '../dialog-api-error/dialog-api-error.component';
import {NbDialogService} from '@nebular/theme';

@Component({
  selector: 'jupiter-api-debug-accordion',
  templateUrl: './api-debug-accordion.component.html',
  styleUrls: ['./api-debug-accordion.component.scss']
})
export class ApiDebugAccordionComponent implements OnInit {
  @Input() ApiRq: BaseRQ;
  @Input() ApiRs: BaseRS;
  @Output() ApiRqChange = new EventEmitter();
  @Input() Title: string;

  requestJson = '';

  utils = Utils;
  sampleRequest: SampleRequest = null;
  sampleRequestList: SampleRequest[] = null;
  sampleType = '';

  constructor(private dialogService: NbDialogService, private dashboardApiService: DashboardApiService) {
  }

  ngOnInit() {
    if (this.ApiRs && this.ApiRs.ConnectorsResponseDetails && this.ApiRs.ConnectorsResponseDetails.length > 0) {
      for (let debug of this.ApiRs.ConnectorsResponseDetails) {
        if (debug.ConnectorDebugData) {
          if (this.getConnectorMode(debug.ConnectorCode) === 'xml') {
            // Format it
            debug.ConnectorDebugData.Request = this.utils.prettifyXml(debug.ConnectorDebugData.Request);
            debug.ConnectorDebugData.Response = this.utils.prettifyXml(debug.ConnectorDebugData.Response);
          }
        }
      }
    }
    this.setSampleType();
    this.loadSamplesFromApi();
  }

  setSampleType() {
    if (this.ApiRq instanceof JupiterDestinationListRQ) {
      this.sampleType = 'destination-list';
    }

    if (this.ApiRq instanceof JupiterHotelDetailRQ) {
      this.sampleType = 'hotel-hotelDetails';
    }
    if (this.ApiRq instanceof JupiterHotelCalendarAvailabilityRQ) {
      this.sampleType = 'hotel-calendarHotelAvail';
    }
    if (this.ApiRq instanceof JupiterHotelAvailabilityRQ) {
      this.sampleType = 'hotel-avail';
    }
    if (this.ApiRq instanceof JupiterSingleHotelAvailabilityRQ) {
      this.sampleType = 'hotel-singleHotelAvail';
    }
    if (this.ApiRq instanceof JupiterHotelAvailabilityExtrasRQ) {
      this.sampleType = 'hotel-extrasHotelAvail';
    }
    if (this.ApiRq instanceof JupiterHotelBookDetailRQ) {
      this.sampleType = 'hotel-hotelBookDetails';
    }
    if (this.ApiRq instanceof JupiterHotelBookRQ) {
      this.sampleType = 'hotel-hotelBook';
    }
    if (this.ApiRq instanceof JupiterHotelBookSearchRQ) {
      this.sampleType = 'hotel-hotelBookSearch';
    }
    if (this.ApiRq instanceof JupiterHotelBookCancelRQ) {
      this.sampleType = 'hotel-hotelBookCancel';
    }
    if (this.ApiRq instanceof JupiterHotelChainListRQ) {
      this.sampleType = 'hotel-hotelChainList';
    }


    if (this.ApiRq instanceof JupiterFlightAvailabilityRQ) {
      this.sampleType = 'flight-avail';
    }
    if (this.ApiRq instanceof JupiterFlightDetailRQ) {
      this.sampleType = 'flight-details';
    }
    if (this.ApiRq instanceof JupiterFlightBookRQ) {
      this.sampleType = 'flight-book';
    }
    if (this.ApiRq instanceof JupiterFlightPnrPriceVerifyRQ) {
      this.sampleType = 'flight-pnrPriceVerify';
    }
    if (this.ApiRq instanceof JupiterFlightPnrRetrieveRQ) {
      this.sampleType = 'flight-pnrRetrieve';
    }

    if (this.ApiRq instanceof JupiterCrypticRQ) {
      this.sampleType = 'sessionAndCryptic-cryptic';
    }
  }

  getConnectorMode(connectorCode: EH2HConnectorCode) {
    let mode = 'xml';
    switch (connectorCode) {
      case EH2HConnectorCode.IHG_GRS:
      case EH2HConnectorCode.BOOKING_DOT_COM:
      case EH2HConnectorCode.SABRE_CSL:
        mode = 'json';
    }
    return mode;
  }

  /**
   * Transform
   */
  apiRqToJson() {
    this.requestJson = JSON.stringify(this.ApiRq, null, 2);
  }

  /**
   * Parse the requestJson in the ApiRq Object
   */
  jsonToApiRq() {
    try {
      let data = JSON.parse(this.requestJson);

      let parsedRq = null;

      switch (this.sampleType) {
        case 'destination-list':
          parsedRq = JupiterDestinationListRQ.fromJS(data);
          break;
        case 'hotel-hotelDetails':
          parsedRq = JupiterHotelDetailRQ.fromJS(data);
          break;
        case 'hotel-calendarHotelAvail':
          parsedRq = JupiterHotelCalendarAvailabilityRQ.fromJS(data);

          let fromDate = moment(parsedRq.Request.FromDate);
          let toDate = moment(parsedRq.Request.ToDate);

          parsedRq.Request['_MinDate'] = moment();
          parsedRq.Request['_DateRange'] = {
            start: fromDate,
            end: toDate
          };

          break;
        case 'hotel-avail':
          parsedRq = JupiterHotelAvailabilityRQ.fromJS(data);

          let fromDate2 = moment(parsedRq.Request.FromDate);
          let toDate2 = moment(parsedRq.Request.ToDate);

          if (!parsedRq.Request.ConnectorsSearchOnly) {
            parsedRq.Request.ConnectorsSearchOnly = [];
          }

          parsedRq.Request['_MinDate'] = moment();
          parsedRq.Request['_DateRange'] = {
            start: fromDate2,
            end: toDate2
          };

          break;
        case 'hotel-singleHotelAvail':
          parsedRq = JupiterSingleHotelAvailabilityRQ.fromJS(data);

          let fromDate3 = moment(parsedRq.Request.FromDate);
          let toDate3 = moment(parsedRq.Request.ToDate);

          if (!parsedRq.Request.ConnectorsSearchOnly) {
            parsedRq.Request.ConnectorsSearchOnly = [];
          }

          parsedRq.Request['_MinDate'] = moment();
          parsedRq.Request['_DateRange'] = {
            start: fromDate3,
            end: toDate3
          };

          break;
        case 'hotel-extrasHotelAvail':
          parsedRq = JupiterHotelAvailabilityExtrasRQ.fromJS(data);

          let fromDate4 = moment(parsedRq.Request.FromDate);
          let toDate4 = moment(parsedRq.Request.ToDate);

          if (!parsedRq.Request.ConnectorsSearchOnly) {
            parsedRq.Request.ConnectorsSearchOnly = [];
          }

          parsedRq.Request['_MinDate'] = moment();
          parsedRq.Request['_DateRange'] = {
            start: fromDate4,
            end: toDate4
          };

          break;
        case 'hotel-hotelBook':
          parsedRq = JupiterHotelBookRQ.fromJS(data);
          break;
        case 'hotel-hotelBookDetails':
          parsedRq = JupiterHotelBookDetailRQ.fromJS(data);
          break;
        case 'hotel-hotelBookSearch':
          parsedRq = JupiterHotelBookSearchRQ.fromJS(data);
          break;
        case 'hotel-hotelBookCancel':
          parsedRq = JupiterHotelBookCancelRQ.fromJS(data);
          break;
        case 'hotel-hotelChainList':
          parsedRq = JupiterHotelChainListRQ.fromJS(data);
          break;


        case 'flight-avail':
          parsedRq = JupiterFlightAvailabilityRQ.fromJS(data);
          break;
        case 'flight-details':
          parsedRq = JupiterFlightDetailRQ.fromJS(data);
          break;
        case 'flight-book':
          parsedRq = JupiterFlightBookRQ.fromJS(data);
          break;
        case 'flight-pnrPriceVerify':
          parsedRq = JupiterFlightPnrPriceVerifyRQ.fromJS(data);
          break;
        case 'flight-pnrRetrieve':
          parsedRq = JupiterFlightPnrRetrieveRQ.fromJS(data);
          break;
      }

      if (!parsedRq.Request.ConnectorsDebug) {
        parsedRq.Request.ConnectorsDebug = [];
      }

      this.ApiRq = parsedRq;
      console.log(this.ApiRq);
      this.ApiRqChange.emit(this.ApiRq);
    } catch (e) {
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'loadRqFromJson Error',
          error: e
        },
      });
    }
  }

  newSampleRequest() {
    this.sampleRequest = {
      SampleType: this.sampleType,
      // Name: sampleType,
    };
  }

  private loadSamplesFromApi() {
    this.sampleRequestList = null;

    this.dashboardApiService.getSampleRequests(this.sampleType).subscribe(response => {
      this.sampleRequestList = response;
    }, error => {
      console.error(error);
    });
  }

  saveSample() {
    try {
      // Try to format JSON
      if (this.requestJson) {
        let parsed = JSON.parse(this.requestJson);
        this.sampleRequest.RequestJson = JSON.stringify(parsed, null, 2);
      } else {
        this.sampleRequest.RequestJson = JSON.stringify(this.ApiRq, null, 2);
      }
    } catch (e) {
      console.warn('NOT VALID JSON - Unable to Format Save it anyway');
      this.sampleRequest.RequestJson = this.requestJson;
    }

    this.dashboardApiService.saveSampleRequest(this.sampleRequest).subscribe(response => {
      this.loadSingleSampleRequest(response);
      let self = this;
      setTimeout(function () {
        // load wait 200ms to get the new results
        self.loadSamplesFromApi();
      }, 200);
    }, error => {
      console.error(error);
    });
  }

  deleteSample() {
    this.dashboardApiService.deleteSampleRequest(this.sampleRequest).subscribe(response => {
      this.sampleRequest = null;
      let self = this;
      setTimeout(function () {
        // load wait 200ms to get the new results
        self.loadSamplesFromApi();
      }, 200);
    }, error => {
      console.error(error);
    });
  }

  loadAllSamples() {
    this.sampleRequestList = null;
    this.dashboardApiService.getAllSampleRequests().subscribe(response => {
      this.sampleRequestList = response;
    }, error => {
      console.error(error);
    });
  }

  loadSingleSampleRequest(sampleRequest: SampleRequest) {
    this.sampleRequest = sampleRequest;
    try {
      // Try to format JSON
      let parsed = JSON.parse(this.sampleRequest.RequestJson);
      this.requestJson = JSON.stringify(parsed, null, 2);
    } catch (e) {
      console.warn('NOT VALID JSON - Unable to Format Load it anyway');
      this.requestJson = this.sampleRequest.RequestJson;
    }
  }

}
