import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDemo } from './dialog';

describe('Dialog', () => {
  let component: DialogDemo;
  let fixture: ComponentFixture<DialogDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
