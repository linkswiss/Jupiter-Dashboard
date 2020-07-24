import {Component, Input, OnInit} from '@angular/core';
import {EOperationStatus} from '../../../../../services/jupiter-api/jupiter-api-client';

@Component({
  selector: 'jupiter-api-response-status',
  templateUrl: './api-response-status.component.html',
  styleUrls: ['./api-response-status.component.scss']
})
export class ApiResponseStatusComponent implements OnInit {
  @Input() status: EOperationStatus;

  eOperationStatus = EOperationStatus;

  constructor() { }

  ngOnInit() {
  }

}
