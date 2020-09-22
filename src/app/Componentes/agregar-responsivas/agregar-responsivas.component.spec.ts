import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarResponsivasComponent } from './agregar-responsivas.component';

describe('AgregarResponsivasComponent', () => {
  let component: AgregarResponsivasComponent;
  let fixture: ComponentFixture<AgregarResponsivasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarResponsivasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarResponsivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
