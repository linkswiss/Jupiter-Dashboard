import {Component, Input, OnInit} from '@angular/core';
import {
  BaseRS,
  EH2HOperationStatus,
  EMessageType,
  EOperationStatus
} from '../../../../../services/jupiter-api/jupiter-api-client';

@Component({
  selector: 'jupiter-api-messages-accordion',
  templateUrl: './api-messages-accordion.component.html',
  styleUrls: ['./api-messages-accordion.component.scss']
})
export class ApiMessagesAccordionComponent implements OnInit {
  @Input() Title: string;
  @Input() ApiRs: BaseRS;

  EMessageType = EMessageType;
  EH2HOperationStatus = EH2HOperationStatus;
  EOperationStatus = EOperationStatus;

  constructor() {
  }

  ngOnInit() {
  }
}
