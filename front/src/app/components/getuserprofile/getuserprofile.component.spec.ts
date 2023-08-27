import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetuserprofileComponent } from './getuserprofile.component';

describe('GetuserprofileComponent', () => {
  let component: GetuserprofileComponent;
  let fixture: ComponentFixture<GetuserprofileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetuserprofileComponent]
    });
    fixture = TestBed.createComponent(GetuserprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
