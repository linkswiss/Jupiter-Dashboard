import {Component, Input, OnInit} from '@angular/core';
import {RoomDetails} from '../../../../../services/jupiter-api/jupiter-api-client';

@Component({
  selector: 'jupiter-single-room-details',
  templateUrl: './single-room-details.component.html',
  styleUrls: ['./single-room-details.component.scss']
})
export class SingleRoomDetailsComponent implements OnInit {
  @Input()room: RoomDetails = null;
  @Input()openDetails = false;

  constructor() { }

  ngOnInit() {
  }

}
