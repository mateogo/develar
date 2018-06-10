import { TestBed, inject } from '@angular/core/testing';

import { IssuesControllerService } from './issues-controller.service';

describe('IssuesControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IssuesControllerService]
    });
  });

  it('should be created', inject([IssuesControllerService], (service: IssuesControllerService) => {
    expect(service).toBeTruthy();
  }));
});
