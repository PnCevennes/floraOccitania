import { TestBed } from '@angular/core/testing';

import { NomenclatureService } from './nomenclature.service';

describe('NomenclatureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NomenclatureService = TestBed.get(NomenclatureService);
    expect(service).toBeTruthy();
  });
});
