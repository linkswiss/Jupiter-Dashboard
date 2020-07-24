import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmadeusCrypticComponent } from './amadeus-cryptic.component';

describe('AmadeusCrypticComponent', () => {
  let component: AmadeusCrypticComponent;
  let fixture: ComponentFixture<AmadeusCrypticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmadeusCrypticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmadeusCrypticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
