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
  EH2HOperation,
  AvailabilityInputCustomData,
  SabreSynXisAvailabilityInputCustomData,
  BookingDotComAvailabilityInputCustomData,
  SabreAvailabilityInputCustomData,
  SandalsAvailabilityInputCustomData,
  IHGAvailabilityInputCustomData,
  JupiterHotelDetailRQ, JupiterHotelDetailRS
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

  jupiterHotelPriceVerifyRq: JupiterHotelPriceVerifyRQ = null;
  jupiterHotelPriceVerifyRs: JupiterHotelPriceVerifyRS = null;

  EH2HConnectorCode = EH2HConnectorCode;
  connectors: EH2HConnectorCode[] = null;

  constructor(
    private hotelPagesService: HotelPagesService,
    private dialogService: NbDialogService,
    protected dateService: NbDateService<Moment>,
    private jupiterApiService: JupiterApiService,
    public appConfigService: AppConfigService
  ) {
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

  searchConnectorsChanged(value: EH2HConnectorCode[]) {
    this.jupiterHotelPriceVerifyRq.Request.ConnectorsSearchOnly = value;

    for (let connector of value) {
      switch (connector) {
        // case EH2HConnectorCode.SABRE_SYNXIS:
        //   if (!_.some(this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
        //     return c['_discriminator'] === EH2HConnectorCode.SABRE_SYNXIS;
        //   })) {
        //     // SABRE_SYNXIS with some test data
        //     let customData = new SabreSynXisAvailabilityInputCustomData({
        //       DestinationRefIds: [],
        //       HotelRefIds: [
        //         '11206', // TEST
        //         '11113', // TEST
        //         '61667', // SixSenses YaoNoi
        //         '24684', // DHO LIVE
        //         '60176', // DHO Live Test Hotel
        //       ],
        //       ChannelSubSourceCode: '',
        //       ExactMatchOnly: false,
        //       PromotionCodes: ['CMPMKT'],
        //       RatePlanCodeOrGroupCode: 'GRP1',
        //       RatePlanType: '',
        //     });
        //
        //     customData['_CustomDataInputSettings'] = new CustomDataInputSettings({
        //       dateProps: [],
        //       numProps: [],
        //       tagProps: ['HotelRefIds', 'DestinationRefIds'],
        //       enumProps: ['RetrieveMode'],
        //       boolProps: ['ExactMatchOnly'],
        //       objProps: [],
        //       objArrayProps: [],
        //       omitProps: [],
        //       enums: null
        //     });
        //
        //     this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings.push(customData);
        //   }
        //   break;
        // case EH2HConnectorCode.BOOKING_DOT_COM:
        //   if (!_.some(this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
        //     return c['_discriminator'] === EH2HConnectorCode.BOOKING_DOT_COM;
        //   })) {
        //     let customData = new BookingDotComAvailabilityInputCustomData({
        //       DestinationRefIds: ['-121726'],
        //       HotelRefIds: ['470860'],
        //       NoDorms: true,
        //       AffiliateId: null,
        //       Rows: 10
        //       // Add others properties
        //     });
        //
        //     this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings.push(customData);
        //   }
        //   break;
        // case EH2HConnectorCode.SABRE:
        //   if (!_.some(this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
        //     return c['_discriminator'] === EH2HConnectorCode.SABRE;
        //   })) {
        //     this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings.push(new SabreAvailabilityInputCustomData({
        //       DestinationRefIds: [''],
        //       HotelRefIds: [],
        //       // Add others properties
        //     }));
        //   }
        //   break;
        // case EH2HConnectorCode.SANDALS:
        //   if (!_.some(this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
        //     return c['_discriminator'] === EH2HConnectorCode.SANDALS;
        //   })) {
        //     this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings.push(new SandalsAvailabilityInputCustomData({
        //       DestinationRefIds: ['NAS'],
        //       HotelRefIds: ['SRB'],
        //       // Add others properties
        //     }));
        //   }
        //   break;
        // case EH2HConnectorCode.IHG_GRS:
        //   if (!_.some(this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
        //     return c['_discriminator'] === EH2HConnectorCode.IHG_GRS;
        //   })) {
        //     this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings.push(new IHGAvailabilityInputCustomData({
        //       // DestinationRefIds: ['NAS'],
        //       HotelRefIds: ['SINDX', 'SINMW', 'MILAS', 'LAXHC'],
        //       GroupCode: null,
        //       IhgAgentToken: '',
        //       IhgPos: '',
        //       IhgSessionId: '',
        //       IhgSsoToken: '',
        //       LoyaltyId: '',
        //       InternalRatePlanCodes: ['IGCOR', 'IVANI'],
        //       ExternalRatePlanCodes: [],
        //
        //       // Add others properties
        //     }));
        //   }
        //   break;
        case EH2HConnectorCode.CREOLE:
          if (!_.some(this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.CREOLE;
          })) {
            this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings.push(new CreoleHotelAvailabilityInputCustomData({
              DestinationRefIds: [''],
              HotelRefIds: ['JP046300', 'JP150074', 'JP046391'],
              CountryOfResidence: 'it'
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
    this.jupiterHotelPriceVerifyRq.Request.ConnectorsSettings.splice(index, 1);
    // this.jupiterHotelAvailabilityRq.Request.ConnectorsSearchOnly.splice(index, 1);
  }

  /*
   * Execute Price Verify

  priceVerify(hotel: SingleHotelAvailResult, room: RoomDetails, rate: RoomRatePlan) {

    let jupiterHotelPriceVerifyRQ = new JupiterHotelPriceVerifyRQ({
      Request: new JupiterHotelPriceVerifyInput({
        FromDate: this.jupiterHotelPriceVerifyRq.Request.FromDate,
        ToDate: this.jupiterHotelPriceVerifyRq.Request.ToDate,
        Rooms: [ new RoomRequest()],
        ConnectorsSettings: [],
        PreferredLanguage: 'en',
        PreferredCurrency: 'EUR'
      })
    });

    switch (room.ConnectorMatch.ConnectorCode) {
      case EH2HConnectorCode.CREOLE:
        jupiterHotelPriceVerifyRQ.Request.ConnectorsSearchOnly = [
          EH2HConnectorCode.CREOLE
        ];
        jupiterHotelPriceVerifyRQ.Request.ConnectorsSettings.push(
          new CreoleHotelAvailabilityInputCustomData({
            RatePlanCode: rate.RatePlanCode,
            HotelCode: hotel.ConnectorsMatch[0].RefId
          })
        );
        break;
    }

    this.jupiterApiService.hotelPriceVerify(jupiterHotelPriceVerifyRQ).subscribe(response => {

      console.log(response);

      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
    });
  }
     */


}
