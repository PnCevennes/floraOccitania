import { TestBed } from '@angular/core/testing';

import { FloraOccitaniaService } from './flora-occitania.service';

describe('FloraOccitaniaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FloraOccitaniaService = TestBed.get(FloraOccitaniaService);
    expect(service).toBeTruthy();
  });
});
