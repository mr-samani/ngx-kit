import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCostomDialog } from './my-costom-dialog';
import { DIALOG_REF, NgxDialogModule } from 'ngx-kit/dialog';

describe('MyCostomDialog', () => {
  let component: MyCostomDialog;
  let fixture: ComponentFixture<MyCostomDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCostomDialog, NgxDialogModule],
      providers: [
        {
          provide: DIALOG_REF,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyCostomDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
