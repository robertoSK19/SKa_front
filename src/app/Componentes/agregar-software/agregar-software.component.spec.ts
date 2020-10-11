import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarSoftwareComponent } from './agregar-software.component';

describe('AgregarSoftwareComponent', () => {
  let component: AgregarSoftwareComponent;
  let fixture: ComponentFixture<AgregarSoftwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarSoftwareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
