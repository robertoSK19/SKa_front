import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPDFComponent } from './crear-pdf.component';

describe('CrearPDFComponent', () => {
  let component: CrearPDFComponent;
  let fixture: ComponentFixture<CrearPDFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearPDFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
