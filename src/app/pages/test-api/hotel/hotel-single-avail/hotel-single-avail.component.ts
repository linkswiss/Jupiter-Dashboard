import {Component, OnInit, ViewChild} from '@angular/core';
import {NbAccordionItemComponent, NbDateService, NbDialogService} from '@nebular/theme';
import Utils from '../../../../utility/utils';
import {
  AicSingleHotelAvailabilityInputCustomData,
  AvailabilityInputCustomData,
  BookingDotComAvailabilityInputCustomData, BookingDotComSingleHotelAvailabilityInputCustomData, EAvailabilityType, EH2HConnectorCode,
  EH2HOperation, EPaxType, IHGAvailabilityInputCustomData,
  JupiterHotelAvailabilityInput,
  JupiterHotelAvailabilityRQ,
  JupiterHotelAvailabilityRS, JupiterSingleHotelAvailabilityInput, JupiterSingleHotelAvailabilityRQ, JupiterSingleHotelAvailabilityRS, PaxRequest, RoomRequest,
  SabreAvailabilityInputCustomData,
  SabreSynXisAvailabilityInputCustomData, SabreSynXisRoomRequestCustomData,
  SandalsAvailabilityInputCustomData,
  SingleHotelAvailResult
} from '../../../../services/jupiter-api/jupiter-api-client';
import {HotelPagesService} from '../../common/services/hotel-pages.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Moment} from 'moment';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';
import {AppConfigService} from '../../../../services/app-config/app-config.service';
import {DialogApiErrorComponent} from '../../common/components/dialog-api-error/dialog-api-error.component';

@Component({
  selector: 'jupiter-hotel-single-avail',
  templateUrl: './hotel-single-avail.component.html',
  styleUrls: ['./hotel-single-avail.component.scss']
})
export class HotelSingleAvailComponent implements OnInit {
  @ViewChild('accordionItemRq', {static: true}) accordionItemRq: NbAccordionItemComponent;

  utils = Utils;
  loading = false;

  jupiterSingleHotelAvailabilityRQ: JupiterSingleHotelAvailabilityRQ = null;
  jupiterSingleHotelAvailabilityRS: JupiterSingleHotelAvailabilityRS = null;

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
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.HOTEL_AVAIL_SINGLE);
    this.jupiterSingleHotelAvailabilityRQ = this.hotelPagesService.initJupiterSingleHotelAvailabilityRQ();
    this.jupiterSingleHotelAvailabilityRS = this.hotelPagesService.initJupiterSingleHotelAvailabilityRS();
    if (this.hotelPagesService.availSelectedModel) {
      this.searchSingleHotelAvailability();
    }
  }

  /**
   * Format From and To Dates
   * @param $event
   */
  handleRangeChange($event) {
    if ($event.start) {
      this.jupiterSingleHotelAvailabilityRQ.Request.FromDate = moment($event.start).format('YYYY-MM-DD');
    }
    if ($event.end) {
      this.jupiterSingleHotelAvailabilityRQ.Request.ToDate = moment($event.end).format('YYYY-MM-DD');
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
    this.jupiterSingleHotelAvailabilityRQ.Request.ConnectorsSearchOnly = value;

    for (let connector of value) {
      switch (connector) {
        case EH2HConnectorCode.BOOKING_DOT_COM:
          if (!_.some(this.jupiterSingleHotelAvailabilityRQ.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.BOOKING_DOT_COM;
          })) {
            this.jupiterSingleHotelAvailabilityRQ.Request.ConnectorsSettings.push(new BookingDotComSingleHotelAvailabilityInputCustomData({
              HotelRefId: '470860',
              AffiliateId: null
            }));
          }
          break;
        case EH2HConnectorCode.AIC:
          if (!_.some(this.jupiterSingleHotelAvailabilityRQ.Request.ConnectorsSettings, function (c: AvailabilityInputCustomData) {
            return c['_discriminator'] === EH2HConnectorCode.AIC;
          })) {
            this.jupiterSingleHotelAvailabilityRQ.Request.ConnectorsSettings.push(new AicSingleHotelAvailabilityInputCustomData({
              HotelRefId: '15905',
              Nationality: 'IT',
                AvailabilityTypes: [EAvailabilityType.AVAILONLY]
            }));
          }
          break;
      }
    }
  }

  /**
   * Delete custom data
   */
  deleteCustomData(index: number) {
    this.jupiterSingleHotelAvailabilityRQ.Request.ConnectorsSettings.splice(index, 1);
    this.jupiterSingleHotelAvailabilityRQ.Request.ConnectorsSearchOnly.splice(index, 1);
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
          RoomTypeCode: 'JRS'
        });
        break;
      // case EH2HConnectorCode.IHG_GRS:
      //   room.ConnectorCustomData = null;
      //   break;
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

    this.jupiterSingleHotelAvailabilityRQ.Request.Rooms.push(room);
  }

  /**
   * Remove a room
   * @param index
   */
  removeRoom(index: number) {
    this.jupiterSingleHotelAvailabilityRQ.Request.Rooms.splice(index, 1);
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
  searchSingleHotelAvailability() {
    this.loading = true;

    this.jupiterApiService.hotelSingleAvailability(this.jupiterSingleHotelAvailabilityRQ).subscribe(response => {
      this.jupiterSingleHotelAvailabilityRS = response;
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
