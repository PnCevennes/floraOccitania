import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonDetailComponent } from './taxon-detail.component';

describe('TaxonDetailComponent', () => {
  let component: TaxonDetailComponent;
  let fixture: ComponentFixture<TaxonDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxonDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
