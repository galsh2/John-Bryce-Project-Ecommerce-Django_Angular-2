import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostuserprofileComponent } from './postuserprofile.component';

describe('PostuserprofileComponent', () => {
  let component: PostuserprofileComponent;
  let fixture: ComponentFixture<PostuserprofileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostuserprofileComponent]
    });
    fixture = TestBed.createComponent(PostuserprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
