import {Component, OnInit, ViewChild} from '@angular/core';
import {NbAccordionItemComponent, NbDateService, NbDialogService} from '@nebular/theme';
import Utils from '../../../../utility/utils';
import {
  AvailabilityInputCustomData,
  BookingDotComAvailabilityInputCustomData, BookingDotComHotelDetailInputCustomData, CreoleHotelDetailInputCustomData, EH2HConnectorCode,
  EH2HOperation,
  HotelbedsHotelDetailInputCustomData,
  IHGAvailabilityInputCustomData, IHGHotelBookDetailInputCustomData,
  JupiterHotelAvailabilityRQ,
  JupiterHotelAvailabilityRS,
  JupiterHotelDetailRQ,
  JupiterHotelDetailRS,
  JupiterSingleHotelAvailabilityRQ,
  PaxRequest,
  RoomRequest,
  SabreAvailabilityInputCustomData,
  SabreBookingReference,
  SabreSynXisAvailabilityInputCustomData,
  SabreSynXisHotelBookDetailInputCustomData,
  SabreSynXisRoomRequestCustomData,
  SandalsAvailabilityInputCustomData,
  SingleHotelAvailResult
} from '../../../../services/jupiter-api/jupiter-api-client';
import {HotelPagesService} from '../../common/services/hotel-pages.service';
import {Moment} from 'moment';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';
import {AppConfigService} from '../../../../services/app-config/app-config.service';
import {DialogApiErrorComponent} from '../../common/components/dialog-api-error/dialog-api-error.component';
import {DialogMessageComponent} from '../../common/components/dialog-message/dialog-message.component';

@Component({
  selector: 'jupiter-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss']
})
export class HotelDetailComponent implements OnInit {
  @ViewChild('accordionItemRq', {static: true}) accordionItemRq: NbAccordionItemComponent;

  utils = Utils;
  loading = false;

  jupiterHotelDetailRQ: JupiterHotelDetailRQ = null;
  jupiterHotelDetailRS: JupiterHotelDetailRS = null;

  viewPortItems: SingleHotelAvailResult[];
  showPricePerDay = false;
  daysCount = 0;

  EH2HConnectorCode = EH2HConnectorCode;
  connectors: EH2HConnectorCode[] = null;

  constructor(private hotelPagesService: HotelPagesService, private dialogService: NbDialogService, protected dateService: NbDateService<Moment>, private jupiterApiService: JupiterApiService, public appConfigService: AppConfigService) {
  }

  ngOnInit() {
    // Get Connectors Enabled to operation
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.HOTEL_DETAILS);
    if(this.jupiterApiService.selectedLogMethod && this.jupiterApiService.selectedLogRqJson && this.jupiterApiService.selectedLogRsJson){
      this.jupiterHotelDetailRQ = JupiterHotelDetailRQ.fromJS(JSON.parse(this.jupiterApiService.selectedLogRqJson));
      this.jupiterHotelDetailRS = JupiterHotelDetailRS.fromJS(JSON.parse(this.jupiterApiService.selectedLogRsJson));
      this.jupiterApiService.selectedLogMethod = null;
      this.jupiterApiService.selectedLogRqJson = null;
      this.jupiterApiService.selectedLogRsJson = null;
    }else {
      this.jupiterHotelDetailRQ = this.hotelPagesService.initJupiterHotelDetailRQ();
      this.jupiterHotelDetailRS = this.hotelPagesService.initJupiterHotelDetailRS();
      if (this.hotelPagesService.availSelectedModel) {
        this.doHotelDetails();
      }
    }
  }

  /**
   * Callback Changed the main Connector -> Add Custom data
   * @param connector
   */
  handleConnectorsChanged(connector: EH2HConnectorCode) {
    switch (connector) {
      case EH2HConnectorCode.SABRE_SYNXIS:
        this.jupiterHotelDetailRQ.Request.HotelRefIds = ['61667', '11206', '11113', '24684'];
        // this.jupiterHotelDetailRQ.Request.ConnectorCustomData = new SabreHotelDe({
        //   ChannelSubSourceCode: '',
        //   ChainCode: '',
        //   HotelCode: '',
        //   SabreBookingReference: new SabreBookingReference({
        //     Id: '',
        //     InfoType: '',
        //     Type: ''
        //   })
        // });
        break;
      case EH2HConnectorCode.IHG_GRS:
        this.jupiterHotelDetailRQ.Request.HotelRefIds = ['SINDX', 'SINMW', 'MILAS', 'LAXHC'];

        // this.jupiterHotelDetailRQ.Request.ConnectorCustomData = new IHGHotelBookDetailInputCustomData({
        //   IhgAgentToken: '',
        //   IhgImpersonatorId: '',
        //   IhgPos: '',
        //   IhgSessionId: '',
        //   IhgSsoToken: '',
        //   LastName: 'Doe',
        // });
        break;
      case EH2HConnectorCode.BOOKING_DOT_COM:
        this.jupiterHotelDetailRQ.Request.HotelRefIds = [];
        this.jupiterHotelDetailRQ.Request.ConnectorCustomData = new BookingDotComHotelDetailInputCustomData({
          Rows: 10,
          Offset: 0,
          ReturnAcceptedCreditCards: false,
          ReturnRoomInfo: false,
          ReturnRoomPhotos: false,
          ReturnHotelPhotos: true,
          ReturnHotelPolicies: false,
          ReturnPaymentDetails: false,
          ReturnRoomFacilities: false,
          ReturnHotelFacilities: true,
          ReturnRoomDescription: false,
          ReturnHotelDescription: true,
          ReturnKeyCollectionInfo: false        
         });
        break;
      case EH2HConnectorCode.CREOLE:
        this.jupiterHotelDetailRQ.Request.HotelRefIds = ['JP046300', 'JP150074', 'JP046391'];
        this.jupiterHotelDetailRQ.Request.ConnectorCustomData = null;
        break;
      case EH2HConnectorCode.HOTELBEDS:
        this.jupiterHotelDetailRQ.Request.HotelRefIds = ['265', '138780'];
        this.jupiterHotelDetailRQ.Request.ConnectorCustomData = new HotelbedsHotelDetailInputCustomData({
          UseSecondaryLanguage: false
        });
        break;
      case EH2HConnectorCode.JONVIEW:
        this.jupiterHotelDetailRQ.Request.HotelRefIds = ['YTODI','YTOCI'];
        this.jupiterHotelDetailRQ.Request.ConnectorCustomData = null;
        break;
      case EH2HConnectorCode.TEAM_AMERICA:
        this.jupiterHotelDetailRQ.Request.HotelRefIds = ['55','57'];
        this.jupiterHotelDetailRQ.Request.ConnectorCustomData = null;
        break;
    }
  }

  /**
   * Delete custom data
   */
  deleteCustomData() {
    this.jupiterHotelDetailRQ.Request.ConnectorCustomData = null;
  }
  /**
   * Execute the Availability Search
   */
  doHotelDetails() {
    this.loading = true;

    this.jupiterApiService.hotelDetails(this.jupiterHotelDetailRQ).subscribe(response => {
      this.jupiterHotelDetailRS = response;
      this.accordionItemRq.close();
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'hotelAvailability Error',
          error: error
        },
      });
    });
  }
}
