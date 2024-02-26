import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAfterLoginComponent } from './dashboard.component';

describe('HomeAfterLoginComponent', () => {
  let component: HomeAfterLoginComponent;
  let fixture: ComponentFixture<HomeAfterLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeAfterLoginComponent]
    });
    fixture = TestBed.createComponent(HomeAfterLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
