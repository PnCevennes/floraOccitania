import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEthnobotaComponent } from './form-ethnobota.component';

describe('FormEthnobotaComponent', () => {
  let component: FormEthnobotaComponent;
  let fixture: ComponentFixture<FormEthnobotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEthnobotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEthnobotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
