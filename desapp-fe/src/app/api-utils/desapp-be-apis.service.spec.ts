import { TestBed } from '@angular/core/testing';

import { DesappBeApisService } from './desapp-be-apis.service';

describe('DesappBeApisService', () => {
  let service: DesappBeApisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesappBeApisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
