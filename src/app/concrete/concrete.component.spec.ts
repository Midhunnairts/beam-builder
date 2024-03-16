import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcreteComponent } from './concrete.component';

describe('ConcreteComponent', () => {
  let component: ConcreteComponent;
  let fixture: ComponentFixture<ConcreteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConcreteComponent]
    });
    fixture = TestBed.createComponent(ConcreteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
