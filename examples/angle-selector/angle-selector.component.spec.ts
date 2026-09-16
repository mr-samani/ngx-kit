/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AngleSelectorComponent } from './angle-selector.component';
import { NgxAngleSelectorComponent, NgxInputAngle } from 'ngx-kit/angle-selector';

describe('AngleSelectorComponent', () => {
  let component: AngleSelectorComponent;
  let fixture: ComponentFixture<AngleSelectorComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [AngleSelectorComponent, FormsModule, NgxInputAngle, NgxAngleSelectorComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AngleSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
