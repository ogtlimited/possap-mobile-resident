import { TestBed } from '@angular/core/testing';

import { FormProcessorService } from './form-processor.service';

describe('FormProcessorService', () => {
  let service: FormProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
