import {Component, Input, OnInit} from '@angular/core';
import {BaseOperationPnr} from '../../../../../services/jupiter-api/jupiter-api-client';

@Component({
  selector: 'jupiter-flight-pnr-display',
  templateUrl: './flight-pnr-display.component.html',
  styleUrls: ['./flight-pnr-display.component.scss']
})
export class FlightPnrDisplayComponent implements OnInit {
  @Input() currentPnr: BaseOperationPnr;

  isDebug = false;

  constructor() { }

  ngOnInit() {
  }

  getJson(object): string {
    return JSON.stringify(object, null, 2);
  }
}
