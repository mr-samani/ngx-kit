import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMenuDivider } from './menu-divider.component';

describe('NgxMenuDivider', () => {
  let component: NgxMenuDivider;
  let fixture: ComponentFixture<NgxMenuDivider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMenuDivider],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxMenuDivider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
