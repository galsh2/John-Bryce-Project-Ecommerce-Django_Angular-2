import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindesignComponent } from './maindesign.component';

describe('MaindesignComponent', () => {
  let component: MaindesignComponent;
  let fixture: ComponentFixture<MaindesignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaindesignComponent]
    });
    fixture = TestBed.createComponent(MaindesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
