import { TestBed } from '@angular/core/testing';

import { Coingecko } from './coingecko';

describe('Coingecko', () => {
  let service: Coingecko;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Coingecko);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
