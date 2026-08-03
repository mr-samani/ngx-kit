/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgxInputGradientComponent, NgxInputGradient } from 'ngx-kit/gradient-picker';
import { GradientPickerComponent } from './gradient-picker.component';

describe('GradientPickerComponent', () => {
  let component: GradientPickerComponent;
  let fixture: ComponentFixture<GradientPickerComponent>;

  beforeEach(async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    TestBed.configureTestingModule({
      declarations: [],
      imports: [GradientPickerComponent, FormsModule, NgxInputGradient, NgxInputGradientComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(GradientPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
