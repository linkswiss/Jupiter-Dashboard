import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardPaymentComponent } from './credit-card-payment.component';

describe('CreditCardPaymentComponent', () => {
  let component: CreditCardPaymentComponent;
  let fixture: ComponentFixture<CreditCardPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditCardPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
