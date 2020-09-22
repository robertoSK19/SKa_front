import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAccesoriosComponent } from './editar-accesorios.component';

describe('EditarAccesoriosComponent', () => {
  let component: EditarAccesoriosComponent;
  let fixture: ComponentFixture<EditarAccesoriosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarAccesoriosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarAccesoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
