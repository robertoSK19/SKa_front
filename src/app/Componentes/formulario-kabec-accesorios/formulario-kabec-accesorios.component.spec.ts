import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioKabecAccesoriosComponent } from './formulario-kabec-accesorios.component';

describe('FormularioKabecAccesoriosComponent', () => {
  let component: FormularioKabecAccesoriosComponent;
  let fixture: ComponentFixture<FormularioKabecAccesoriosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioKabecAccesoriosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioKabecAccesoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
