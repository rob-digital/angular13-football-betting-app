import { TestBed } from '@angular/core/testing';

import { AllGamesService } from './all-games.service';

describe('FutureGamesService', () => {
  let service: AllGamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllGamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
