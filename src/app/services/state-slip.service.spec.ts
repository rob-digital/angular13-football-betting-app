import { TestBed } from '@angular/core/testing';

import { StateSlipService } from './state-slip.service';

describe('StateSlipService', () => {
  let service: StateSlipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateSlipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
