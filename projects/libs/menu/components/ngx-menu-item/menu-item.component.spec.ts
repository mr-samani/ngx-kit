import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMenuItem } from './menu-item.component';

describe('NgxMenuItem', () => {
  let component: NgxMenuItem;
  let fixture: ComponentFixture<NgxMenuItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMenuItem],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxMenuItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
