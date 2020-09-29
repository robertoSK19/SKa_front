import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSoftwareComponent } from './editar-software.component';

describe('EditarSoftwareComponent', () => {
  let component: EditarSoftwareComponent;
  let fixture: ComponentFixture<EditarSoftwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarSoftwareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
