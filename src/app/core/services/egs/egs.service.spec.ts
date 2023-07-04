import { TestBed } from '@angular/core/testing';

import { EgsService } from './egs.service';

describe('EgsService', () => {
  let service: EgsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EgsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
