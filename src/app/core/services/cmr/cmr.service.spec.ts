import { TestBed } from '@angular/core/testing';

import { CmrService } from './cmr.service';

describe('CmrService', () => {
  let service: CmrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CmrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
