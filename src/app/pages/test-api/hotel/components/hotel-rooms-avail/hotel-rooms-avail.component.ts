import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  EH2HConnectorCode,
  EBookingStatus,
  RoomRatePlan,
  SingleRoomResult
} from '../../../../../services/jupiter-api/jupiter-api-client';

@Component({
  selector: 'jupiter-hotel-rooms-avail',
  templateUrl: './hotel-rooms-avail.component.html',
  styleUrls: ['./hotel-rooms-avail.component.scss']
})
export class HotelRoomsAvailComponent implements OnInit {
  @Input()rooms: SingleRoomResult[] = null;
  @Input()showPricePerDay = false;
  @Input()daysCount = 0;

  @Output() ratePriceVerify = new EventEmitter<any>();


  EBookingStatus = EBookingStatus;

  constructor() { }

  ngOnInit() {
  }

  priceVerify(rate: RoomRatePlan, connectorCode: EH2HConnectorCode){
    this.ratePriceVerify.emit({currentRate: rate, connectorCode: connectorCode});
  }
}
