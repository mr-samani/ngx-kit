import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCustomDialog } from './my-custom-dialog';
import { DIALOG_REF, NgxDialogModule } from 'ngx-kit/dialog';

describe('MyCustomDialog', () => {
  let component: MyCustomDialog;
  let fixture: ComponentFixture<MyCustomDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCustomDialog, NgxDialogModule],
      providers: [
        {
          provide: DIALOG_REF,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyCustomDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
