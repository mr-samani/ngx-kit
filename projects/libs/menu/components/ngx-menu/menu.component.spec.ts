import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMenuPanel } from './menu.component';

describe('NgxMenuPanel', () => {
  let component: NgxMenuPanel;
  let fixture: ComponentFixture<NgxMenuPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMenuPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxMenuPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
