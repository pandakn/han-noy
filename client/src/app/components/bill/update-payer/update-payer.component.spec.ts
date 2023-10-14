import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePayerComponent } from './update-payer.component';

describe('UpdatePayerComponent', () => {
  let component: UpdatePayerComponent;
  let fixture: ComponentFixture<UpdatePayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePayerComponent]
    });
    fixture = TestBed.createComponent(UpdatePayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
