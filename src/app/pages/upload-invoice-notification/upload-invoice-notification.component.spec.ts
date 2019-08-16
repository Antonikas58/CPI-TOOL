import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadInvoiceNotificationComponent } from './upload-invoice-notification.component';

describe('UploadInvoiceNotificationComponent', () => {
  let component: UploadInvoiceNotificationComponent;
  let fixture: ComponentFixture<UploadInvoiceNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadInvoiceNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadInvoiceNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
