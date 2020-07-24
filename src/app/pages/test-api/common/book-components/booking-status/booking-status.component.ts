import {Component, Input, OnInit} from '@angular/core';
import {EBookingStatus} from '../../../../../services/jupiter-api/jupiter-api-client';

@Component({
  selector: 'jupiter-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.scss']
})
export class BookingStatusComponent implements OnInit {
  @Input() status: EBookingStatus;

  EBookingStatus = EBookingStatus;

  constructor() { }

  ngOnInit() {
  }

}
