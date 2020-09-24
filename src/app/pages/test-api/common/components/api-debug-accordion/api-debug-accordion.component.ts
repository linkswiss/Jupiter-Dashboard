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

// import * as JupiterApi from '../../../../../services/jupiter-api/jupiter-api-client';

import Utils from '../../../../../utility/utils';
import {AppConfigService} from '../../../../../services/app-config/app-config.service';
import {UserService} from '../../../../../services/user/user.service';
import {JupiterApiService} from '../../../../../services/jupiter-api/jupiter-api.service';
import {DashboardApiService} from '../../../../../services/dashboard-api/dashboard-api.service';
import * as moment from 'moment';
import {DialogApiErrorComponent} from '../dialog-api-error/dialog-api-error.component';
import {NbDialogService} from '@nebular/theme';
import {SampleRequest} from "../../../../../services/dashboard-api/dashboard-api-client";

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
    this.sampleType = this.ApiRq.constructor.name;
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

      //Load form Static fn fromJS -> need ts-ignore for be evaluated by browser
      // @ts-ignore
      let parsedRq = this.ApiRq.constructor.fromJS(data);

      switch (this.sampleType) {
        case 'JupiterHotelCalendarAvailabilityRQ':
          let fromDate = moment(parsedRq.Request.FromDate);
          let toDate = moment(parsedRq.Request.ToDate);

          parsedRq.Request['_MinDate'] = moment();
          parsedRq.Request['_DateRange'] = {
            start: fromDate,
            end: toDate
          };
          break;
        case 'JupiterHotelAvailabilityRQ':
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
        case 'JupiterSingleHotelAvailabilityRQ':
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
        case 'JupiterHotelAvailabilityExtrasRQ':
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

  generateSampleRequest() {
    this.dashboardApiService.generateSampleRequests(this.sampleType).subscribe(response => {
      this.sampleRequest = response;
      this.loadSingleSampleRequest(this.sampleRequest);
    }, error => {
      console.error(error);
    });
  }

  newSampleRequest() {
    this.sampleRequest = new SampleRequest({
      RequestJson: "",
      SampleType: this.sampleType
    });
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
