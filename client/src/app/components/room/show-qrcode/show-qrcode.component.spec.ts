import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowQrcodeComponent } from './show-qrcode.component';

describe('ShowQrcodeComponent', () => {
  let component: ShowQrcodeComponent;
  let fixture: ComponentFixture<ShowQrcodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowQrcodeComponent]
    });
    fixture = TestBed.createComponent(ShowQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
