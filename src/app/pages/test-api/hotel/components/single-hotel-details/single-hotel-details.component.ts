import {Component, Input, OnInit} from '@angular/core';
import {HotelDetails, RoomRatePlan} from '../../../../../services/jupiter-api/jupiter-api-client';

@Component({
  selector: 'jupiter-single-hotel-details',
  templateUrl: './single-hotel-details.component.html',
  styleUrls: ['./single-hotel-details.component.scss']
})
export class SingleHotelDetailsComponent implements OnInit {
  @Input()hotel: HotelDetails = null;
  @Input()openDetails = false;
  // @Input()rate: RoomRatePlan = null;
  // @Input()showPricePerDay = false;
  // @Input()daysCount = 0;

  constructor() { }

  ngOnInit() {
  }

}
