import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectNomenclatureComponent } from './multiselect-nomenclature.component';

describe('MultiselectNomenclatureComponent', () => {
  let component: MultiselectNomenclatureComponent;
  let fixture: ComponentFixture<MultiselectNomenclatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiselectNomenclatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectNomenclatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
