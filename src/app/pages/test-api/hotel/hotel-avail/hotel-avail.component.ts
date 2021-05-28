import {Component, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Moment} from 'moment';
import {
  AicAvailabilityInputCustomData,
  AlliedHotelAvailabilityInputCustomData,
  America4YouAvailabilityInputCustomData,
  AvailabilityInputCustomData,
  BookingDotComAvailabilityInputCustomData,
  CreoleHotelAvailabilityInputCustomData,
  EAvailabilityType,
  EH2HConnectorCode,
  EH2HOperation,
  EHotelCategory,
  EHotelType,
  EMealPlanType,
  EPaxType, ERequestStatus, HotelbedsAvailabilityInputCustomData,
  IHGAvailabilityInputCustomData,
  IHGRoomRequestCustomData, JupiterFlightPnrRetrieveRQ, JupiterFlightPnrRetrieveRS,
  JonviewAvailabilityInputCustomData,
  JtbAvailabilityInputCustomData,
  JupiterHotelAvailabilityRQ,
  JupiterHotelAvailabilityRS,
  LatLng,
  PaxRequest,
  RoomRatePlan,
  RoomRequest,
  SabreAvailabilityInputCustomData,
  SabreSynXisAvailabilityInputCustomData,
  SabreSynXisRoomRequestCustomData,
  SandalsAvailabilityInputCustomData,
  SingleHotelAvailResult,
  TeamAmericaAvailabilityInputCustomData,
  TekuraAvailabilityInputCustomData,
  AotAvailabilityInputCustomData,
  AtiAvailabilityInputCustomData,
  ExpediaAvailabilityInputCustomData,
  GoWestAvailabilityInputCustomData,
  MecaAvailabilityInputCustomData,
  OlympiaAvailabilityInputCustomData,
  PacificDestinationsAvailabilityInputCustomData,
  RestelAvailabilityInputCustomData,
  RMHToursAvailabilityInputCustomData,
  RosieAvailabilityInputCustomData,
  TourMappersAvailabilityInputCustomData,
  TravalcoAvailabilityInputCustomData,
  WtsAvailabilityInputCustomData,
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

    if(this.jupiterApiService.selectedLogMethod && this.jupiterApiService.selectedLogRqJson && this.jupiterApiService.selectedLogRsJson){
      this.jupiterHotelAvailabilityRq = JupiterHotelAvailabilityRQ.fromJS(JSON.parse(this.jupiterApiService.selectedLogRqJson));
      this.jupiterHotelAvailabilityRs = JupiterHotelAvailabilityRS.fromJS(JSON.parse(this.jupiterApiService.selectedLogRsJson));
      this.jupiterApiService.selectedLogMethod = null;
      this.jupiterApiService.selectedLogRqJson = null;
      this.jupiterApiService.selectedLogRsJson = null;
    }else {
      this.jupiterHotelAvailabilityRq = this.hotelPagesService.initJupiterHotelAvailabilityRQ();
      this.jupiterHotelAvailabilityRs = this.hotelPagesService.initJupiterHotelAvailabilityRS();
    }
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
                HotelRefIds: [],
                DestinationRefIds: ['PAR'],
                Position: new LatLng({Lat: null, Lng:null}),
                Radius: null,
                Nationality: 'IT',
                AvailabilityTypes: [EAvailabilityType.AVAILONLY],
                HotelCategory: null,
                StarsPreferred: []
              }));
            }
            break;
        case EH2HConnectorCode.ALLIED:
            if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
              return c['_discriminator'] === EH2HConnectorCode.ALLIED;
            })) {
              this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new AlliedHotelAvailabilityInputCustomData({
                HotelRefIds:['159511'],
                DestinationRefIds: [],
                Nationality: '',
                RegionRefId: null,
                MaxRatePlanCount: null
              }));
            }
            break;
        case EH2HConnectorCode.AMERICA_4_YOU:
              if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
                return c['_discriminator'] === EH2HConnectorCode.AMERICA_4_YOU;
              })) {
                this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new America4YouAvailabilityInputCustomData({
                  HotelRefIds:[],
                  DestinationRefIds: ['ARZ']
                }));
              }
              break;
        case EH2HConnectorCode.JONVIEW:
              if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
                return c['_discriminator'] === EH2HConnectorCode.JONVIEW;
              })) {
                this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new JonviewAvailabilityInputCustomData({
                  HotelRefIds:[],
                  DestinationRefIds: ['YTO'],
                  Status:ERequestStatus.AVAILABLE,
                  DisplayName: true,
                  DisplayAvail: true,
                  DisplayRoomConfig: true,
                  DisplayRestriction: false,
                  DisplayPolicy: true,
                  DisplayDynamicRates: false,
                  DisplayGeoCode: false
                }));
              }
              break;
        case EH2HConnectorCode.JTB:
              if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
                return c['_discriminator'] === EH2HConnectorCode.JTB;
              })) {
                this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new JtbAvailabilityInputCustomData({
                  HotelRefIds:['4016001','1533015','1408001','1211003'],
                  DestinationRefIds: [],
                  HotelType: EHotelType.ALL,
                  RatePlanId: null,
                  MealPlanCode: EMealPlanType.ALL,
                  HotelName: true,
                  HotelAddress: true,
                  RatePlanName: true,
                  RatePlanShortName: true,
                  CancelPolicyFlag: true
                }));
              }
              break;
        case EH2HConnectorCode.TEAM_AMERICA:
              if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
                return c['_discriminator'] === EH2HConnectorCode.TEAM_AMERICA;
              })) {
                this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new TeamAmericaAvailabilityInputCustomData({
                  HotelRefIds:[],
                  DestinationRefIds: ['NYC'],
                  ProductCode: '',
                  Nationality: '',
                  DisplayClosedOut: false,
                  DisplayOnRequest: false
                }));
              }
              break;
        case EH2HConnectorCode.TEKURA:
              if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
                return c['_discriminator'] === EH2HConnectorCode.TEKURA;
              })) {
                this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new TekuraAvailabilityInputCustomData({
                  HotelRefIds:[],
                  DestinationRefIds: ['MOZ']
                }));
              }
              break;
        case EH2HConnectorCode.AOT:
              if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
                return c['_discriminator'] === EH2HConnectorCode.AOT;
              })) {
                this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new AotAvailabilityInputCustomData({
                  HotelRefIds:[],
                  DestinationRefIds: [],
                  LocationCode: "1252",
                  LocationType: "T"
                }));
              }
              break;
        case EH2HConnectorCode.ATI:
              if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
                return c['_discriminator'] === EH2HConnectorCode.ATI;
              })) {
                this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new AtiAvailabilityInputCustomData({
                  HotelRefIds:[],
                  DestinationRefIds: ['10319']
                }));
              }
              break;
        // case EH2HConnectorCode.EXPEDIA:
        //       if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
        //         return c['_discriminator'] === EH2HConnectorCode.EXPEDIA;
        //       })) {
        //         this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new ExpediaAvailabilityInputCustomData({
        //           HotelRefIds:[],
        //           DestinationRefIds: []
        //         }));
        //       }
        //       break;
        case EH2HConnectorCode.GO_WEST:
          if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.GO_WEST;
          })) {
            this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new GoWestAvailabilityInputCustomData({
              HotelRefIds:[],
              DestinationRefIds: ['NYC']
            }));
          }
          break;
        case EH2HConnectorCode.MECA:
            if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
              return c['_discriminator'] === EH2HConnectorCode.MECA;
            })) {
              this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new MecaAvailabilityInputCustomData({
                HotelRefIds:[],
                DestinationRefIds: ['3147fef2-99c7-439a'],
                ConfirmedAvailability: false,
                SearchAllOptions:true
              }));
            }
            break;
        case EH2HConnectorCode.OLYMPIA:
            if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
              return c['_discriminator'] === EH2HConnectorCode.OLYMPIA;
            })) {
              this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new OlympiaAvailabilityInputCustomData({
                HotelRefIds:[],
                DestinationRefIds: ['1076'],
                AvailableOnly: true,
                BestOnly:true,
                FilterNonRefundable: true
              }));
            }
            break;
        case EH2HConnectorCode.PACIFIC_DESTINATIONS:
            if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
              return c['_discriminator'] === EH2HConnectorCode.PACIFIC_DESTINATIONS;
            })) {
              this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new PacificDestinationsAvailabilityInputCustomData({
                HotelRefIds:[],
                DestinationRefIds: ['CHC']
              }));
            }
            break;
        case EH2HConnectorCode.RESTEL:
            if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
              return c['_discriminator'] === EH2HConnectorCode.RESTEL;
            })) {
              this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new RestelAvailabilityInputCustomData({
                HotelRefIds:[],
                DestinationRefIds: ['IT|ITMIL'],
                ClientCountry: 'IT'
              }));
            }
            break;
        case EH2HConnectorCode.RMH_TOURS:
            if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
              return c['_discriminator'] === EH2HConnectorCode.RMH_TOURS;
            })) {
              this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new RMHToursAvailabilityInputCustomData({
                HotelRefIds:[],
                DestinationRefIds: ['FLG']
              }));
            }
            break;
        case EH2HConnectorCode.ROSIE:
            if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
              return c['_discriminator'] === EH2HConnectorCode.ROSIE;
            })) {
              this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new RosieAvailabilityInputCustomData({
                HotelRefIds:[],
                DestinationRefIds: ['MAM']
              }));
            }
            break;
        case EH2HConnectorCode.TOURMAPPERS:
            if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
              return c['_discriminator'] === EH2HConnectorCode.TOURMAPPERS;
            })) {
              this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new TourMappersAvailabilityInputCustomData({
                HotelRefIds:[],
                DestinationRefIds: ['CY82']
              }));
            }
            break;
        case EH2HConnectorCode.TRAVALCO:
            if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
              return c['_discriminator'] === EH2HConnectorCode.TRAVALCO;
            })) {
              this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new TravalcoAvailabilityInputCustomData({
                HotelRefIds:[],
                DestinationRefIds: ['1658']
              }));
            }
            break;
        case EH2HConnectorCode.WTS:
            if (!_.some(this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
              return c['_discriminator'] === EH2HConnectorCode.WTS;
            })) {
              this.jupiterHotelAvailabilityRq.Request.ConnectorsSettings.push(new WtsAvailabilityInputCustomData({
                HotelRefIds:[],
                DestinationRefIds: ['Durban'],
                IncludeRoomInformation:true,
                IncludeCancellationPolicies:true,
                IncludeStayPays:true
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
