import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarAccesoriosComponent } from './agregar-accesorios.component';

describe('AgregarAccesoriosComponent', () => {
  let component: AgregarAccesoriosComponent;
  let fixture: ComponentFixture<AgregarAccesoriosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarAccesoriosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarAccesoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
