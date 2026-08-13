import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CellRendererComponent, TableFieldBase } from 'ngx-kit/data-table';

@Component({
  selector: 'app-image-cell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (value()) {
      <img
        class="table-image"
        [src]="value()!"
        [alt]="alt()"
        loading="lazy"
        (error)="onImageError($event)" />
    } @else {
      <span class="image-placeholder">No image</span>
    }
  `,
  styles: `
    .table-image {
      display: block;
      width: 56px;
      height: 40px;
      border-radius: 6px;
      object-fit: cover;
    }
    .image-placeholder {
      font-size: 12px;
      opacity: 0.6;
    }
  `,
})
export class ImageCellRenderer<T extends object> implements CellRendererComponent<
  string | null,
  T
> {
  readonly value = input.required<string | null>();
  readonly row = input.required<T>();
  readonly field = input.required<TableFieldBase<T>>();

  readonly alt = input('Image');

  // متد public با آرگومان است، پس خودش از استخراج rendererInputs مستثنی
  // می‌شود؛ protected هم شده که این مسئله همیشه صریح و مستند بماند.
  protected onImageError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
