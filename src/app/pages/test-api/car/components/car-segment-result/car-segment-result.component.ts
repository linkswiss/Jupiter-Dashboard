import {Component, Input, OnInit} from '@angular/core';
import {CarSegmentResult} from '../../../../../services/jupiter-api/jupiter-api-client';

@Component({
  selector: 'jupiter-car-segment-result',
  templateUrl: './car-segment-result.component.html',
  styleUrls: ['./car-segment-result.component.scss']
})
export class CarSegmentResultComponent implements OnInit {
  @Input()carSegment: CarSegmentResult = null;
  @Input()debug = false;
  @Input()openDetails = false;
  
  constructor() { }

  ngOnInit() {
  }

}
