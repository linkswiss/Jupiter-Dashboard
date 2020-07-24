import {Component, Input, OnInit} from '@angular/core';
import {PaxDetails, TravelCompany} from '../../../../../services/jupiter-api/jupiter-api-client';

@Component({
  selector: 'jupiter-travel-company',
  templateUrl: './travel-company.component.html',
  styleUrls: ['./travel-company.component.scss']
})
export class TravelCompanyComponent implements OnInit {
  @Input() travelCompany: TravelCompany;

  constructor() { }

  ngOnInit() {
  }

}
