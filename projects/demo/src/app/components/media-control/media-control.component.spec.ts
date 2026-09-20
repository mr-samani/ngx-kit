import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemoMediaControlComponent } from './media-control.component';
import { ExampleShowcaseComponent } from '@demo/shared/showcase/example-showcase.component';

describe('DemoMediaControlComponent', () => {
  let component: DemoMediaControlComponent;
  let fixture: ComponentFixture<DemoMediaControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoMediaControlComponent, ExampleShowcaseComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(DemoMediaControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
