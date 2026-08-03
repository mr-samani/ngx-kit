import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCostomDialog } from './my-costom-dialog';

describe('MyCostomDialog', () => {
  let component: MyCostomDialog;
  let fixture: ComponentFixture<MyCostomDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCostomDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(MyCostomDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
