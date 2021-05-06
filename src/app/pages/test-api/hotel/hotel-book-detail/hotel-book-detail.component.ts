import {Component, OnInit, ViewChild} from '@angular/core';
import {NbAccordionItemComponent, NbDialogService} from '@nebular/theme';
import Utils from '../../../../utility/utils';
import {
  AicHotelBookDetailInputCustomData,
  EBookingStatus, EH2HConnectorCode,
  EH2HOperation, EIHGReservationRetrieveMode, IHGHotelBookCancelInputCustomData, IHGHotelBookDetailInputCustomData,
  IHGHotelBookSearchInputCustomData, JupiterHotelBookCancelInput,
  JupiterHotelBookCancelRQ,
  JupiterHotelBookCancelRS,
  JupiterHotelBookDetailInput,
  JupiterHotelBookDetailRQ,
  JupiterHotelBookDetailRS,
  JupiterHotelBookSearchInput,
  JupiterHotelBookSearchRQ,
  JupiterHotelBookSearchRS, OkkamiHotelBookCancelInputCustomData, OkkamiHotelBookDetailInputCustomData, SabreBookingReference, SabreSynXisHotelBookCancelInputCustomData, SabreSynXisHotelBookDetailInputCustomData,
  SabreSynXisHotelBookSearchInputCustomData, SabreSynXisSingleBookDetailCustomData, SingleBookDetail
} from '../../../../services/jupiter-api/jupiter-api-client';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';
import {AppConfigService} from '../../../../services/app-config/app-config.service';
import {DialogApiErrorComponent} from '../../common/components/dialog-api-error/dialog-api-error.component';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'jupiter-hotel-book-detail',
  templateUrl: './hotel-book-detail.component.html',
  styleUrls: ['./hotel-book-detail.component.scss']
})
export class HotelBookDetailComponent implements OnInit {
  @ViewChild('accordionItemBookDetailRq', {static: true}) accordionItemBookDetailRq: NbAccordionItemComponent;

  utils = Utils;
  loading = false;
  showPricePerDay = false;
  // Todo Calculate daysCount
  daysCount = 0;

  jupiterHotelBookCancelRQ: JupiterHotelBookCancelRQ = null;
  jupiterHotelBookCancelRS: JupiterHotelBookCancelRS = null;

  jupiterHotelBookDetailRQ: JupiterHotelBookDetailRQ = null;
  jupiterHotelBookDetailRS: JupiterHotelBookDetailRS = null;

  EBookingStatus = EBookingStatus;
  EH2HConnectorCode = EH2HConnectorCode;

  connectors: EH2HConnectorCode[] = null;

  constructor(private dialogService: NbDialogService, private jupiterApiService: JupiterApiService, public appConfigService: AppConfigService) {
  }

  ngOnInit() {
    // Get Connectors Enabled to operation
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.HOTEL_BOOK_DETAIL);
    if(this.jupiterApiService.selectedLogMethod && this.jupiterApiService.selectedLogRqJson && this.jupiterApiService.selectedLogRsJson){

      switch (this.jupiterApiService.selectedLogMethod) {
        case EH2HOperation.HOTEL_BOOK_DETAIL:
          this.jupiterHotelBookDetailRQ = JupiterHotelBookDetailRQ.fromJS(JSON.parse(this.jupiterApiService.selectedLogRqJson));
          this.jupiterHotelBookDetailRS = JupiterHotelBookDetailRS.fromJS(JSON.parse(this.jupiterApiService.selectedLogRsJson));
          this.jupiterApiService.selectedLogMethod = null;
          this.jupiterApiService.selectedLogRqJson = null;
          this.jupiterApiService.selectedLogRsJson = null;
          break;
        case EH2HOperation.HOTEL_BOOK_CANCEL:
          this.jupiterHotelBookCancelRQ = JupiterHotelBookCancelRQ.fromJS(JSON.parse(this.jupiterApiService.selectedLogRqJson));
          this.jupiterHotelBookCancelRS = JupiterHotelBookCancelRS.fromJS(JSON.parse(this.jupiterApiService.selectedLogRsJson));
          this.jupiterApiService.selectedLogMethod = null;
          this.jupiterApiService.selectedLogRqJson = null;
          this.jupiterApiService.selectedLogRsJson = null;
          break;
      }
    }

    if(!this.jupiterHotelBookDetailRQ){
      this.jupiterHotelBookDetailRQ = new JupiterHotelBookDetailRQ({
        Request: new JupiterHotelBookDetailInput({
          ConnectorsDebug: null,
          ConnectorCode: null,
          ConnectorCustomData: null,
          ConnectorBookingReference: null
        })
      });
    }

  }

  /**
   * Callback Changed the main Connector -> Add Custom data
   * @param connector
   */
  handleConnectorsChanged(connector: EH2HConnectorCode) {
    switch (connector) {
      case EH2HConnectorCode.SABRE_SYNXIS:
        // Use any Value in ConnectorBookingReference -> the Reservation will be retrieved from the SabreBookingReference
        this.jupiterHotelBookDetailRQ.Request.ConnectorBookingReference = 'AnyValue';
        this.jupiterHotelBookDetailRQ.Request.ConnectorCustomData = new SabreSynXisHotelBookDetailInputCustomData({
          ChannelSubSourceCode: '',
          ChainCode: '',
          HotelCode: '60176', // DHO Test Hotel
          SabreBookingReference: new SabreBookingReference({
            Id: '5154B12155476',
            InfoType: '',
            Type: '34' // Itinerary 34 - Single Book 14
          })
        });
        break;
      case EH2HConnectorCode.IHG_GRS:
        this.jupiterHotelBookDetailRQ.Request.ConnectorBookingReference = '21473790';
        // this.jupiterHotelBookDetailRQ.Request.ConnectorBookingReference = '29499918';
        // this.jupiterHotelBookDetailRQ.Request.ConnectorBookingReference = '22355639';
        // this.jupiterHotelBookDetailRQ.Request.ConnectorBookingReference = '42006094';
        // this.jupiterHotelBookDetailRQ.Request.ConnectorBookingReference = '23927085';

        this.jupiterHotelBookDetailRQ.Request.ConnectorCustomData = new IHGHotelBookDetailInputCustomData({
          IhgAgentToken: '',
          IhgImpersonatorId: '',
          IhgPos: '',
          IhgSessionId: '',
          IhgSsoToken: '',
          LastName: 'Doe',
        });
        break;
      case EH2HConnectorCode.OKKAMI:
        this.jupiterHotelBookDetailRQ.Request.ConnectorBookingReference = '123Test';

        this.jupiterHotelBookDetailRQ.Request.ConnectorCustomData = new OkkamiHotelBookDetailInputCustomData({
          PropertyUid: '000-000-0019' // Yao Noi
          // PropertyUid: '000-000-0055' // Six Istanbul
        });
        break;
        case EH2HConnectorCode.AIC:
          this.jupiterHotelBookDetailRQ.Request.ConnectorBookingReference = 'aicbookcode001';

          this.jupiterHotelBookDetailRQ.Request.ConnectorCustomData = new AicHotelBookDetailInputCustomData({
            BookingCode: '20-3252'
          });
          break;
    }
  }

  /**
   * Delete custom data
   */
  deleteCustomData() {
    this.jupiterHotelBookDetailRQ.Request.ConnectorCustomData = null;
  }

  doBookDetail() {
    this.loading = true;

    this.jupiterApiService.hotelBookDetails(this.jupiterHotelBookDetailRQ).subscribe(response => {
      this.jupiterHotelBookDetailRS = response;
      this.accordionItemBookDetailRq.close();
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'hotelBookDetails Error',
          error: error
        },
      });
    });
  }

  deleteBookFromDetail(bookDetail: SingleBookDetail) {
    this.loading = true;

    this.jupiterHotelBookCancelRQ = new JupiterHotelBookCancelRQ({
      Request: new JupiterHotelBookCancelInput({
        ConnectorCode: bookDetail.ConnectorCode,
        ConnectorBookingReference: bookDetail.ConnectorBookingReference,
        Notes: 'Jupiter Dashboard Delete',
        ConnectorCustomData: null,
      })
    });

    // Add IHG required custom data that should be present in the detail RQ
    if (bookDetail.ConnectorCode === EH2HConnectorCode.IHG_GRS) {
      this.jupiterHotelBookCancelRQ.Request.ConnectorCustomData = new IHGHotelBookCancelInputCustomData({
        IhgSsoToken: (this.jupiterHotelBookDetailRQ.Request.ConnectorCustomData as IHGHotelBookDetailInputCustomData).IhgSsoToken,
        LastName: (this.jupiterHotelBookDetailRQ.Request.ConnectorCustomData as IHGHotelBookDetailInputCustomData).LastName,
      });
    }

    // Add OKKAMI required custom data that should be present in the detail RQ
    if (bookDetail.ConnectorCode === EH2HConnectorCode.OKKAMI) {
      this.jupiterHotelBookCancelRQ.Request.ConnectorCustomData = new OkkamiHotelBookCancelInputCustomData({
        PropertyUid: '000-000-0019' // Yao Noi
        // PropertyUid: '000-000-0055' // Six Istanbul
      });
    }

    // Add SABRE_SYNXIS required custom data that should be present in the detail RQ
    if (bookDetail.ConnectorCode === EH2HConnectorCode.SABRE_SYNXIS) {
      this.jupiterHotelBookCancelRQ.Request.ConnectorCustomData = new SabreSynXisHotelBookCancelInputCustomData({
        HotelCode: (this.jupiterHotelBookDetailRQ.Request.ConnectorCustomData as SabreSynXisHotelBookDetailInputCustomData).HotelCode
      });
    }

    this.jupiterApiService.hotelBookCancel(this.jupiterHotelBookCancelRQ).subscribe(response => {
      this.jupiterHotelBookCancelRS = response;
      // Update the Book
      this.doBookDetail();
      // this.accordionItemBookDetailRq.close();
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'hotelBookCancel Error',
          error: error
        },
      });
    });
  }
}
