import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayForeignkeyArrayComponent } from './display-foreignkey-array.component';

describe('DisplayForeignkeyArrayComponent', () => {
  let component: DisplayForeignkeyArrayComponent;
  let fixture: ComponentFixture<DisplayForeignkeyArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayForeignkeyArrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayForeignkeyArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
