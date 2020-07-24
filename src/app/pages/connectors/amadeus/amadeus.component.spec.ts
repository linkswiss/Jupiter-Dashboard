import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmadeusComponent } from './amadeus.component';

describe('AmadeusComponent', () => {
  let component: AmadeusComponent;
  let fixture: ComponentFixture<AmadeusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmadeusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmadeusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
