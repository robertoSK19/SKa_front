import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioKabecComponent } from './formulario-kabec.component';

describe('FormularioKabecComponent', () => {
  let component: FormularioKabecComponent;
  let fixture: ComponentFixture<FormularioKabecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioKabecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioKabecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
