import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioSuraComponent } from './formulario-sura.component';

describe('FormularioSuraComponent', () => {
  let component: FormularioSuraComponent;
  let fixture: ComponentFixture<FormularioSuraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioSuraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioSuraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
