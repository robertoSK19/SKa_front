import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfKabecAccesoriosComponent } from './pdf-kabec-accesorios.component';

describe('PdfKabecAccesoriosComponent', () => {
  let component: PdfKabecAccesoriosComponent;
  let fixture: ComponentFixture<PdfKabecAccesoriosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfKabecAccesoriosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfKabecAccesoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
