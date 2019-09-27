import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayNomenclatureValueComponent } from './display-nomenclature-value.component';

describe('DisplayNomenclatureValueComponent', () => {
  let component: DisplayNomenclatureValueComponent;
  let fixture: ComponentFixture<DisplayNomenclatureValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayNomenclatureValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayNomenclatureValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
