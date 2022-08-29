import { TestBed } from '@angular/core/testing';

import { AutocompleteProviderService } from './autocomplete-provider.service';

describe('AutocompleteProviderService', () => {
  let service: AutocompleteProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutocompleteProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
