import {Component, Input, OnInit} from '@angular/core';
import {CreditCardInfo, PaxDetails} from '../../../../../services/jupiter-api/jupiter-api-client';

@Component({
  selector: 'jupiter-pax-list-details',
  templateUrl: './pax-list-details.component.html',
  styleUrls: ['./pax-list-details.component.scss']
})
export class PaxListDetailsComponent implements OnInit {
  @Input() paxes: PaxDetails[];

  constructor() { }

  ngOnInit() {
  }

}
