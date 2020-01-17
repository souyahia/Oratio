import { TestBed } from '@angular/core/testing';

import { ChecklistOperatorService } from './checklist-operator.service';

describe('ChecklistOperatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChecklistOperatorService = TestBed.get(ChecklistOperatorService);
    expect(service).toBeTruthy();
  });
});
