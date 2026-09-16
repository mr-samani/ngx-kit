import {
  Component,
  HostListener,
  input,
  model,
  output,
  signal,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BoxShadow } from '../../contracts/BoxShadowValue';
import { NgxInputColor } from 'ngx-kit/color-picker';
import { formatBoxShadowToCSS } from '../../utils/box-shadow-parser';
import { getOffsetPosition } from 'ngx-kit/core';

@Component({
  selector: 'ngx-shadow-control',
  templateUrl: './shadow-control.html',
  styleUrl: './shadow-control.scss',
  imports: [FormsModule, NgxInputColor],
})
export class NgxShadowControl implements OnInit {
  protected readonly maxRange = input(25);
  readonly selectedShadow = model.required<BoxShadow>();

  private _previousCssValue?: string = '';
  readonly shadowChange = output<BoxShadow>();

  padRect?: DOMRect;
  flashlightRect?: DOMRect;
  center: { x: number; y: number } = { x: 0, y: 0 };
  x = signal(0);
  y = signal(0);
  isDragging = false;
  @ViewChild('pad', { static: false }) pad!: ElementRef<HTMLDivElement>;
  @ViewChild('flashlight', { static: false }) flashlight!: ElementRef<SVGSVGElement>;

  private radius: number = 0;

  ngOnInit(): void {
    this.setXyFromShadow(this.selectedShadow());
    this._previousCssValue = this.selectedShadow().cssValue;
  }

  onPadClick(ev: MouseEvent | TouchEvent) {
    const position = getOffsetPosition(ev, this.pad.nativeElement);
    this.isDragging = true;
    this.updatePosition(position);
  }

  dragStart(ev: MouseEvent | TouchEvent) {
    ev.stopPropagation();
    ev.preventDefault();
    this.updateContainerDimensions();
    this.isDragging = true;
    const position = getOffsetPosition(ev, this.pad.nativeElement);
    this.updatePosition(position);
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onDragEnd(ev: MouseEvent | TouchEvent) {
    this.isDragging = false;
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  onMouseMove(ev: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    const position = getOffsetPosition(ev, this.pad.nativeElement);
    this.updatePosition(position);
  }

  private updatePosition(position: { x: number; y: number }) {
    const padRec = this.padRect!;
    const flashlightRec = this.flashlightRect!;

    const centerX = this.center.x;
    const centerY = this.center.y;

    const dx = position.x - centerX;
    const dy = position.y - centerY;

    // زاویه
    const angleRad = Math.atan2(dy, dx);
    const minX = flashlightRec.width / 2;
    const maxX = padRec.width - flashlightRec.width / 2;
    const minY = flashlightRec.height / 2;
    const maxY = padRec.height - flashlightRec.height / 2;
    const clampedX = Math.max(minX, Math.min(position.x, maxX));
    const clampedY = Math.max(minY, Math.min(position.y, maxY));

    // فقط یکبار از وسط اصلاح کن
    this.x.set(clampedX - flashlightRec.width / 2);
    this.y.set(clampedY - flashlightRec.height / 2);

    // ✅ ولی مقدار واقعی shadow رو از موقعیت موس (dx, dy) بگیر
    const halfRangeX = (padRec.width - flashlightRec.width) / 2;
    const halfRangeY = (padRec.height - flashlightRec.height) / 2;

    let valueX = (-dx / halfRangeX) * this.maxRange();
    let valueY = (-dy / halfRangeY) * this.maxRange();

    valueX = Math.round(Math.min(Math.max(valueX, -this.maxRange()), this.maxRange()));
    valueY = Math.round(Math.min(Math.max(valueY, -this.maxRange()), this.maxRange()));

    // چرخش چراغ قوه
    const angleDeg = angleRad * (180 / Math.PI);
    if (this.flashlight.nativeElement) {
      this.flashlight.nativeElement.style.transform = `rotate(${angleDeg + 180}deg)`;
    }

    // آپدیت shadow
    this.selectedShadow.set({
      ...this.selectedShadow(),
      xOffset: valueX,
      yOffset: valueY,
    });
    this.updateShadow(this.selectedShadow());
  }

  private updateContainerDimensions() {
    setTimeout(() => {
      if (!this.pad) return;
      this.padRect = this.pad.nativeElement.getBoundingClientRect();
      this.flashlightRect = this.flashlight.nativeElement.getBoundingClientRect();
      this.center = { x: this.padRect.width / 2, y: this.padRect.height / 2 };
      this.radius =
        Math.min(this.padRect.width, this.padRect.height) / 2 - this.flashlightRect.width / 2;
      this.x.set(0); // Reset to center
      this.y.set(0);
    });
  }

  updateShadow(updatedShadow: Partial<BoxShadow>) {
    this.selectedShadow().cssValue = formatBoxShadowToCSS([this.selectedShadow()]);
    this.setXyFromShadow(this.selectedShadow());
    if (this._previousCssValue != this.selectedShadow().cssValue) {
      this.shadowChange.emit(this.selectedShadow());
    }
  }

  setXyFromShadow(item: BoxShadow) {
    this.updateContainerDimensions();
    setTimeout(() => {
      const padRec = this.padRect!;
      const flashlightRec = this.flashlightRect!;
      const centerX = this.center.x;
      const centerY = this.center.y;

      const halfRangeX = (padRec.width - flashlightRec.width) / 2;
      const halfRangeY = (padRec.height - flashlightRec.height) / 2;

      // معکوس فرمول برای به‌دست آوردن dx , dy
      const dx = -(item.xOffset / this.maxRange()) * halfRangeX;
      const dy = -(item.yOffset / this.maxRange()) * halfRangeY;

      // موقعیت واقعی چراغ‌قوه
      const posX = centerX + dx;
      const posY = centerY + dy;

      this.x.set(posX - flashlightRec.width / 2);
      this.y.set(posY - flashlightRec.height / 2);

      // زاویه چراغ‌قوه
      const angleRad = Math.atan2(dy, dx);
      const angleDeg = angleRad * (180 / Math.PI);
      if (this.flashlight.nativeElement) {
        this.flashlight.nativeElement.style.transform = `rotate(${angleDeg + 180}deg)`;
      }
    });
  }

  close() {}
}
