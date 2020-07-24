import {Component, Input, OnInit} from '@angular/core';
import {CreditCardInfo} from '../../../../../services/jupiter-api/jupiter-api-client';

@Component({
  selector: 'jupiter-credit-card-payment',
  templateUrl: './credit-card-payment.component.html',
  styleUrls: ['./credit-card-payment.component.scss']
})
export class CreditCardPaymentComponent implements OnInit {
  @Input() creditCardPayment: CreditCardInfo;

  constructor() { }

  ngOnInit() {
  }

}
