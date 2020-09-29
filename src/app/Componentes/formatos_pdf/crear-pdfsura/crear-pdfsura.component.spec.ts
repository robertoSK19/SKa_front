import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPDFSuraComponent } from './crear-pdfsura.component';

describe('CrearPDFSuraComponent', () => {
  let component: CrearPDFSuraComponent;
  let fixture: ComponentFixture<CrearPDFSuraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearPDFSuraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPDFSuraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
