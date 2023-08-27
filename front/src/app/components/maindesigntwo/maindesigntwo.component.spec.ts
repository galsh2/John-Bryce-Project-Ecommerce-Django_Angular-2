import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindesigntwoComponent } from './maindesigntwo.component';

describe('MaindesigntwoComponent', () => {
  let component: MaindesigntwoComponent;
  let fixture: ComponentFixture<MaindesigntwoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaindesigntwoComponent]
    });
    fixture = TestBed.createComponent(MaindesigntwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
