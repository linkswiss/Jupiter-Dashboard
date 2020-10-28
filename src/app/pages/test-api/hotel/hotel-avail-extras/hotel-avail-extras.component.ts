import {Component, OnInit, ViewChild} from '@angular/core';
import {NbAccordionItemComponent, NbDateService, NbDialogService} from '@nebular/theme';
import Utils from '../../../../utility/utils';
import {
  EH2HConnectorCode,
  EH2HOperation,
  EPaxType, IHGRoomRequestCustomData,
  JupiterHotelAvailabilityExtrasInput,
  JupiterHotelAvailabilityExtrasRQ,
  JupiterHotelAvailabilityExtrasRS,
  JupiterHotelAvailabilityInput,
  JupiterHotelAvailabilityRQ,
  JupiterHotelDetailRQ,
  JupiterHotelDetailRS, OkkamiExtraAvailCustomData, OkkamiRoomRequestCustomData,
  PaxRequest,
  RoomRequest, SabreSynXisAvailabilityExtrasInputCustomData, SabreSynXisRoomRequestCustomData,
  SingleHotelAvailResult
} from '../../../../services/jupiter-api/jupiter-api-client';
import {HotelPagesService} from '../../common/services/hotel-pages.service';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';
import {AppConfigService} from '../../../../services/app-config/app-config.service';
import {DialogApiErrorComponent} from '../../common/components/dialog-api-error/dialog-api-error.component';

import * as _ from 'lodash';
import * as moment from 'moment';
import {Moment} from 'moment';

@Component({
  selector: 'jupiter-hotel-avail-extras',
  templateUrl: './hotel-avail-extras.component.html',
  styleUrls: ['./hotel-avail-extras.component.scss']
})
export class HotelAvailExtrasComponent implements OnInit {
  @ViewChild('accordionItemRq', {static: true}) accordionItemRq: NbAccordionItemComponent;

  utils = Utils;
  loading = false;

  jupiterHotelAvailabilityExtrasRQ: JupiterHotelAvailabilityExtrasRQ = null;
  jupiterHotelAvailabilityExtrasRS: JupiterHotelAvailabilityExtrasRS = null;

  EPaxType = EPaxType;
  EPaxTypeList = Object.keys(EPaxType);
  EH2HConnectorCode = EH2HConnectorCode;
  connectors: EH2HConnectorCode[] = null;

  constructor(private hotelPagesService: HotelPagesService, private dialogService: NbDialogService, protected dateService: NbDateService<Moment>, private jupiterApiService: JupiterApiService, public appConfigService: AppConfigService) {
  }

  ngOnInit() {
    // Get Connectors Enabled to operation
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.HOTEL_AVAIL_EXTRAS);

    let fromDate = moment().add(1, 'days');
    let toDate = moment().add(5, 'days');

    this.jupiterHotelAvailabilityExtrasRQ = new JupiterHotelAvailabilityExtrasRQ({
      ForceNotCachedResponse: true,
      ConnectorsEnvironment: [],
      Request: new JupiterHotelAvailabilityExtrasInput({
        ConnectorsDebug: [],
        ConnectorCode: null,
        HotelRefId: null,
        ConnectorCustomData: null,
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
    this.jupiterHotelAvailabilityExtrasRQ.Request['_MinDate'] = moment();
    this.jupiterHotelAvailabilityExtrasRQ.Request['_DateRange'] = {
      start: fromDate,
      end: toDate
    };

    // this.jupiterHotelAvailabilityExtrasRQ = this.hotelPagesService.initJupiterHotelDetailRQ();
    // this.jupiterHotelAvailabilityExtrasRS = this.hotelPagesService.initJupiterHotelDetailRS();
    // if (this.hotelPagesService.availSelectedModel) {
    //   this.doHotelDetails();
    // }
  }

  /**
   * Format From and To Dates
   * @param $event
   */
  handleRangeChange($event) {
    if ($event.start) {
      this.jupiterHotelAvailabilityExtrasRQ.Request.FromDate = moment($event.start).format('YYYY-MM-DD');
    }
    if ($event.end) {
      this.jupiterHotelAvailabilityExtrasRQ.Request.ToDate = moment($event.end).format('YYYY-MM-DD');
    }
  }

  /**
   * Callback Changed the main Connector -> Add Custom data
   * @param connector
   */
  handleConnectorsChanged(connector: EH2HConnectorCode) {
    switch (connector) {
      case EH2HConnectorCode.SABRE_SYNXIS:
        this.jupiterHotelAvailabilityExtrasRQ.Request.HotelRefId = '61667';
        // ['61667', '11206', '11113', '24684'];
        this.jupiterHotelAvailabilityExtrasRQ.Request.ConnectorCustomData = new SabreSynXisAvailabilityExtrasInputCustomData({
          RatePlanCode: '',
          ChannelSubSourceCode: ''
        });
        break;
      case EH2HConnectorCode.IHG_GRS:
        this.jupiterHotelAvailabilityExtrasRQ.Request.HotelRefId = 'SINDX';
        // ['SINDX', 'SINMW', 'MILAS', 'LAXHC'];

        break;
      case EH2HConnectorCode.OKKAMI:
        this.jupiterHotelAvailabilityExtrasRQ.Request.HotelRefId = '000-000-0019';
        // [
        // '000-000-0019', //Yao Noi
        // '000-000-0055',
        // '000-000-0054' //Maxwell
        // ];

        break;
    }
  }

  /**
   * Delete custom data
   */
  deleteCustomData() {
    this.jupiterHotelAvailabilityExtrasRQ.Request.ConnectorCustomData = null;
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
      case EH2HConnectorCode.OKKAMI:
        room.ConnectorCustomData = new OkkamiRoomRequestCustomData({
          RoomTypeCode: 'YUH'
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

    this.jupiterHotelAvailabilityExtrasRQ.Request.Rooms.push(room);
  }

  /**
   * Remove a room
   * @param index
   */
  removeRoom(index: number) {
    this.jupiterHotelAvailabilityExtrasRQ.Request.Rooms.splice(index, 1);
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
  doHotelAvailabilityExtras() {
    this.loading = true;

    this.jupiterApiService.hotelExtrasAvailability(this.jupiterHotelAvailabilityExtrasRQ).subscribe(response => {
      this.jupiterHotelAvailabilityExtrasRS = response;
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
