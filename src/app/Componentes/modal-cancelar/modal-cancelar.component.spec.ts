import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCancelarComponent } from './modal-cancelar.component';

describe('ModalCancelarComponent', () => {
  let component: ModalCancelarComponent;
  let fixture: ComponentFixture<ModalCancelarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCancelarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCancelarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
