import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SabreCrypticComponent } from './sabre-cryptic.component';

describe('SabreCrypticComponent', () => {
  let component: SabreCrypticComponent;
  let fixture: ComponentFixture<SabreCrypticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SabreCrypticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SabreCrypticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
