import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRoomDetailsComponent } from './single-room-details.component';

describe('SingleRoomDetailsComponent', () => {
  let component: SingleRoomDetailsComponent;
  let fixture: ComponentFixture<SingleRoomDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleRoomDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRoomDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
