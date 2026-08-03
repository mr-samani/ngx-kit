import { TestBed } from '@angular/core/testing';

import { NgxMessageService } from './message.service';

describe('NgxMessageService', () => {
  let service: NgxMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
