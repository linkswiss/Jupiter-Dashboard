import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
  EH2HConnectorCode,
  EH2HOperation,
  EOperationStatus,
  EPaxType,
  IHGHotelCalendarAvailabilityInputCustomData,
  JupiterHotelCalendarAvailabilityInput,
  JupiterHotelCalendarAvailabilityRQ,
  JupiterHotelCalendarAvailabilityRS,
  PaxRequest,
  RoomRequest,
  SabreSynXisCalendarAvailabilityInputCustomData,
  SabreSynXisRoomRequestCustomData
} from '../../../../services/jupiter-api/jupiter-api-client';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';
import {AppConfigService} from '../../../../services/app-config/app-config.service';
import Utils from '../../../../utility/utils';
import {NbAccordionItemComponent, NbDialogService, NbRangepickerComponent, NbTooltipDirective} from '@nebular/theme';
import {DialogApiErrorComponent} from '../../common/components/dialog-api-error/dialog-api-error.component';
import dayGridPlugin from '@fullcalendar/daygrid';
import {Moment} from 'moment';

@Component({
  selector: 'jupiter-hotel-calendar-avail',
  templateUrl: './hotel-calendar-avail.component.html',
  styleUrls: ['./hotel-calendar-avail.component.scss']
})
export class HotelCalendarAvailComponent implements OnInit {
  @ViewChild('accordionItemRq', {static: true}) accordionItemRq: NbAccordionItemComponent;
  @ViewChild('rangePicker', {static: true}) rangePicker: NbRangepickerComponent<Moment>;

  calendarPlugins = [dayGridPlugin];
  calendarEvents = null;

  utils = Utils;
  loading = false;

  jupiterHotelCalendarAvailabilityRq: JupiterHotelCalendarAvailabilityRQ = null;
  jupiterHotelCalendarAvailabilityRs: JupiterHotelCalendarAvailabilityRS = null;

  ePaxType = EPaxType;
  ePaxTypeList: EPaxType[] = [EPaxType.ADULT, EPaxType.CHILD, EPaxType.INFANT];
  eH2HConnectorCode = EH2HConnectorCode;
  connectors: EH2HConnectorCode[] = null;

  constructor(private dialogService: NbDialogService, private jupiterApiService: JupiterApiService, public appConfigService: AppConfigService) {
  }

  ngOnInit() {
    // Get Connectors Enabled to operation
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.HOTEL_AVAIL_CALENDAR);

    let fromDate = moment().add(1, 'days');
    let toDate = moment().add(30, 'days');

    this.jupiterHotelCalendarAvailabilityRq = new JupiterHotelCalendarAvailabilityRQ({
      ForceNotCachedResponse: true,
      ConnectorsEnvironment: [],
      Request: new JupiterHotelCalendarAvailabilityInput({
        ConnectorsDebug: null,
        // ConnectorCode: EH2HConnectorCode.SABRE_SYNXIS,
        ConnectorCode: null,
        ConnectorCustomData: null,
        // FromDate: null,
        // ToDate: null,
        FromDate: fromDate.format('YYYY-MM-DD'),
        ToDate: toDate.format('YYYY-MM-DD'),
        Duration: 1,
        HotelRefId: '',
        PreferredCurrency: '',
        PreferredLanguage: '',
        Rooms: []
      })
    });

    // Add 1 room
    this.addRoom();

    // Additional Properties
    this.jupiterHotelCalendarAvailabilityRq.Request['_MinDate'] = moment();
    this.jupiterHotelCalendarAvailabilityRq.Request['_DateRange'] = {
      start: fromDate,
      end: toDate
    };

    // this.jupiterHotelCalendarAvailabilityRq.Request['_FromDateMoment'] = fromDate;
    // this.jupiterHotelCalendarAvailabilityRq.Request['_ToDateMoment'] = toDate;
  }

  /**
   * Format From and To Dates
   * @param $event
   */
  handleRangeChange($event) {
    if ($event.start) {
      this.jupiterHotelCalendarAvailabilityRq.Request.FromDate = moment($event.start).format('YYYY-MM-DD');
    }
    if ($event.end) {
      this.jupiterHotelCalendarAvailabilityRq.Request.ToDate = moment($event.end).format('YYYY-MM-DD');
    }

    // this.jupiterHotelCalendarAvailabilityRq.Request['_DateRange2'] = {
    //   start: moment($event.start).date(),
    //   end:  moment($event.end).date()
    // }
  }

  // /**
  //  * Format FromDate
  //  * @param $event
  //  */
  // handleFromDateChange($event) {
  //   this.jupiterHotelCalendarAvailabilityRq.Request.FromDate = moment($event).format('YYYY-MM-DD');
  // }
  //
  // /**
  //  * Format FromDate
  //  * @param $event
  //  */
  // handleToDateChange($event) {
  //   this.jupiterHotelCalendarAvailabilityRq.Request.ToDate = moment($event).format('YYYY-MM-DD');
  // }

  /**
   * Callback Changed the main Connector -> Add Custom data
   * @param connector
   */
  searchConnectorsChanged(connector: EH2HConnectorCode) {
    switch (connector) {
      case EH2HConnectorCode.SABRE_SYNXIS:
        // HotelRefIds: ['61667', '11206', '11113', '24684'],
        this.jupiterHotelCalendarAvailabilityRq.Request.HotelRefId = '11206';
        this.jupiterHotelCalendarAvailabilityRq.Request.ConnectorCustomData = new SabreSynXisCalendarAvailabilityInputCustomData({
          ChannelSubSourceCode: '',
          ExactMatchOnly: false,
          PromotionCodes: ['CMPMKT'],
          RatePlanCodeOrGroupCode: 'GRP1'
        });
        break;
      case EH2HConnectorCode.IHG_GRS:
        this.jupiterHotelCalendarAvailabilityRq.Request.HotelRefId = 'MILAS';
        // this.jupiterHotelCalendarAvailabilityRq.Request.HotelRefId = 'LAXHC';
        this.jupiterHotelCalendarAvailabilityRq.Request.ConnectorCustomData = new IHGHotelCalendarAvailabilityInputCustomData({
          RateCodes: ['IGCOR', 'IVANI'],
          Spanning: true,
          FilterRoomCode: '',
        });
        break;
    }
  }

  /**
   * Delete custom data
   */
  deleteCustomData() {
    this.jupiterHotelCalendarAvailabilityRq.Request.ConnectorCustomData = null;
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

    this.jupiterHotelCalendarAvailabilityRq.Request.Rooms.push(room);
  }

  /**
   * Remove a room
   * @param index
   */
  removeRoom(index: number) {
    this.jupiterHotelCalendarAvailabilityRq.Request.Rooms.splice(index, 1);
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

  renderEventDetails($event) {
    // $event.el.innerText = 'ASASASA';
    $event.el.innerHTML = `<div class="fc-content">
        <div class="fc-title font-size-small mb-1">${$event.event.title}</div>
        ${$event.event.extendedProps.description}
        </div>`;
  }

  processResponse() {
    if (this.jupiterHotelCalendarAvailabilityRs && this.jupiterHotelCalendarAvailabilityRs.Response && this.jupiterHotelCalendarAvailabilityRs.Response.DaysAvails && this.jupiterHotelCalendarAvailabilityRs.Response.DaysAvails.length > 0) {
      this.calendarEvents = [];

      for (let dayAvail of this.jupiterHotelCalendarAvailabilityRs.Response.DaysAvails) {

        let days = moment(dayAvail.ToDate).diff(moment(dayAvail.FromDate), 'days');
        // Add 1 day the ToDate is included
        days = days + 1;

        let eventColor = '#48D1CC';
        if (dayAvail.Close) {
          eventColor = '#DC143C';
        } else if (dayAvail.CloseOnArrival) {
          eventColor = '#FFA500';
        }

        let titlePrice = 'Price: Missing';
        if (dayAvail.Price) {
          titlePrice = `Price: ${dayAvail.Price.Currency ? dayAvail.Price.Currency : ''} ${dayAvail.Price.Amount}`;
        }

        for (let i = 0; i < days; i++) {
          let fromDate = moment(dayAvail.FromDate);
          this.calendarEvents.push({
            title: titlePrice,
            description: `<div class="font-size-small">RatePlanCode: ${dayAvail.RatePlanCode}</div>
                <div class="font-size-small">Close: ${dayAvail.Close}</div>
                <div class="font-size-small">CloseOnArrival: ${dayAvail.CloseOnArrival}</div>
                <div class="font-size-small">MinStay: ${dayAvail.MinStay ? dayAvail.MinStay : 'Missing'}</div>
                <div class="font-size-small">MaxStay: ${dayAvail.MaxStay ? dayAvail.MaxStay : 'Missing'}</div>`,
            date: fromDate.add(i, 'days').format('YYYY-MM-DD'),
            backgroundColor: eventColor,
            allDay: true
          });
        }

      }
    }
  }

  /**
   * Execute the Calendar Search
   */
  searchHotelsCalendar() {
    this.loading = true;
    this.calendarEvents = [];

    this.jupiterApiService.hotelCalendarAvailability(this.jupiterHotelCalendarAvailabilityRq).subscribe(response => {
      this.jupiterHotelCalendarAvailabilityRs = response;
      this.accordionItemRq.close();
      this.processResponse();
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'hotelCalendarAvailability Error',
          error: error
        },
      });
    });
  }
}
