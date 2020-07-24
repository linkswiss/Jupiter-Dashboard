import { TestBed } from '@angular/core/testing';

import { JupiterApiService } from './jupiter-api.service';

describe('JupiterApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JupiterApiService = TestBed.get(JupiterApiService);
    expect(service).toBeTruthy();
  });
});
