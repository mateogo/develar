import { TestBed } from '@angular/core/testing';

import { CensoIndustrialService } from './censo-industrial.service';

describe('CensoIndustrialService', () => {
  let service: CensoIndustrialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CensoIndustrialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
