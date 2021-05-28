import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {
  AvailabilityInputCustomData, BookingDotComAvailabilityInputCustomData, BookingDotComSingleHotelAvailabilityInputCustomData,
  EH2HConnectorCode,
  EPaxType, JupiterHotelAvailabilityInput,
  JupiterHotelAvailabilityRQ,
  JupiterHotelAvailabilityRS, JupiterHotelDetailInput, JupiterHotelDetailRQ, JupiterHotelDetailRS,
  JupiterHotelPriceVerifyInput,
  JupiterHotelPriceVerifyRQ,
  JupiterHotelPriceVerifyRS,
  JupiterSingleHotelAvailabilityInput,
  JupiterSingleHotelAvailabilityRQ, JupiterSingleHotelAvailabilityRS,
  PaxRequest, RoomDetails, RoomRatePlan,
  RoomRequest, SabreSynXisAvailabilityInputCustomData,
  SabreSynXisSingleHotelAvailabilityInputCustomData,
  SingleHotelAvailResult
} from '../../../../services/jupiter-api/jupiter-api-client';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class HotelPagesService {

  private previousUrl: string = undefined;
  private currentUrl: string = undefined;
  availSelectedModel: HotelAvailSelectedModel = null;
  private loadFormService = false;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  /**
   * Empty Service Models
   */
  emptyServiceModels() {
    this.availSelectedModel = null;
  }

  navigateFromHotelAvailToPriceVerify(jupiterHotelAvailabilityRq: JupiterHotelAvailabilityRQ, jupiterHotelAvailabilityRs: JupiterHotelAvailabilityRS, selectedHotel: SingleHotelAvailResult, selectedRate: RoomRatePlan, connectorCode: EH2HConnectorCode) {
    this.availSelectedModel = new HotelAvailSelectedModel({
      jupiterHotelAvailabilityRq: jupiterHotelAvailabilityRq,
      jupiterHotelAvailabilityRs: jupiterHotelAvailabilityRs,
      selectedHotel: selectedHotel,
      connectorCode: connectorCode,
      selectedRate: selectedRate
    });

    this.loadFormService = true;
    this.router.navigate(['/hotel-price-verify']);
  }

  /**
   * Save model and Navigate form HotelAvail to HotelSingleAvail
   */
  navigateFormHotelAvailToHotelSingleAvail(jupiterHotelAvailabilityRq: JupiterHotelAvailabilityRQ, jupiterHotelAvailabilityRs: JupiterHotelAvailabilityRS, selectedHotel: SingleHotelAvailResult, connectorCode: EH2HConnectorCode) {
    this.availSelectedModel = new HotelAvailSelectedModel({
      jupiterHotelAvailabilityRq: jupiterHotelAvailabilityRq,
      jupiterHotelAvailabilityRs: jupiterHotelAvailabilityRs,
      selectedHotel: selectedHotel,
      connectorCode: connectorCode,
      selectedRate: null
    });

    this.loadFormService = true;
    this.router.navigate(['/hotel-single-avail']);
  }

  /**
   * Save model and Navigate form HotelAvail to HotelSingleAvail
   */
  navigateFormHotelAvailToHotelDetail(jupiterHotelAvailabilityRq: JupiterHotelAvailabilityRQ, jupiterHotelAvailabilityRs: JupiterHotelAvailabilityRS, selectedHotel: SingleHotelAvailResult, connectorCode: EH2HConnectorCode) {
    this.availSelectedModel = new HotelAvailSelectedModel({
      jupiterHotelAvailabilityRq: jupiterHotelAvailabilityRq,
      jupiterHotelAvailabilityRs: jupiterHotelAvailabilityRs,
      selectedHotel: selectedHotel,
      connectorCode: connectorCode,
      selectedRate: null
    });

    this.loadFormService = true;
    this.router.navigate(['/hotel-detail']);
  }

  /**
   * Init JupiterHotelAvailabilityRQ
   */
  initJupiterHotelAvailabilityRQ(): JupiterHotelAvailabilityRQ {
    let jupiterHotelAvailabilityRQ: JupiterHotelAvailabilityRQ = null;

    if (this.availSelectedModel && this.loadFormService) {
      // REQUEST MODEL FOM AVAIL
      jupiterHotelAvailabilityRQ = this.availSelectedModel.jupiterHotelAvailabilityRq;
    } else {
      // BASE REQUEST MODEL

      // Empty the Service Model
      this.emptyServiceModels();

      let fromDate = moment().add(1, 'days');
      let toDate = moment().add(5, 'days');

      jupiterHotelAvailabilityRQ = new JupiterHotelAvailabilityRQ({
        ForceNotCachedResponse: true,
        ConnectorsEnvironment: [],
        Request: new JupiterHotelAvailabilityInput({
          ConnectorsDebug: [],
          // ConnectorCode: EH2HConnectorCode.SABRE_SYNXIS,
          ConnectorsSearchOnly: [],
          ConnectorsSettings: [],
          // FromDate: null,
          // ToDate: null,
          FromDate: fromDate.format('YYYY-MM-DD'),
          ToDate: toDate.format('YYYY-MM-DD'),
          PreferredCurrency: '',
          PreferredLanguage: '',
          Rooms: [
            new RoomRequest({
              Paxes: [
                new PaxRequest({
                  Type: EPaxType.ADULT
                }),
                new PaxRequest({
                  Type: EPaxType.ADULT
                })
              ],
              ConnectorCustomData: null,
            })
          ]
        })
      });

      // Additional Properties
      jupiterHotelAvailabilityRQ.Request['_MinDate'] = moment();
      jupiterHotelAvailabilityRQ.Request['_DateRange'] = {
        start: fromDate,
        end: toDate
      };
    }

    return jupiterHotelAvailabilityRQ;
  }

  /**
   * Init JupiterHotelAvailabilityRS
   */
  initJupiterHotelAvailabilityRS(): JupiterHotelAvailabilityRS {
    let jupiterHotelAvailabilityRS: JupiterHotelAvailabilityRS = null;

    if (this.availSelectedModel && this.loadFormService) {
      // REQUEST MODEL FOM AVAIL
      jupiterHotelAvailabilityRS = this.availSelectedModel.jupiterHotelAvailabilityRs;
    } else {
      // Empty the Service Model
      this.emptyServiceModels();
    }
    return jupiterHotelAvailabilityRS;
  }

  /**
   * Init JupiterSingleHotelAvailabilityRQ
   */
  initJupiterSingleHotelAvailabilityRQ(): JupiterSingleHotelAvailabilityRQ {
    let jupiterSingleHotelAvailabilityRQ: JupiterSingleHotelAvailabilityRQ = null;

    if (this.availSelectedModel && this.loadFormService) {
      // REQUEST MODEL FOM AVAIL
      let fromDate = moment(this.availSelectedModel.jupiterHotelAvailabilityRq.Request.FromDate);
      let toDate = moment(this.availSelectedModel.jupiterHotelAvailabilityRq.Request.ToDate);

      jupiterSingleHotelAvailabilityRQ = new JupiterSingleHotelAvailabilityRQ({
        ForceNotCachedResponse: this.availSelectedModel.jupiterHotelAvailabilityRq.ForceNotCachedResponse,
        ConnectorsEnvironment: this.availSelectedModel.jupiterHotelAvailabilityRq.ConnectorsEnvironment,
        Request: new JupiterSingleHotelAvailabilityInput({
          ConnectorsDebug: this.availSelectedModel.jupiterHotelAvailabilityRq.Request.ConnectorsDebug,
          ConnectorsSearchOnly: this.availSelectedModel.jupiterHotelAvailabilityRq.Request.ConnectorsSearchOnly,
          ConnectorsSettings: [],
          FromDate: fromDate.format('YYYY-MM-DD'),
          ToDate: toDate.format('YYYY-MM-DD'),
          PreferredCurrency: this.availSelectedModel.jupiterHotelAvailabilityRq.Request.PreferredCurrency,
          PreferredLanguage: this.availSelectedModel.jupiterHotelAvailabilityRq.Request.PreferredLanguage,
          Rooms: this.availSelectedModel.jupiterHotelAvailabilityRq.Request.Rooms
        })
      });

      // ConnectorsSettings based on selected Hotel
      switch (this.availSelectedModel.connectorCode) {
        case EH2HConnectorCode.SABRE_SYNXIS:
          let sabreSynXisAvailCustomData: SabreSynXisAvailabilityInputCustomData = _.find(this.availSelectedModel.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, (c: AvailabilityInputCustomData) => {
            return c['_discriminator'] === EH2HConnectorCode.SABRE_SYNXIS;
          });

          let sabreSynXisCustomData = new SabreSynXisSingleHotelAvailabilityInputCustomData({
            HotelRefId: this.availSelectedModel.selectedHotel.ConnectorsMatch[0].RefId,
            ChannelSubSourceCode: sabreSynXisAvailCustomData.ChannelSubSourceCode,
            PromotionCode: sabreSynXisAvailCustomData.PromotionCodes[0],
            RatePlanCodeOrGroupCode: sabreSynXisAvailCustomData.RatePlanCodeOrGroupCode
          });

          jupiterSingleHotelAvailabilityRQ.Request.ConnectorsSettings.push(sabreSynXisCustomData);
          break;
        case EH2HConnectorCode.BOOKING_DOT_COM:
          let bookingAvailCustomData: BookingDotComAvailabilityInputCustomData = _.find(this.availSelectedModel.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, (c: AvailabilityInputCustomData) => {
            return c['_discriminator'] === EH2HConnectorCode.BOOKING_DOT_COM;
          });

          let bookingCustomData = new BookingDotComSingleHotelAvailabilityInputCustomData({
            HotelRefId: this.availSelectedModel.selectedHotel.ConnectorsMatch[0].RefId,
            AffiliateId: bookingAvailCustomData.AffiliateId,
          });

          jupiterSingleHotelAvailabilityRQ.Request.ConnectorsSettings.push(bookingCustomData);
          break;
      }

      // Additional Properties
      jupiterSingleHotelAvailabilityRQ.Request['_MinDate'] = moment();
      jupiterSingleHotelAvailabilityRQ.Request['_DateRange'] = {
        start: fromDate,
        end: toDate
      };
    } else {
      // BASE REQUEST MODEL

      // Empty the Service Model
      this.emptyServiceModels();

      let fromDate = moment().add(1, 'days');
      let toDate = moment().add(5, 'days');

      jupiterSingleHotelAvailabilityRQ = new JupiterSingleHotelAvailabilityRQ({
        ForceNotCachedResponse: true,
        ConnectorsEnvironment: [],
        Request: new JupiterSingleHotelAvailabilityInput({
          ConnectorsDebug: [],
          // ConnectorCode: EH2HConnectorCode.SABRE_SYNXIS,
          ConnectorsSearchOnly: [],
          ConnectorsSettings: [],
          // FromDate: null,
          // ToDate: null,
          FromDate: fromDate.format('YYYY-MM-DD'),
          ToDate: toDate.format('YYYY-MM-DD'),
          PreferredCurrency: '',
          PreferredLanguage: '',
          Rooms: [
            new RoomRequest({
              Paxes: [
                new PaxRequest({
                  Type: EPaxType.ADULT
                }),
                new PaxRequest({
                  Type: EPaxType.ADULT
                })
              ],
              ConnectorCustomData: null,
            })
          ]
        })
      });

      // Additional Properties
      jupiterSingleHotelAvailabilityRQ.Request['_MinDate'] = moment();
      jupiterSingleHotelAvailabilityRQ.Request['_DateRange'] = {
        start: fromDate,
        end: toDate
      };
    }

    return jupiterSingleHotelAvailabilityRQ;
  }

  /**
   * Init JupiterSingleHotelAvailabilityRS
   */
  initJupiterSingleHotelAvailabilityRS(): JupiterSingleHotelAvailabilityRS {
    if (this.loadFormService) {

    } else {
      // Empty the Service Model
      this.emptyServiceModels();
    }
    return null;
  }

/**
 * Init JupiterHotelPriceVerifyRQ
 */
initJupiterHotelPriceVerifyRQ(): JupiterHotelPriceVerifyRQ {
  let jupiterHotelPriceVerifyRQ: JupiterHotelPriceVerifyRQ = null;
  
  // Empty the Service Model
  this.emptyServiceModels();

  let fromDate = moment().add(1, 'days');
  let toDate = moment().add(5, 'days');

  jupiterHotelPriceVerifyRQ = new JupiterHotelPriceVerifyRQ({
    ConnectorsEnvironment: [],
    Request: new JupiterHotelPriceVerifyInput({
      ConnectorsDebug: [],
      // ConnectorCode: EH2HConnectorCode.SABRE_SYNXIS,
      ConnectorsSearchOnly: [],
      ConnectorsSettings: [],
      // FromDate: null,
      // ToDate: null,
      FromDate: fromDate.format('YYYY-MM-DD'),
      ToDate: toDate.format('YYYY-MM-DD'),
      PreferredCurrency: '',
      PreferredLanguage: '',
      Rooms: [
        new RoomRequest({
          Paxes: [
            new PaxRequest({
              Type: EPaxType.ADULT
            }),
            new PaxRequest({
              Type: EPaxType.ADULT
            })
          ],
          ConnectorCustomData: null,
        })
      ]
    })
  });

  // Additional Properties
  jupiterHotelPriceVerifyRQ.Request['_MinDate'] = moment();
  jupiterHotelPriceVerifyRQ.Request['_DateRange'] = {
    start: fromDate,
    end: toDate
  };
  
  return jupiterHotelPriceVerifyRQ;
}

/**
 * Init JupiterHotelPriceVerifyRS
 */
initJupiterHotelPriceVerifyRS(): JupiterHotelPriceVerifyRS {
  let jupiterHotelHotelPriceVerifyRS: JupiterHotelPriceVerifyRS = null;

  // Empty the Service Model
  this.emptyServiceModels();
  
  return jupiterHotelHotelPriceVerifyRS;
}

  /**
   * Init JupiterHotelDetailRQ
   */
  initJupiterHotelDetailRQ(): JupiterHotelDetailRQ {
    let jupiterHotelDetailRQ: JupiterHotelDetailRQ = null;

    if (this.availSelectedModel && this.loadFormService) {
      // REQUEST MODEL FOM AVAIL
      let fromDate = moment(this.availSelectedModel.jupiterHotelAvailabilityRq.Request.FromDate);
      let toDate = moment(this.availSelectedModel.jupiterHotelAvailabilityRq.Request.ToDate);

      jupiterHotelDetailRQ = new JupiterHotelDetailRQ({
        ForceNotCachedResponse: this.availSelectedModel.jupiterHotelAvailabilityRq.ForceNotCachedResponse,
        ConnectorsEnvironment: this.availSelectedModel.jupiterHotelAvailabilityRq.ConnectorsEnvironment,
        Request: new JupiterHotelDetailInput({
          ConnectorsDebug: this.availSelectedModel.jupiterHotelAvailabilityRq.Request.ConnectorsDebug,
          ConnectorCode: this.availSelectedModel.connectorCode,
          ConnectorCustomData: null,
          HotelRefIds: [this.availSelectedModel.selectedHotel.ConnectorsMatch[0].RefId],
          DestinationRefIds: [],
          PreferredLanguage: '',
          PreferredCurrency: ''
        })
      });

      // ConnectorsSettings based on selected Hotel
      // switch (this.availSelectedModel.connectorCode) {
      //   case EH2HConnectorCode.SABRE_SYNXIS:
      //     let sabreSynXisAvailCustomData: SabreSynXisAvailabilityInputCustomData = _.find(this.availSelectedModel.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, (c: AvailabilityInputCustomData) => {
      //       return c['_discriminator'] === EH2HConnectorCode.SABRE_SYNXIS;
      //     });
      //
      //     let sabreSynXisCustomData = new SabreSynXisSingleHotelAvailabilityInputCustomData({
      //       HotelRefId: this.availSelectedModel.selectedHotel.ConnectorsMatch[0].RefId,
      //       ChannelSubSourceCode: sabreSynXisAvailCustomData.ChannelSubSourceCode,
      //       PromotionCode: sabreSynXisAvailCustomData.PromotionCodes[0],
      //       RatePlanCodeOrGroupCode: sabreSynXisAvailCustomData.RatePlanCodeOrGroupCode
      //     });
      //
      //     jupiterSingleHotelAvailabilityRQ.Request.ConnectorsSettings.push(sabreSynXisCustomData);
      //     break;
      //   case EH2HConnectorCode.BOOKING_DOT_COM:
      //     let bookingAvailCustomData: BookingDotComAvailabilityInputCustomData = _.find(this.availSelectedModel.jupiterHotelAvailabilityRq.Request.ConnectorsSettings, (c: AvailabilityInputCustomData) => {
      //       return c['_discriminator'] === EH2HConnectorCode.BOOKING_DOT_COM;
      //     });
      //
      //     let bookingCustomData = new BookingDotComSingleHotelAvailabilityInputCustomData({
      //       HotelRefId: this.availSelectedModel.selectedHotel.ConnectorsMatch[0].RefId,
      //       AffiliateId: bookingAvailCustomData.AffiliateId,
      //     });
      //
      //     jupiterSingleHotelAvailabilityRQ.Request.ConnectorsSettings.push(bookingCustomData);
      //     break;
      // }

    } else {
      // BASE REQUEST MODEL

      // Empty the Service Model
      this.emptyServiceModels();

      jupiterHotelDetailRQ = new JupiterHotelDetailRQ({
        ForceNotCachedResponse: true,
        ConnectorsEnvironment: [],
        Request: new JupiterHotelDetailInput({
          ConnectorsDebug: [],
          ConnectorCode: null,
          ConnectorCustomData: null,
          HotelRefIds: [],
          DestinationRefIds: [],
        })
      });
    }

    return jupiterHotelDetailRQ;
  }

  /**
   * Init JupiterSingleHotelAvailabilityRS
   */
  initJupiterHotelDetailRS(): JupiterHotelDetailRS {
    if (this.loadFormService) {

    } else {
      // Empty the Service Model
      this.emptyServiceModels();
    }
    return null;
  }
}

/**
 * Hotel Avail to SingleAvailModel -> all models needed form Avail to Single Hotel Avail
 */
export class HotelAvailSelectedModel {
  jupiterHotelAvailabilityRq: JupiterHotelAvailabilityRQ = null;
  jupiterHotelAvailabilityRs: JupiterHotelAvailabilityRS = null;
  selectedHotel: SingleHotelAvailResult = null;
  selectedRate: RoomRatePlan = null;
  connectorCode: EH2HConnectorCode;

  constructor(data: HotelAvailSelectedModel) {
    if (data) {
      for (let property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }
}
