import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexResponsivasComponent } from './index-responsivas.component';

describe('IndexResponsivasComponent', () => {
  let component: IndexResponsivasComponent;
  let fixture: ComponentFixture<IndexResponsivasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexResponsivasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexResponsivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
