import { TestBed } from '@angular/core/testing';

import { HotelPagesService } from './hotel-pages.service';

describe('HotelPagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HotelPagesService = TestBed.get(HotelPagesService);
    expect(service).toBeTruthy();
  });
});
