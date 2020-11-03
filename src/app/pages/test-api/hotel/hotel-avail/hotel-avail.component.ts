import {Component, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Moment} from 'moment';
import {
  AicAvailabilityInputCustomData,
  AvailabilityInputCustomData,
  BookingDotComAvailabilityInputCustomData,
  CreoleHotelAvailabilityInputCustomData,
  EAvailabilityType,
  EH2HConnectorCode,
  EH2HOperation,
  EPaxType, HotelbedsAvailabilityInputCustomData,
  IHGAvailabilityInputCustomData,
  IHGRoomRequestCustomData,
  JupiterHotelAvailabilityRQ,
  JupiterHotelAvailabilityRS,
  PaxRequest,
  RoomRatePlan,
  RoomRequest,
  SabreAvailabilityInputCustomData,
  SabreSynXisAvailabilityInputCustomData,
  SabreSynXisRoomRequestCustomData,
  SandalsAvailabilityInputCustomData,
  SingleHotelAvailResult,
} from '../../../../services/jupiter-api/jupiter-api-client';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';
import {AppConfigService} from '../../../../services/app-config/app-config.service';
import Utils from '../../../../utility/utils';
import {NbAccordionItemComponent, NbDateService, NbDialogService} from '@nebular/theme';
import {DialogApiErrorComponent} from '../../common/components/dialog-api-error/dialog-api-error.component';
import {HotelPagesService} from '../../common/services/hotel-pages.service';
import {DialogMessageComponent} from '../../common/components/dialog-message/dialog-message.component';
import {CustomDataInputSettings} from '../../common/components/custom-data-inputs/custom-data-inputs.component';

@Component({
  selector: 'jupiter-hotel-search',
  templateUrl: './hotel-avail.component.html',
  styleUrls: ['./hotel-avail.component.scss'],
})
export class HotelAvailComponent implements OnInit {
  @ViewChild('accordionItemRq', {static: true}) accordionItemRq: NbAccordionItemComponent;

  utils = Utils;
  loading = false;

  jupiterHotelAvailabilityRq: JupiterHotelAvailabilityRQ = null;
  jupiterHotelAvailabilityRs: JupiterHotelAvailabilityRS = null;

  viewPortItems: SingleHotelAvailResult[];
  showPricePerDay = false;
  daysCount = 0;

  EPaxType = EPaxType;
  EPaxTypeList = Object.keys(EPaxType);
  EH2HConnectorCode = EH2HConnectorCode;
  connectors: EH2HConnectorCode[] = null;

  constructor(private hotelPagesService: HotelPagesService, private dialogService: NbDialogService, protected dateService: NbDateService<Moment>, private jupiterApiService: JupiterApiService, public appConfigService: AppConfigService) {
  }

  ngOnInit() {
    // Get Connectors Enabled to operation
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.HOTEL_AVAIL);
    this.jupiterHotelAvailabilityRq = this.hotelPagesService.initJupiterHotelAvailabilityRQ();
    this.jupiterHotelAvailabilityRs = this.hotelPagesService.initJupiterHotelAvailabilityRS();
  }

  /**
   * Format From and To Dates
   * @param $event
   */
  handleRangeChange($event) {
    if ($event.start) {
      this.jupiterHotelAvailabilityRq.Request.FromDate = moment($event.start).format('YYYY-MM-DD');
    }
    if ($event.end) {
      this.jupiterHotelAvailabilityRq.Request.ToDate = moment($event.end).format('YYYY-MM-DD');
    }
  }

  // /**
  //  * Format FromDate
  //  * @param $event
  //  */
  // handleFromDateChange($event) {
  //   this.jupiterHotelAvailabilityRq.Request.FromDate = moment($event).format('YYYY-MM-DD');
  // }
  //
  // /**
  //  * Format FromDate
  //  * @param $event
  //  */
  // handleToDateChange($event) {
  //   this.jupiterHotelAvailabilityRq.Request.ToDate = moment($event).format('YYYY-MM-DD');
  // }

  /**
   * Callback Changed the main Connector -> Add Custom data
   * @param connector
   */
  searchConnectorsChanged(value: EH2HConnectorCode[]) {
    this.jupiterHotelAvailabilityRq.Request.ConnectorsSearchOnly = value;

    for (let connector of value) {
      switch (connector) {
        case EH2HConnectorCode.SABRE_SYNXIS:
          if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.SABRE_SYNXIS;
          })) {
            // SABRE_SYNXIS with some test data
            let customData = new SabreSynXisAvailabilityInputCustomData({
              DestinationRefIds: [],
              HotelRefIds: [
                '11206', // TEST
                '11113', // TEST
                '61667', // SixSenses YaoNoi
                '24684', // DHO LIVE
                '60176', // DHO Live Test Hotel
              ],
              ChannelSubSourceCode: '',
              ExactMatchOnly: false,
              PromotionCodes: ['CMPMKT'],
              RatePlanCodeOrGroupCode: 'GRP1',
              RatePlanType: '',
            });

            customData['_CustomDataInputSettings'] = new CustomDataInputSettings({
              dateProps: [],
              numProps: [],
              tagProps: ['HotelRefIds', 'DestinationRefIds'],
              enumProps: ['RetrieveMode'],
              boolProps: ['ExactMatchOnly'],
              objProps: [],
              objArrayProps: [],
              omitProps: [],
              enums: null
            });

            this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(customData);
          }
          break;
        case EH2HConnectorCode.BOOKING_DOT_COM:
          if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.BOOKING_DOT_COM;
          })) {
            let customData = new BookingDotComAvailabilityInputCustomData({
              DestinationRefIds: ['-121726'],
              HotelRefIds: ['470860'],
              NoDorms: true,
              AffiliateId: null,
              Rows: 10
              // Add others properties
            });

            this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(customData);
          }
          break;
        case EH2HConnectorCode.SABRE:
          if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.SABRE;
          })) {
            this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new SabreAvailabilityInputCustomData({
              DestinationRefIds: [''],
              HotelRefIds: [],
              // Add others properties
            }));
          }
          break;
        case EH2HConnectorCode.SANDALS:
          if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.SANDALS;
          })) {
            this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new SandalsAvailabilityInputCustomData({
              DestinationRefIds: ['NAS'],
              HotelRefIds: ['SRB'],
              // Add others properties
            }));
          }
          break;
        case EH2HConnectorCode.IHG_GRS:
          if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.IHG_GRS;
          })) {
            this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new IHGAvailabilityInputCustomData({
              // DestinationRefIds: ['NAS'],
              HotelRefIds: ['SINDX', 'SINMW', 'MILAS', 'LAXHC'],
              GroupCode: null,
              IhgAgentToken: '',
              IhgPos: '',
              IhgSessionId: '',
              IhgSsoToken: '',
              LoyaltyId: '',
              InternalRatePlanCodes: ['IGCOR', 'IVANI'],
              ExternalRatePlanCodes: [],

              // Add others properties
            }));
          }
          break;
        case EH2HConnectorCode.CREOLE:
          if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.CREOLE;
          })) {
            this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new CreoleHotelAvailabilityInputCustomData({
              DestinationRefIds: [''],
              HotelRefIds: ['JP046300', 'JP150074', 'JP046391'],
              CountryOfResidence: 'it'
              // Add others properties
            }));
          }
          break;
        case EH2HConnectorCode.HOTELBEDS:
          if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.HOTELBEDS;
          })) {
            this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new HotelbedsAvailabilityInputCustomData({
              DestinationRefIds: [''],
              HotelRefIds: ['265', '138780']
              // Add others properties
            }));
          }
          break;
        case EH2HConnectorCode.AIC:
            if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
              return c['_discriminator'] === EH2HConnectorCode.AIC;
            })) {
              this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new AicAvailabilityInputCustomData({
                DestinationRefIds: ['PAR'],
                Nationality: 'IT',
                AvailabilityTypes: [EAvailabilityType.AVAILONLY]
                // Add others properties
              }));
            }
            break;
          // case EH2HConnectorCode.PACIFIC_DESTINATIONS_AU:
        //   if (!_.some(this.hotelSearchModel.ConnectorSettings, function (c: AvailabilityInputCustomData) {
        //     return c['_discriminator'] === EH2HConnectorCode.PACIFIC_DESTINATIONS_AU;
        //   })) {
        //     this.hotelSearchModel.ConnectorSettings.push(new PacificAvailabilityInputCustomData({
        //       DestinationRefIds: ['-121726'],
        //       HotelRefIds: ['470860'],
        //       // Add others properties
        //     }));
        //   }
        //   break;
        // case EH2HConnectorCode.SABRE_CSL:
        //   if (!_.some(this.hotelSearchModel.ConnectorSettings, function (c: AvailabilityInputCustomData) {
        //     return c['_discriminator'] === EH2HConnectorCode.SABRE_CSL;
        //   })) {
        //     this.hotelSearchModel.ConnectorSettings.push(new SabreCslAvailabilityInputCustomData({
        //       DestinationRefIds: ['-121726'],
        //       HotelRefIds: ['470860'],
        //       // Add others properties
        //     }));
        //   }
        //   break;

      }
    }
  }

  /**
   * Delete custom data
   */
  deleteCustomData(index: number) {
    this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.splice(index, 1);
    // this.jupiterHotelAvailabilityRq.Request.ConnectorsSearchOnly.splice(index, 1);
  }

  /**
   * Callback Changed Room ConnectorCustomDataCode -> add Room Connector custom data
   * @param connector
   * @param room
   */
  roomConnectorCustomDataConnectorCodeChanged(connector: EH2HConnectorCode, room: RoomRequest) {
    room.ConnectorCustomData = null;
    switch (connector) {
      case EH2HConnectorCode.SABRE_SYNXIS:
        room.ConnectorCustomData = new SabreSynXisRoomRequestCustomData({
          RoomTypeCode: 'JRS',
        });
        break;
      case EH2HConnectorCode.IHG_GRS:
        room.ConnectorCustomData = new IHGRoomRequestCustomData({
          ProductCode: '',
          ProductTypeCode: ''
        });
        break;
    }
  }

  /**
   * Add a room
   */
  addRoom() {
    let room = new RoomRequest({
      Paxes: [
        new PaxRequest({
          Type: EPaxType.ADULT
        }),
        new PaxRequest({
          Type: EPaxType.ADULT
        })
      ],
      ConnectorCustomData: null,
    });

    // Additional Properties
    room['_ConnectorCustomDataConnectorCode'] = null;

    this.jupiterHotelAvailabilityRq.Request.Rooms.push(room);
  }

  /**
   * Remove a room
   * @param index
   */
  removeRoom(index: number) {
    this.jupiterHotelAvailabilityRq.Request.Rooms.splice(index, 1);
  }

  /**
   * Add a Pax to the room
   * @param room
   */
  addPax(room: RoomRequest) {
    room.Paxes.push(new PaxRequest({
      Type: EPaxType.ADULT,
    }));
  }

  /**
   * Remove the pax from the room
   * @param room
   * @param index
   */
  removePax(room: RoomRequest, index: number) {
    room.Paxes.splice(index, 1);
  }

  /**
   * Execute the Availability Search
   */
  searchHotelsAvailability() {
    this.loading = true;

    this.jupiterApiService.hotelAvailability(this.jupiterHotelAvailabilityRq).subscribe(response => {
      this.jupiterHotelAvailabilityRs = response;
      this.daysCount = moment(this.jupiterHotelAvailabilityRq.Request.ToDate).diff(moment(this.jupiterHotelAvailabilityRq.Request.FromDate), 'days');

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

  /**
   * Go to Single Hotel Avail
   * @param selectedHotel
   */
  goToSingleHotelAvail(selectedHotel: SingleHotelAvailResult, connectorCode: EH2HConnectorCode) {
    if (this.appConfigService.isConnectorOperationEnabled(connectorCode, EH2HOperation.HOTEL_AVAIL_SINGLE)) {
      this.hotelPagesService.navigateFormHotelAvailToHotelSingleAvail(this.jupiterHotelAvailabilityRq, this.jupiterHotelAvailabilityRs, selectedHotel, connectorCode);
    } else {
      this.dialogService.open(DialogMessageComponent, {
        context: {
          title: 'Connector Not Enabled',
          message: `The Connector ${connectorCode} is not enabled to ${EH2HOperation.HOTEL_AVAIL_SINGLE}`,
          status: 'danger'
        },
      });
    }
  }

  /**
   * Go to Single Hotel Avail
   * @param selectedHotel
   */
  goToHotelDetail(selectedHotel: SingleHotelAvailResult, connectorCode: EH2HConnectorCode) {
    if (this.appConfigService.isConnectorOperationEnabled(connectorCode, EH2HOperation.HOTEL_DETAILS)) {
      this.hotelPagesService.navigateFormHotelAvailToHotelDetail(this.jupiterHotelAvailabilityRq, this.jupiterHotelAvailabilityRs, selectedHotel, connectorCode);
    } else {
      this.dialogService.open(DialogMessageComponent, {
        context: {
          title: 'Connector Not Enabled',
          message: `The Connector ${connectorCode} is not enabled to ${EH2HOperation.HOTEL_AVAIL_SINGLE}`,
          status: 'danger'
        },
      });
    }
  }

  /**
   * Go to Price Verify
   * @param selectedHotel
   * @param selectedRate
   */
  goToHotelPriceVerify(selectedHotel: SingleHotelAvailResult, selectedRate: any) {
    if (this.appConfigService.isConnectorOperationEnabled(selectedRate.connectorCode, EH2HOperation.HOTEL_PRICE_VERIFY)) {
      this.hotelPagesService.navigateFromHotelAvailToPriceVerify(this.jupiterHotelAvailabilityRq, this.jupiterHotelAvailabilityRs, selectedHotel, selectedRate.rate, selectedRate.connectorCode);
    } else {
      this.dialogService.open(DialogMessageComponent, {
        context: {
          title: 'Connector Not Enabled',
          message: `The Connector ${selectedRate.connectorCode} is not enabled to ${EH2HOperation.HOTEL_PRICE_VERIFY}`,
          status: 'danger'
        },
      });
    }
  }
}
