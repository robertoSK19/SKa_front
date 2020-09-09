import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexEquiposComponent } from './index-equipos.component';

describe('IndexEquiposComponent', () => {
  let component: IndexEquiposComponent;
  let fixture: ComponentFixture<IndexEquiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexEquiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
