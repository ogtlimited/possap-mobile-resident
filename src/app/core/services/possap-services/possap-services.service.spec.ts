import { TestBed } from '@angular/core/testing';

import { PossapServicesService } from './possap-services.service';

describe('PossapServicesService', () => {
  let service: PossapServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PossapServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
