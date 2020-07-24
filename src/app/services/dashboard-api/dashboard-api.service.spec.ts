import { TestBed } from '@angular/core/testing';

import { DashboardApiService } from './dashboard-api.service';

describe('DashboardApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardApiService = TestBed.get(DashboardApiService);
    expect(service).toBeTruthy();
  });
});
