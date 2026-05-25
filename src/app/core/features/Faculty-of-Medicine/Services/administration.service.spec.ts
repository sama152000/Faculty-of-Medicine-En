/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AdministrationService } from './administration.service';

describe('Service: Administration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdministrationService]
    });
  });

  it('should ...', inject([AdministrationService], (service: AdministrationService) => {
    expect(service).toBeTruthy();
  }));
});
