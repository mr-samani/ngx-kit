import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMessageComponent } from './message.component';

describe('NgxMessageComponent', () => {
  let component: NgxMessageComponent;
  let fixture: ComponentFixture<NgxMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgxMessageComponent]
    });
    fixture = TestBed.createComponent(NgxMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
