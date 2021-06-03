import {Component, OnInit} from '@angular/core';
import {
  CreoleHotelAvailabilityInputCustomData,
  JupiterHotelPriceVerifyInput,
  JupiterHotelPriceVerifyRQ,
  JupiterHotelPriceVerifyRS,
  RoomDetails,
  RoomRatePlan,
  RoomRequest,
  SingleHotelAvailResult,
  EH2HConnectorCode,
  EH2HOperation, AvailabilityInputCustomData, SabreSynXisAvailabilityInputCustomData, BookingDotComAvailabilityInputCustomData, SabreAvailabilityInputCustomData, SandalsAvailabilityInputCustomData, IHGAvailabilityInputCustomData, EPaxType, AlliedRoomRequestCustomData, AlliedHotelAvailabilityInputCustomData, PaxRequest, AicAvailabilityInputCustomData, HotelbedsAvailabilityInputCustomData, MecaRoomRequestCustomData, OlympiaAvailabilityInputCustomData, EMealPlanType2, TravalcoAvailabilityInputCustomData
} from '../../../../services/jupiter-api/jupiter-api-client';
import Utils from '../../../../utility/utils';
import * as moment from 'moment';
import {HotelPagesService} from '../../common/services/hotel-pages.service';
import {NbDateService, NbDialogService} from '@nebular/theme';
import {Moment} from 'moment';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';
import {AppConfigService} from '../../../../services/app-config/app-config.service';
import {CustomDataInputSettings} from '../../common/components/custom-data-inputs/custom-data-inputs.component';

import * as _ from 'lodash';

@Component({
  selector: 'jupiter-hotel-price-verify',
  templateUrl: './hotel-price-verify.component.html',
  styleUrls: ['./hotel-price-verify.component.scss']
})
export class HotelPriceVerifyComponent implements OnInit {

  loading = false;
  utils = Utils;

  daysCount = 0;

  EPaxType = EPaxType;
  EPaxTypeList = Object.keys(EPaxType);
  EH2HConnectorCode = EH2HConnectorCode;
  connectors: EH2HConnectorCode[] = null;

  jupiterHotelPriceVerifyRq: JupiterHotelPriceVerifyRQ = null;
  jupiterHotelPriceVerifyRs: JupiterHotelPriceVerifyRS = null;

  constructor(private hotelPagesService: HotelPagesService, private dialogService: NbDialogService, protected dateService: NbDateService<Moment>, private jupiterApiService: JupiterApiService, public appConfigService: AppConfigService) {
  }

  ngOnInit() {
    // Get Connectors Enabled to operation
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.HOTEL_PRICE_VERIFY);
    if(this.jupiterApiService.selectedLogMethod && this.jupiterApiService.selectedLogRqJson && this.jupiterApiService.selectedLogRsJson){
      this.jupiterHotelPriceVerifyRq = JupiterHotelPriceVerifyRQ.fromJS(JSON.parse(this.jupiterApiService.selectedLogRqJson));
      this.jupiterHotelPriceVerifyRs = JupiterHotelPriceVerifyRS.fromJS(JSON.parse(this.jupiterApiService.selectedLogRsJson));
      this.jupiterApiService.selectedLogMethod = null;
      this.jupiterApiService.selectedLogRqJson = null;
      this.jupiterApiService.selectedLogRsJson = null;
    }else {
      this.jupiterHotelPriceVerifyRq = this.hotelPagesService.initJupiterHotelAvailabilityRQ();
      this.jupiterHotelPriceVerifyRs = this.hotelPagesService.initJupiterHotelAvailabilityRS();
    }
  }

  /**
   * Format From and To Dates
   * @param $event
   */
  handleRangeChange($event) {
    if ($event.start) {
      this.jupiterHotelPriceVerifyRq.Request.FromDate = moment($event.start).format('YYYY-MM-DD');
    }
    if ($event.end) {
      this.jupiterHotelPriceVerifyRq.Request.ToDate = moment($event.end).format('YYYY-MM-DD');
    }
  }

  /**
   * Callback Changed the main Connector -> Add Custom data
   * @param connector
   */
  searchConnectorsChanged(value: EH2HConnectorCode[]) {
    this.jupiterHotelPriceVerifyRq.Request.ConnectorsSearchOnly = value;

    for (let connector of value) {
      switch (connector) {
        case EH2HConnectorCode.AIC:
          if (!_.some(this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.AIC;
          })) {
            this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings.push(new AicAvailabilityInputCustomData({
              HotelRefIds: ['15905'],
              SearchNumber: '2230917',
              RatePlanCode: 'LCL.12715.@@1',
              RateTotalAmount: 56000,
              AvailabilityTypes: [],
              Nationality: ''
            }));
          }
          break;
        case EH2HConnectorCode.ALLIED:
          if (!_.some(this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.ALLIED;
          })) {
            this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings.push(new AlliedHotelAvailabilityInputCustomData({
              Nationality: 'IT'
            }));
          }
          break;
        case EH2HConnectorCode.HOTELBEDS:
          if (!_.some(this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.HOTELBEDS;
          })) {
            this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings.push(new HotelbedsAvailabilityInputCustomData({
              RateKey: '20201112|20201113|W|1|265|DBT.ST|CG-TODOS RO|RO||1~1~0||N@03~~2325a~-129388234~N~1401D763C5414A5159171731906400AAUK000000100000000052325a',
              Upselling: true
            }));
          }
          break;
        case EH2HConnectorCode.CREOLE:
          if (!_.some(this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.CREOLE;
          })) {
            this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings.push(new CreoleHotelAvailabilityInputCustomData({
              HotelCode: 'JP046300',
              RatePlanCode: 'ya79dM4dS6R6EywV4XhfElQXPfK/60FpVK31D50q16uucSELBfsh7dd+jURVTF8cPlbuvISw7euGCKW/3bpLA/hHnaECZ+C1Y5LsQauaGhe3vDtxbk+AmNi/T2h4plLRxW/a5vb/K5ifUH60U9sCfX+NnPCheFJcVzyFFwFMQ2Bp/Gf7i0vVQZaWUW60LGiyaWEIqwcHzcDl0+K3fBeel+W84BZL1Y1Z6S0xneEihf5aa8ovjikWSZJlPld9F2x2Ljgy0+SRsDL4dCzr6JsuqCzmFebpsRPB7mJNEMLFdxS++6AyfXosRKMW8c9hU+Bw'
            }));
          }
          break;
        case EH2HConnectorCode.OLYMPIA:
          if (!_.some(this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.OLYMPIA;
          })) {
            this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings.push(new OlympiaAvailabilityInputCustomData({
              HotelRefIds: ['124287'],
              GuestCountry: 'IT',
              MealPlans:[EMealPlanType2.ROOM_ONLY]
              }));
          }
          break;
        case EH2HConnectorCode.TRAVALCO:
          if (!_.some(this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.TRAVALCO;
          })) {
            this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings.push(new TravalcoAvailabilityInputCustomData({
              HotelRefIds: ['249'],
            }));
          }
          break;
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
    this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings.splice(index, 1);
  }

  /**
   * Callback Changed Room ConnectorCustomDataCode -> add Room Connector custom data
   * @param connector
   * @param room
   */
  roomConnectorCustomDataConnectorCodeChanged(connector: EH2HConnectorCode, room: RoomRequest) {
   room.ConnectorCustomData = null;
   switch (connector) {
     case EH2HConnectorCode.ALLIED:
       //TODO Paolo Verificare questo!! HotelId, MealId e RateCode non sono presenti sul modello!
       room.ConnectorCustomData = new AlliedRoomRequestCustomData({
       MealPlanCode: '1',
       RoomId: '1325458',
       RatePlanCode:'1325458_1_0_False_14_201731150£282076377',
       GuestName: 'Test name',
       ProviderId: 14,
       ExpectedBookingPrice: 10
      });
      break;
    case EH2HConnectorCode.MECA:
       room.ConnectorCustomData = new MecaRoomRequestCustomData({
       RatePlanCode:'1306906d-72c0-4575#VFJBVkVMSU9fQlVZ#-1#9bb651ae-410b-4f4c#null#null#null#null#IN_AGREEMENT#null#3aa31d8a-3d18-4b67#28873975-ebbd-4989#3634c21e-e25a-4a2a#-1#228.00#PUBLIC#-1#ac1c7ee5-f53d-45fe#SELL#Ssq+7iwpUCZxZ/BmY/I66GMQk90='
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

    this.jupiterHotelPriceVerifyRq.Request.Rooms.push(room);
  }

  /**
   * Remove a room
   * @param index
   */
  removeRoom(index: number) {
    this.jupiterHotelPriceVerifyRq.Request.Rooms.splice(index, 1);
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

  /*
   * Execute Price Verify
  */

  priceVerify() {

    this.loading = true;

    this.jupiterApiService.hotelPriceVerify(this.jupiterHotelPriceVerifyRq).subscribe(response => {
      this.jupiterHotelPriceVerifyRs = response;
      this.daysCount = moment(this.jupiterHotelPriceVerifyRq.Request.ToDate).diff(moment(this.jupiterHotelPriceVerifyRq.Request.FromDate), 'days');
      console.log(response);
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      /*this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'hotelPriceVeirfy Error',
          error: error
        },
      });*/
    });
  }

}
