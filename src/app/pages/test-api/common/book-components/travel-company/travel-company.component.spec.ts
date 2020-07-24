import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelCompanyComponent } from './travel-company.component';

describe('TravelCompanyComponent', () => {
  let component: TravelCompanyComponent;
  let fixture: ComponentFixture<TravelCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
