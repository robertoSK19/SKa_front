import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexAccesoriosComponent } from './index-accesorios.component';

describe('IndexAccesoriosComponent', () => {
  let component: IndexAccesoriosComponent;
  let fixture: ComponentFixture<IndexAccesoriosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexAccesoriosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexAccesoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
