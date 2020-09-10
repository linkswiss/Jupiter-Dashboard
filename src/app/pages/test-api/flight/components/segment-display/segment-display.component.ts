import {Component, Input, OnInit} from '@angular/core';
import {BaseOperationPnr, FlightPaxFare, FlightSegment} from '../../../../../services/jupiter-api/jupiter-api-client';

@Component({
  selector: 'jupiter-segment-display',
  templateUrl: './segment-display.component.html',
  styleUrls: ['./segment-display.component.scss']
})
export class SegmentDisplayComponent implements OnInit {
  @Input() lastStepGroupId: string;
  @Input() showSegmentId = false;
  @Input() segIndex: number;
  @Input() segment: FlightSegment;
  @Input() paxFares: FlightPaxFare[];

  constructor() { }

  ngOnInit() {
  }

}
