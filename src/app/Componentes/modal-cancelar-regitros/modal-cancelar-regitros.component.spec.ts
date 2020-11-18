import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCancelarRegitrosComponent } from './modal-cancelar-regitros.component';

describe('ModalCancelarRegitrosComponent', () => {
  let component: ModalCancelarRegitrosComponent;
  let fixture: ComponentFixture<ModalCancelarRegitrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCancelarRegitrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCancelarRegitrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
