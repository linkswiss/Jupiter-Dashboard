import {Component, Input, OnInit} from '@angular/core';
import {FareRule, FlightPaxFare, FlightSegment} from "../../../../../services/jupiter-api/jupiter-api-client";

@Component({
  selector: 'jupiter-fare-display',
  templateUrl: './fare-display.component.html',
  styleUrls: ['./fare-display.component.scss']
})
export class FareDisplayComponent implements OnInit {
  @Input() paxFareIndex: number;
  @Input() fare: FlightPaxFare;
  @Input() fareRules: FareRule[];

  constructor() { }

  ngOnInit() {
  }

}
