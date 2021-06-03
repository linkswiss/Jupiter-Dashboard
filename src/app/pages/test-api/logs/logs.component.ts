import {Component, OnInit, ViewChild} from '@angular/core';
import {
  BaseCallLog,
  CallLog,
  EH2HConnectorCode,
  EH2HOperation,
  ElasticLogsRQ,
  ElasticLogsRS,
  ELogSearchType,
  EOperationStatus
} from "../../../services/jupiter-api/jupiter-api-client";
import * as moment from "moment";
import {DialogApiErrorComponent} from "../common/components/dialog-api-error/dialog-api-error.component";
import {JupiterApiService} from "../../../services/jupiter-api/jupiter-api.service";
import {NbDialogService} from "@nebular/theme";
import Utils from "../../../utility/utils";
import {Router} from "@angular/router";
import {CrypticComponent} from "../cryptic/cryptic.component";
import {FlightSearchComponent} from "../flight/flight-search/flight-search.component";
import {FlightPnrRetrieveComponent} from "../flight/flight-pnr-retrieve/flight-pnr-retrieve.component";
import {FlightQueueListComponent} from "../flight/flight-queue-list/flight-queue-list.component";
import {HotelDetailComponent} from "../hotel/hotel-detail/hotel-detail.component";
import {HotelCalendarAvailComponent} from "../hotel/hotel-calendar-avail/hotel-calendar-avail.component";
import {HotelAvailComponent} from "../hotel/hotel-avail/hotel-avail.component";
import {HotelSingleAvailComponent} from "../hotel/hotel-single-avail/hotel-single-avail.component";
import {HotelAvailExtrasComponent} from "../hotel/hotel-avail-extras/hotel-avail-extras.component";
import {HotelPriceVerifyComponent} from "../hotel/hotel-price-verify/hotel-price-verify.component";
import {HotelBookComponent} from "../hotel/hotel-book/hotel-book.component";
import {HotelBookSearchComponent} from "../hotel/hotel-book-search/hotel-book-search.component";
import {HotelBookDetailComponent} from "../hotel/hotel-book-detail/hotel-book-detail.component";
import {TrainAvailComponent} from "../train/train-avail/train-avail.component";
import {CarAvailComponent} from "../car/car-avail/car-avail.component";
import {CarBookDetailComponent} from "../car/car-book-detail/car-book-detail.component";
import {DialogMessageComponent} from "../common/components/dialog-message/dialog-message.component";
import {NgbTimepicker, NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  @ViewChild('timepicker') timepicker: NgbTimepicker;

  loading = false;

  // timeFrom: NgbTimeStruct = {hour: 13, minute: 30, second: 0};
  // timeTo: NgbTimeStruct = {hour: 13, minute: 30, second: 0};

  EH2HOperation: string[];
  eH2HOperation = EH2HOperation;
  EOperationStatus: string[];
  EH2HConnectorCode: string[];
  ELogSearchType: string[];
  eLogSearchType = ELogSearchType;

  utils = Utils;

  constructor(
    private jupiterApiService: JupiterApiService,
    private dialogService: NbDialogService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.EH2HOperation = Object.keys(EH2HOperation);
    this.EOperationStatus = Object.keys(EOperationStatus);
    this.EH2HConnectorCode = Object.keys(EH2HConnectorCode);
    this.ELogSearchType = Object.keys(ELogSearchType);

    let dateFrom = moment();
    let dateTo = moment().add(1, "days");

    if(!this.jupiterApiService.elasticLogsRQ){
      this.jupiterApiService.elasticLogsRQ = new ElasticLogsRQ({
        LogSearchType: ELogSearchType.SERVICE_CALL,
        Pid: null,
        Query: null,
        Status: null,
        Method: null,
        ConnectorCode: null,
        From: 0,
        Size: 10,
        DateFrom: dateFrom.format('YYYY-MM-DD'),
        DateTo: dateTo.format('YYYY-MM-DD')
      });

      this.jupiterApiService.elasticLogsRQ['_DateFromMoment'] = dateFrom;
      this.jupiterApiService.elasticLogsRQ['_DateFromTime'] = {hour: 0, minute: 0, second: 0};
      this.jupiterApiService.elasticLogsRQ['_DateToMoment'] = dateTo;
      this.jupiterApiService.elasticLogsRQ['_DateToTime'] = {hour: 0, minute: 0, second: 0};
      this.jupiterApiService.elasticLogsRQ['_MethodDropdown'] = 'All';
      this.jupiterApiService.elasticLogsRQ['_StatusDropdown'] = 'All';
    }
  }

  handleDateFromChange($event) {
    this.jupiterApiService.elasticLogsRQ.DateFrom = moment($event).format('YYYY-MM-DD');
  }

  handleDateToChange($event) {
    this.jupiterApiService.elasticLogsRQ.DateTo = moment($event).format('YYYY-MM-DD');
  }

  methodChanged(value) {
    if (value === 'All') {
      this.jupiterApiService.elasticLogsRQ.Method = null;
    } else if (value !== 'Manual') {
      this.jupiterApiService.elasticLogsRQ.Method = value;
    }
  }

  statusChanged(value) {
    if (value === 'All') {
      this.jupiterApiService.elasticLogsRQ.Status = null;
    } else {
      this.jupiterApiService.elasticLogsRQ.Status = value;
    }
  }

  downloadFile(data, filename, filetype) {
    const blob = new Blob([data], { type: filetype });
    // const url= window.URL.createObjectURL(blob);
    // window.open(url);

    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    // start download
    a.click();

  }

  getFlow(callLog: BaseCallLog) {
    let search = new ElasticLogsRQ({
      LogSearchType: ELogSearchType.FLOW,
      Pid: callLog.Pid,
      Query: null,
      Status: null,
      Method: null,
      ConnectorCode: null,
      From: this.jupiterApiService.elasticLogsRQ.From,
      Size: this.jupiterApiService.elasticLogsRQ.Size,
      DateFrom: this.jupiterApiService.elasticLogsRQ.DateFrom,
      DateTo: this.jupiterApiService.elasticLogsRQ.DateTo
    });


    search['_DateFromMoment'] = this.jupiterApiService.elasticLogsRQ['_DateFromMoment'];
    search['_DateFromTime'] = this.jupiterApiService.elasticLogsRQ['_DateFromTime']
    search['_DateToMoment'] = this.jupiterApiService.elasticLogsRQ['_DateToMoment'];
    search['_DateToTime'] = this.jupiterApiService.elasticLogsRQ['_DateToTime']
    search['_MethodDropdown'] = 'All';
    search['_StatusDropdown'] = 'All';

    this.jupiterApiService.elasticLogsRQ = search;
    this.searchLogs();
  }

  loadMore(){
    this.jupiterApiService.elasticLogsRQ.From += this.jupiterApiService.elasticLogsRQ.Size;
    this.searchLogs();
  }

  searchLogs() {
    this.loading = true;
    this.jupiterApiService.elasticLogsRS = null;

    this.jupiterApiService.elasticLogsRQ.DateFrom =  `${this.jupiterApiService.elasticLogsRQ['_DateFromMoment'].format('YYYY-MM-DD')} ${this.timepicker.formatHour(this.jupiterApiService.elasticLogsRQ['_DateFromTime'].hour)}:${this.timepicker.formatMinSec(this.jupiterApiService.elasticLogsRQ['_DateFromTime'].minute)}:${this.timepicker.formatMinSec(this.jupiterApiService.elasticLogsRQ['_DateFromTime'].second)}`;
    this.jupiterApiService.elasticLogsRQ.DateTo =  `${this.jupiterApiService.elasticLogsRQ['_DateToMoment'].format('YYYY-MM-DD')} ${this.timepicker.formatHour(this.jupiterApiService.elasticLogsRQ['_DateToTime'].hour)}:${this.timepicker.formatMinSec(this.jupiterApiService.elasticLogsRQ['_DateToTime'].minute)}:${this.timepicker.formatMinSec(this.jupiterApiService.elasticLogsRQ['_DateToTime'].second)}`;

    this.jupiterApiService.elasticLogs(this.jupiterApiService.elasticLogsRQ).subscribe(response => {
      this.jupiterApiService.elasticLogsRS = response;

      if (this.jupiterApiService.elasticLogsRS && this.jupiterApiService.elasticLogsRS.ElasticUnderlineApiDebug && this.jupiterApiService.elasticLogsRS.ElasticUnderlineApiDebug.length > 0) {
        for (const apiCall of this.jupiterApiService.elasticLogsRS.ElasticUnderlineApiDebug) {
          apiCall.Request = this.utils.prettifyJson(apiCall.Request);
          apiCall.Response = this.utils.prettifyJson(apiCall.Response);
        }
      }

      if (this.jupiterApiService.elasticLogsRS && this.jupiterApiService.elasticLogsRS.ServiceCall && this.jupiterApiService.elasticLogsRS.ServiceCall.length > 0) {
        for (const serviceCall of this.jupiterApiService.elasticLogsRS.ServiceCall) {
          if (serviceCall.ObjRQ) {
            serviceCall.ObjRQ = this.utils.prettifyJson(serviceCall.ObjRQ);
          }
          if (serviceCall.ObjRS) {
            serviceCall.ObjRS = this.utils.prettifyJson(serviceCall.ObjRS);
            try {
              serviceCall['_ParsedObjRS'] = JSON.parse(serviceCall.ObjRS);
            } catch (e) {
              serviceCall['_ParsedObjRS'] = serviceCall.ObjRS;
            }
          }
        }
      }

      if (this.jupiterApiService.elasticLogsRS && this.jupiterApiService.elasticLogsRS.RemoteCall && this.jupiterApiService.elasticLogsRS.RemoteCall.length > 0) {
        for (const remoteCall of this.jupiterApiService.elasticLogsRS.RemoteCall) {
          if (remoteCall.ObjRQ) {
            remoteCall.ObjRQ = this.utils.prettifyJson(remoteCall.ObjRQ);
          }
          if (remoteCall.XmlRQ) {
            remoteCall.XmlRQ = this.utils.prettifyXml(remoteCall.XmlRQ);
          }
          if (remoteCall.ObjRS) {
            remoteCall.ObjRS = this.utils.prettifyJson(remoteCall.ObjRS);
          }
          if (remoteCall.XmlRS) {
            remoteCall.XmlRS = this.utils.prettifyXml(remoteCall.XmlRS);
          }
        }
      }

      if (this.jupiterApiService.elasticLogsRS && this.jupiterApiService.elasticLogsRS.CustomCall && this.jupiterApiService.elasticLogsRS.CustomCall.length > 0) {
        for (const customCall of this.jupiterApiService.elasticLogsRS.CustomCall) {
          if (customCall.ObjRQ) {
            customCall.ObjRQ = this.utils.prettifyJson(customCall.ObjRQ);
          }
          if (customCall.ObjRS) {
            customCall.ObjRS = this.utils.prettifyJson(customCall.ObjRS);
          }
        }
      }

      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'Elastic logs Error',
          error: error
        },
      });
    });
  }

  view(callLog: CallLog) {
    let url = null;

    // path: 'gds-cryptic',
    // path: 'flight-search',
    // path: 'flight-pnr-retrieve',
    // path: 'flight-queue-list',
    // path: 'hotel-detail',
    // path: 'hotel-calendar-avail',
    // path: 'hotel-avail',
    // path: 'hotel-single-avail',
    // path: 'hotel-extras-avail',
    // path: 'hotel-price-verify',
    // path: 'hotel-book',
    // path: 'hotel-book-search',
    // path: 'hotel-book-detail',
    // path: 'train-avail',
    // path: 'car-avail',
    // path: 'car-book-detail',


    switch (callLog.Method) {
      case EH2HOperation.FLIGHT_AVAIL:
      case EH2HOperation.FLIGHT_DETAILS:
      case EH2HOperation.FLIGHT_BOOK:
        url = '/flight-search';
        // url = this.router.serializeUrl(
        //   this.router.createUrlTree(['/flight-search'])
        // );
        break;
      case EH2HOperation.FLIGHT_PNR_RETRIEVE:
        url = '/flight-pnr-retrieve';
        break;
      case EH2HOperation.FLIGHT_QUEUE_LIST:
      case EH2HOperation.FLIGHT_QUEUE_REMOVE_PNR:
      case EH2HOperation.FLIGHT_QUEUE_PLACE_PNR:
        url = '/flight-queue-list';
        break;

      case EH2HOperation.CRYPTIC:
        url = '/gds-cryptic';
        break;

      case EH2HOperation.HOTEL_AVAIL:
        url = '/hotel-avail';
        break;
      case EH2HOperation.HOTEL_AVAIL_SINGLE:
        url = '/hotel-single-avail';
        break;
      case EH2HOperation.HOTEL_AVAIL_EXTRAS:
        url = '/hotel-extras-avail';
        break;
      case EH2HOperation.HOTEL_AVAIL_CALENDAR:
        url = '/hotel-calendar-avail';
        break;
      case EH2HOperation.HOTEL_DETAILS:
        url = '/hotel-detail';
        break;
      case EH2HOperation.HOTEL_PRICE_VERIFY:
        url = '/hotel-price-verify';
        break;
      case EH2HOperation.HOTEL_BOOK_SEARCH:
        url = '/hotel-book-search';
        break;
      case EH2HOperation.HOTEL_BOOK_DETAIL:
      case EH2HOperation.HOTEL_BOOK_CANCEL:
        url = '/hotel-book-detail';
        break;

      case EH2HOperation.TRAIN_AVAIL:
        url = '/train-avail';
        break;
      case EH2HOperation.CAR_AVAIL:
        url = '/car-avail';
        break;
      case EH2HOperation.CAR_BOOK_DETAIL:
        url = '/car-book-detail';
        break;
      default:

        break;
    }

    if(url){
      this.jupiterApiService.selectedLogMethod = callLog.Method;
      this.jupiterApiService.selectedLogRqJson = callLog.ObjRQ;
      this.jupiterApiService.selectedLogRsJson = callLog.ObjRS;
      this.router.navigate([url])
    }else{
      this.dialogService.open(DialogMessageComponent, {
        context: {
          title: 'Missing Component',
          message: `Missing Component for ${callLog.Method}`,
          status: 'danger'
        },
      });
    }
  }
}
