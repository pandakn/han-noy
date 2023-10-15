import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillMenuComponent } from './bill-menu.component';

describe('BillMenuComponent', () => {
  let component: BillMenuComponent;
  let fixture: ComponentFixture<BillMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillMenuComponent]
    });
    fixture = TestBed.createComponent(BillMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
