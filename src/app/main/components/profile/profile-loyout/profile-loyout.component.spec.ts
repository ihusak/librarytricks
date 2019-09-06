import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLoyoutComponent } from './profile-loyout.component';

describe('ProfileLoyoutComponent', () => {
  let component: ProfileLoyoutComponent;
  let fixture: ComponentFixture<ProfileLoyoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileLoyoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLoyoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
